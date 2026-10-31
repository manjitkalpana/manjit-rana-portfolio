import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

type Feed = { id: string; name: string; feed_url: string; country_code: string | null; category: string | null };
type Discovery = { id: string; source_id: string | null; title: string; url: string; summary: string | null; country_code: string | null; suggested_category: string | null; duplicate_group: string | null; draft_headline: string | null; draft_summary: string | null };
function clean(value: string) { return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim(); }
function tag(block: string, name: string) { const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i")); return match ? clean(match[1]) : ""; }
function entries(xml: string) {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);
  return blocks.map((block) => {
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
    const link = linkMatch?.[1] ?? tag(block, "link");
    const title = tag(block, "title");
    const description = tag(block, "description") || tag(block, "summary") || tag(block, "content");
    const date = tag(block, "pubDate") || tag(block, "published") || tag(block, "updated");
    return { title, url: link, summary: description.slice(0, 1200), published_at: date && !Number.isNaN(Date.parse(date)) ? new Date(date).toISOString() : new Date().toISOString() };
  }).filter((x) => x.title && /^https?:\/\//i.test(x.url));
}
function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || createHash("sha1").update(value).digest("hex").slice(0, 12);
}
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const base = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return NextResponse.json({ error: "Supabase server environment is not configured" }, { status: 503 });
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const db = (path: string, init?: RequestInit) => fetch(`${base}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init?.headers ?? {}) }, cache: "no-store" });
  const sourceResponse = await db("sources?select=id,name,feed_url,country_code,category&is_active=eq.true&feed_url=not.is.null&limit=30");
  if (!sourceResponse.ok) return NextResponse.json({ error: "Could not load active feeds", detail: await sourceResponse.text() }, { status: 502 });
  const feeds = await sourceResponse.json() as Feed[];
  const sourceNames = new Map(feeds.map((feed) => [feed.id, feed.name]));
  let discovered = 0, skipped = 0, failed = 0, autoPublished = 0;
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.feed_url, { headers: { "User-Agent": "ManjitRanaNewsBot/1.0 (+https://manjitrana.com.np/editorial-policy)" }, signal: AbortSignal.timeout(12000), cache: "no-store" });
      if (!response.ok) { failed++; continue; }
      const xml = await response.text();
      for (const item of entries(xml).slice(0, 20)) {
        const fingerprint = createHash("sha256").update(item.url).digest("hex");
        const normalizedTitle = item.title.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
        const duplicateGroup = createHash("sha256").update(normalizedTitle).digest("hex");
        const safeSummary = item.summary || "The original publisher has not supplied a summary. Read the linked report for details.";
        const draftBody = ["## What we know", safeSummary, "", "## Source", `This item was first identified by ${feed.name}. The original report is linked below.`, "", "## Verification status", "Single-source report. This discovery note has not been independently verified."].join("\\n");
        const result = await db("discovered_news?on_conflict=fingerprint", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ source_id: feed.id, title: item.title, url: item.url, summary: item.summary, published_at: item.published_at, fingerprint, country_code: feed.country_code, suggested_category: feed.category, status: "needs_review", normalized_title: normalizedTitle, duplicate_group: duplicateGroup, verification_status: "single_source", draft_headline: item.title, draft_summary: safeSummary.slice(0, 500), draft_body_md: draftBody, editorial_notes: "Auto-generated from RSS metadata. Awaiting independent publisher corroboration." }) });
        if (result.ok) discovered++; else skipped++;
      }
    } catch { failed++; }
  }

  // Automatic publication is deliberately limited to exact-title matches from at least two distinct publisher domains.
  const pendingResponse = await db("discovered_news?select=id,source_id,title,url,summary,country_code,suggested_category,duplicate_group,draft_headline,draft_summary&status=eq.needs_review&limit=5000");
  if (pendingResponse.ok) {
    const pending = await pendingResponse.json() as Discovery[];
    const groups = new Map<string, Discovery[]>();
    for (const item of pending) {
      if (!item.duplicate_group || !/^https?:\/\//i.test(item.url)) continue;
      const group = groups.get(item.duplicate_group) ?? [];
      group.push(item); groups.set(item.duplicate_group, group);
    }
    for (const group of groups.values()) {
      const byDomain = new Map<string, Discovery>();
      for (const item of group) {
        try {
          const domain = new URL(item.url).hostname.toLowerCase().replace(/^www\./, "");
          if (!byDomain.has(domain)) byDomain.set(domain, item);
        } catch { /* Ignore invalid source URLs. */ }
      }
      const supporting = [...byDomain.values()];
      if (supporting.length < 2) continue;
      const primary = supporting[0];
      const headline = primary.draft_headline || primary.title;
      let slug = slugify(headline);
      const existing = await db(`articles?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (existing.ok && (await existing.json()).length) slug = `${slug}-${primary.id.slice(0, 6)}`;
      const sourceIds = [...new Set(supporting.map((x) => x.source_id).filter((x): x is string => Boolean(x)))];
      if (sourceIds.length < 2) continue;
      const summary = primary.draft_summary || primary.summary || "Multiple independent publishers have reported this story. Follow the original reports for developing details.";
      const body = [`## Latest report\n\n${summary}`, "## Independent sources\n\nThis report was matched across at least two distinct publisher domains. Details may develop; consult the original reports linked below."].join("\n\n");
      const create = await db("articles", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ slug, headline, summary, body_md: body, category_name: primary.suggested_category || "Nepal", country_name: primary.country_code || null, status: "published", published_at: new Date().toISOString(), source_count: supporting.length, seo_title: headline }) });
      if (!create.ok) continue;
      const article = (await create.json())[0];
      const links = supporting.map((item) => ({ article_id: article.id, source_id: item.source_id, discovered_id: item.id, publisher_name: item.source_id ? (sourceNames.get(item.source_id) || "Original publisher") : "Original publisher", source_url: item.url }));
      const linkResult = await db("article_sources", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(links) });
      if (!linkResult.ok) {
        await db(`articles?id=eq.${article.id}`, { method: "PATCH", body: JSON.stringify({ status: "draft", published_at: null }) });
        continue;
      }
      const ids = supporting.map((item) => item.id);
      await db(`discovered_news?id=in.(${ids.join(",")})`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "published", verification_status: "corroborated", editorial_notes: "Automatically published after matching exact normalized headlines from at least two distinct publisher domains. This is source corroboration, not independent fact-checking." }) });
      autoPublished++;
    }
  }
  return NextResponse.json({ ok: true, feeds_checked: feeds.length, discovered, skipped, failed, auto_published: autoPublished, note: "Only exact-title matches from at least two distinct publisher domains are auto-published. Single-source and unmatched stories remain in the editorial review queue." });
}
