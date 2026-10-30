import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

type Feed = { id: string; name: string; feed_url: string; country_code: string | null; category: string | null };
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
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return NextResponse.json({ error: "Supabase server environment is not configured" }, { status: 503 });
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" };
  const sourceResponse = await fetch(`${base}/rest/v1/sources?select=id,name,feed_url,country_code,category&is_active=eq.true&feed_url=not.is.null&limit=30`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" });
  if (!sourceResponse.ok) return NextResponse.json({ error: "Could not load active feeds", detail: await sourceResponse.text() }, { status: 502 });
  const feeds = await sourceResponse.json() as Feed[];
  let discovered = 0, skipped = 0, failed = 0;
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.feed_url, { headers: { "User-Agent": "ManjitRanaNewsBot/1.0 (+https://manjitrana.com.np/editorial-policy)" }, signal: AbortSignal.timeout(12000), cache: "no-store" });
      if (!response.ok) { failed++; continue; }
      const xml = await response.text();
      for (const item of entries(xml).slice(0, 20)) {
        const fingerprint = createHash("sha256").update(item.url).digest("hex");
        const result = await fetch(`${base}/rest/v1/discovered_news?on_conflict=fingerprint`, { method: "POST", headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ source_id: feed.id, title: item.title, url: item.url, summary: item.summary, published_at: item.published_at, fingerprint, country_code: feed.country_code, suggested_category: feed.category, status: "collected" }) });
        if (result.ok) discovered++; else skipped++;
      }
    } catch { failed++; }
  }
  return NextResponse.json({ ok: true, feeds_checked: feeds.length, discovered, skipped, failed, note: "Collected items are not published. Editorial verification and AI processing are separate required stages." });
}
