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

const CATEGORY_RULES: Array<[string, RegExp]> = [
  ["Politics", /\b(election|parliament|president|prime minister|minister|government|cabinet|political|politics|coalition|opposition|party leader|lawmakers|legislature|senate|congress|diplomat|diplomacy|foreign minister|constitution|referendum)\b/i],
  ["Business", /\b(business|company|companies|corporate|market|markets|stock|stocks|shares|economy|economic|inflation|trade|exports?|imports?|bank|banking|investment|investor|finance|startup|entrepreneur|profit|revenue|budget|tax|currency|rupee|dollar|ipo|merger|acquisition)\b/i],
  ["Technology", /\b(technology|tech|artificial intelligence|\bAI\b|software|cyber|internet|digital|smartphone|mobile app|semiconductor|chipmaker|robot|robotics|spaceX|satellite|telecom|social media|data breach|hacker|cybersecurity)\b/i],
  ["Sports", /\b(sport|sports|football|soccer|cricket|basketball|tennis|badminton|olympic|olympics|world cup|championship|tournament|league|fifa|icc|athlete|goal|match|coach|medal)\b/i],
  ["Science", /\b(science|scientist|researchers?|study finds|research study|discovery|physics|chemistry|biology|astronomy|nasa|experiment|clinical trial|genome|vaccine research)\b/i],
  ["Health", /\b(health|hospital|patient|patients|disease|outbreak|virus|infection|medical|medicine|doctor|doctors|surgery|mental health|public health|who warns|epidemic|pandemic)\b/i],
  ["Education", /\b(education|school|schools|university|universities|college|students?|teacher|teachers|exam|examination|curriculum|scholarship|campus|academic|literacy)\b/i],
  ["Environment", /\b(environment|climate|climate change|global warming|weather|flood|flooding|earthquake|landslide|wildfire|forest|forests|pollution|conservation|biodiversity|drought|storm|cyclone|disaster)\b/i],
  ["Entertainment", /\b(entertainment|film|movie|cinema|actor|actress|celebrity|music|singer|concert|television|tv series|streaming|netflix|festival|art exhibition|box office)\b/i],
  ["Culture", /\b(culture|cultural|heritage|tradition|religion|festival|literature|book|author|museum|language|archaeology|art|craft)\b/i],
  ["Crime", /\b(crime|police|arrest|arrested|murder|assault|robbery|theft|fraud|court|lawsuit|prosecutor|investigation|suspect|kidnap|trafficking|corruption|convicted|sentenced)\b/i],
  ["Nepal", /\b(nepal|nepali|kathmandu|pokhara|dhangadhi|kanchanpur|sudurpaschim|bagmati|koshi province|madhesh|lumbini province)\b/i]
];
function classifyCategory(title: string, summary: string, feedCategory: string | null) {
  const text = `${title} ${title} ${summary}`;
  const scores = CATEGORY_RULES.map(([name, pattern]) => ({ name, score: (text.match(new RegExp(pattern.source, "gi")) || []).length }));
  scores.sort((a,b) => b.score-a.score);
  if (scores[0]?.score > 0) return scores[0].name;
  const known = ["World","Nepal","Politics","Business","Technology","Science","Sports","Culture","Health","Education","Environment","Entertainment","Crime"];
  const normalized = (feedCategory || "").trim().toLowerCase();
  return known.find(name => name.toLowerCase() === normalized) || "World";
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
        const draftBody = ["## What we know", safeSummary, "", "## Source", `This item was first identified by ${feed.name}. The original report is linked below.`, "", "## Verification status", "Single-source report. This discovery note has not been independently verified."].join("\n");
        const result = await db("discovered_news?on_conflict=fingerprint", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ source_id: feed.id, title: item.title, url: item.url, summary: item.summary, published_at: item.published_at, fingerprint, country_code: feed.country_code, suggested_category: classifyCategory(item.title, safeSummary, feed.category), status: "needs_review", normalized_title: normalizedTitle, duplicate_group: duplicateGroup, verification_status: "single_source", draft_headline: item.title, draft_summary: safeSummary.slice(0, 500), draft_body_md: draftBody, editorial_notes: "Auto-generated from RSS metadata. Awaiting independent publisher corroboration." }) });
        if (result.ok) discovered++; else skipped++;
      }
    } catch { failed++; }
  }

  // Discovery only: never publish from RSS title matching alone. Editors must verify reporting and publish from the newsroom.
  return NextResponse.json({ ok: true, feeds_checked: feeds.length, discovered, skipped, failed, auto_published: autoPublished, note: "RSS discoveries are saved for editorial review only. No story is auto-published; an editor must verify the original reports and publish manually." });
}
