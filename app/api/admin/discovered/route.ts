import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function config() {
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error("Supabase server environment is not configured.");
  return { base: base.replace(/\/$/, ""), key };
}
function headers(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}
async function db(path: string, init?: RequestInit) {
  const { base, key } = config();
  return fetch(`${base}/rest/v1/${path}`, {
    ...init, headers: { ...headers(key), ...(init?.headers ?? {}) }, cache: "no-store"
  });
}
function slugify(value: string) {
  const slug = value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
  return slug || createHash("sha1").update(value).digest("hex").slice(0, 12);
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [itemsResponse, countsResponse] = await Promise.all([
      db("discovered_news?select=id,title,url,summary,published_at,created_at,status,verification_status,draft_headline,draft_summary,draft_body_md,editorial_notes,normalized_title,duplicate_group,source_id,country_code,suggested_category&order=created_at.desc&limit=150"),
      db("discovered_news?select=status,verification_status&limit=10000")
    ]);
    if (!itemsResponse.ok) return NextResponse.json({ error: await itemsResponse.text() }, { status: 502 });
    if (!countsResponse.ok) return NextResponse.json({ error: await countsResponse.text() }, { status: 502 });
    const items = await itemsResponse.json();
    const all = await countsResponse.json();
    const stats = {
      total: all.length,
      needsReview: all.filter((x: {status:string}) => x.status === "needs_review").length,
      corroborated: all.filter((x: {verification_status:string}) => x.verification_status === "corroborated").length,
      rejected: all.filter((x: {status:string}) => x.status === "rejected").length,
      published: all.filter((x: {status:string}) => x.status === "published").length
    };
    return NextResponse.json({ items, stats });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load newsroom." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const action = typeof body.action === "string" ? body.action : "";
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid story ID." }, { status: 400 });

    const itemResponse = await db(`discovered_news?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!itemResponse.ok) return NextResponse.json({ error: "Could not load story." }, { status: 502 });
    const rows = await itemResponse.json();
    const item = rows[0];
    if (!item) return NextResponse.json({ error: "Story not found." }, { status: 404 });

    if (action === "verify") {
      const groupFilter = item.duplicate_group
        ? `duplicate_group=eq.${encodeURIComponent(item.duplicate_group)}`
        : `id=eq.${id}`;
      const groupResponse = await db(`discovered_news?select=id,source_id&${groupFilter}&limit=50`);
      if (!groupResponse.ok) return NextResponse.json({ error: "Could not check supporting sources." }, { status: 502 });
      const groupRows = await groupResponse.json();
      const distinctSources = [...new Set(groupRows.map((x: {source_id:string|null}) => x.source_id).filter(Boolean))];
      if (distinctSources.length < 2) {
        return NextResponse.json({ error: "At least two independent publisher records are needed in this duplicate group before it can be marked corroborated. Check for another report from a different source first." }, { status: 409 });
      }
      const update = await db(`discovered_news?${groupFilter}`, {
        method: "PATCH", headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ verification_status: "corroborated", editorial_notes: "Editor reviewed this duplicate group and marked it corroborated. Recheck each original report before publication." })
      });
      if (!update.ok) return NextResponse.json({ error: await update.text() }, { status: 502 });
      return NextResponse.json({ ok: true, message: `Marked as corroborated using ${distinctSources.length} distinct publisher records in this group.` });
    }

    if (action === "reject") {
      const update = await db(`discovered_news?id=eq.${id}`, {
        method: "PATCH", headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status: "rejected", verification_status: "rejected" })
      });
      if (!update.ok) return NextResponse.json({ error: await update.text() }, { status: 502 });
      return NextResponse.json({ ok: true });
    }

    if (action === "publish") {
      if (item.verification_status !== "corroborated") {
        return NextResponse.json({ error: "Mark the story as editor-verified before publishing." }, { status: 409 });
      }
      const groupFilter = item.duplicate_group
        ? `duplicate_group=eq.${encodeURIComponent(item.duplicate_group)}`
        : `id=eq.${id}`;
      const groupResponse = await db(`discovered_news?select=id,source_id,url,title&${groupFilter}&verification_status=eq.corroborated&limit=30`);
      if (!groupResponse.ok) return NextResponse.json({ error: "Could not load supporting source records." }, { status: 502 });
      const supporting = await groupResponse.json() as Array<{ id: string; source_id: string | null; url: string; title: string }>;
      const sourceIds = [...new Set(supporting.map((x: {source_id:string|null}) => x.source_id).filter(Boolean))];
      const uniqueUrls = [...new Map<string, { id: string; source_id: string | null; url: string; title: string }>(supporting.map((x) => [x.url, x])).values()];
      if (uniqueUrls.length === 0) return NextResponse.json({ error: "No original source links are available." }, { status: 409 });

      let slug = slugify(item.draft_headline || item.title);
      const existing = await db(`articles?select=id&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (existing.ok && (await existing.json()).length) slug = `${slug}-${id.slice(0,6)}`;

      const article = {
        slug, headline: item.draft_headline || item.title,
        summary: item.draft_summary || item.summary || "Read the linked original sources for details.",
        body_md: item.draft_body_md || item.summary || "",
        category_name: item.suggested_category || "World News",
        country_name: item.country_code || null,
        status: "published", published_at: new Date().toISOString(),
        source_count: uniqueUrls.length, seo_title: item.draft_headline || item.title
      };
      const createResponse = await db("articles", {
        method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(article)
      });
      if (!createResponse.ok) return NextResponse.json({ error: await createResponse.text() }, { status: 502 });
      const created = (await createResponse.json())[0];

      const sourceLookup = sourceIds.length
        ? await db(`sources?select=id,name& id=in.(${sourceIds.join(",")})`.replace("& id", "&id"))
        : null;
      const sourceNames = new Map<string,string>();
      if (sourceLookup?.ok) for (const source of await sourceLookup.json() as Array<{id:string;name:string}>) sourceNames.set(source.id, source.name);
      const links = uniqueUrls.map((entry: {url:string;title:string;source_id:string|null}) => ({
        article_id: created.id, source_id: entry.source_id, discovered_id: id,
        publisher_name: entry.source_id ? (sourceNames.get(entry.source_id) || "Original publisher") : "Original publisher",
        source_url: entry.url
      }));
      const linkResponse = await db("article_sources", {
        method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(links)
      });
      if (!linkResponse.ok) {
        await db(`articles?id=eq.${created.id}`, { method: "PATCH", body: JSON.stringify({ status: "draft", published_at: null }) });
        return NextResponse.json({ error: "Article saved as unpublished because source attribution could not be saved." }, { status: 502 });
      }
      await db(`discovered_news?id=eq.${id}`, {
        method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "published" })
      });
      return NextResponse.json({ ok: true, slug, message: "Article published with its original source links." });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Newsroom action failed." }, { status: 500 });
  }
}
