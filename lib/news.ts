export type Article = {
  id: string; slug: string; headline: string; summary: string; image_url: string | null;
  published_at: string; category_name: string | null; country_name: string | null; source_count?: number;
};

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function queryArticles(path: string): Promise<Article[]> {
  if (!base || !key) return [];
  try {
    const response = await fetch(`${base}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 }
    });
    if (!response.ok) return [];
    return await response.json() as Article[];
  } catch { return []; }
}

export async function getLatestArticles() {
  return queryArticles("articles?select=id,slug,headline,summary,image_url,published_at,category_name,country_name,source_count&status=eq.published&order=published_at.desc&limit=25");
}

export async function getFeaturedArticles() {
  return queryArticles("articles?select=id,slug,headline,summary,image_url,published_at,category_name,country_name,source_count&status=eq.published&is_featured=eq.true&order=published_at.desc&limit=5");
}
