import type { MetadataRoute } from "next";
import { getLatestArticles } from "@/lib/news";
const staticPaths = ["", "/latest", "/search", "/about", "/contact", "/editorial-policy", "/corrections", "/privacy-policy", "/events", "/country/nepal"];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const now = new Date();
 const articles = await getLatestArticles();
 return [
  ...staticPaths.map(path => ({url:`https://manjitrana.com.np${path}`,lastModified:now,changeFrequency:"weekly" as const,priority:path===""?1:.5})),
  ...articles.map(a=>({url:`https://manjitrana.com.np/news/${a.slug}`,lastModified:new Date(a.published_at),changeFrequency:"weekly" as const,priority:.7}))
 ];
}
