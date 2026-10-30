import { getCategoryArticles } from "@/lib/news";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug }=await params; const articles=await getCategoryArticles(slug);
 return <main className="wrap listingPage"><p className="eyebrow">NEWS DESK / CATEGORY</p><h1>{slug.replace(/-/g," ")}</h1><div className="listingGrid">{articles.map(a=><article key={a.id}><div className="storyMeta"><span>{a.category_name}</span><span>{new Date(a.published_at).toLocaleDateString()}</span></div><h2><a href={`/news/${a.slug}`}>{a.headline}</a></h2><p>{a.summary}</p></article>)}</div>{!articles.length&&<p className="emptyLatest">No published stories in this section yet.</p>}</main>;
}
