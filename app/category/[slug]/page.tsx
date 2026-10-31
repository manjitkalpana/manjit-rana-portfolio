import Link from "next/link";
import { getLatestArticles } from "@/lib/news";
export const revalidate = 300;
const categories: Record<string,string> = { world:"World", nepal:"Nepal", politics:"Politics", business:"Business", technology:"Technology", science:"Science", sports:"Sports", culture:"Culture", health:"Health", education:"Education", environment:"Environment", entertainment:"Entertainment", crime:"Crime" };
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const label=categories[slug.toLowerCase()] || slug.replace(/-/g," ");
 const articles=(await getLatestArticles()).filter(a=>(a.category_name||"").trim().toLowerCase()===label.toLowerCase());
 return <main className="wrap listingPage"><p className="eyebrow">NEWS DESK / CATEGORY</p><h1>{label}</h1><div className="listingGrid">{articles.map(a=><article key={a.id}><div className="storyMeta"><span>{a.category_name}</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div><h2><Link href={`/news/${a.slug}`}>{a.headline}</Link></h2><p>{a.summary}</p></article>)}</div>{!articles.length&&<p className="emptyLatest">No published stories in this section yet.</p>}</main>;
}
