import Link from "next/link";
import { getLatestArticles } from "@/lib/news";
export const revalidate = 300;
export default async function NepalPage(){const articles=(await getLatestArticles()).filter(a=>a.country_name?.toLowerCase().includes("nepal"));return <main className="wrap listingPage"><p className="eyebrow">NEWS DESK / COUNTRY</p><h1>Nepal news</h1><div className="listingGrid">{articles.map(a=><article key={a.id}><div className="storyMeta"><span>{a.category_name||"News"}</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div><h2><Link href={`/news/${a.slug}`}>{a.headline}</Link></h2><p>{a.summary}</p></article>)}</div>{!articles.length&&<p className="emptyLatest">No Nepal stories have been published yet.</p>}</main>}
