import type { MetadataRoute } from "next";
import { getLatestArticles } from "@/lib/news";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const articles=await getLatestArticles();
 return [{ url:"https://manjitrana.com.np",lastModified:new Date(),changeFrequency:"hourly",priority:1 },...articles.map(a=>({url:`https://manjitrana.com.np/news/${a.slug}`,lastModified:new Date(a.published_at),changeFrequency:"weekly" as const,priority:.7}))];
}
