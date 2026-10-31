import Link from "next/link";
import { getLatestArticles } from "@/lib/news";
export const revalidate = 300;
export default async function LatestPage(){const articles=await getLatestArticles();return <main className="wrap listingPage"><p className="eyebrow">NEWS DESK / ALL STORIES</p><h1>Latest news</h1><div className="listingGrid">{articles.map(a=><article key={a.id}><div className="storyMeta"><span>{a.category_name||"News"}</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div><h2><Link href={`/news/${a.slug}`}>{a.headline}</Link></h2><p>{a.summary}</p></article>)}</div>{!articles.length&&<p className="emptyLatest">No published stories yet. Please check back soon.</p>}</main>}
