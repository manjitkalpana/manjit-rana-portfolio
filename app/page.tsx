import Link from "next/link";
import { getLatestArticles, getFeaturedArticles } from "@/lib/news";

export const revalidate = 300;

const sections = [
  ["World", "world"], ["Nepal", "nepal"], ["Politics", "politics"],
  ["Business", "business"], ["Technology", "technology"], ["Science", "science"],
  ["Sports", "sports"], ["Culture", "culture"]
];

function timeAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const minutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default async function Home() {
  const [featured, latest] = await Promise.all([getFeaturedArticles(), getLatestArticles()]);
  const lead = featured[0] ?? latest[0];
  const more = latest.filter((item) => item.id !== lead?.id).slice(0, 8);

  return <main>
    <div className="topline"><div className="wrap toplineInner"><span>INDEPENDENT GLOBAL JOURNALISM</span><span>{new Date().toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kathmandu" })} · NPT</span></div></div>
    <header className="masthead wrap">
      <Link className="brand" href="/">MANJIT<span>RANA</span><small>GLOBAL NEWS</small></Link>
      <div className="mastheadRight"><span>WORLD NEWS. CLEAR PERSPECTIVES.</span><Link href="/search">Search <b>⌕</b></Link></div>
    </header>
    <nav className="nav"><div className="wrap navInner"><Link href="/">Home</Link>{sections.map(([label, slug]) => <Link key={slug} href={`/category/${slug}`}>{label}</Link>)}<Link href="/country/nepal">Nepal</Link><Link href="/events">Events</Link></div></nav>
    <div className="wrap">
      <div className="breaking"><b>NEWS DESK</b><span>Independent reporting · Verified sources · Global perspective</span><Link href="/category/breaking">Breaking news →</Link></div>
      {lead ? <section className="leadGrid">
        <article className="leadStory">
          {lead.image_url ? <Link href={`/news/${lead.slug}`} className="leadImage"><img src={lead.image_url} alt="" /></Link> : <div className="imagePlaceholder"><span>MANJITRANA / NEWSROOM</span></div>}
          <div className="storyMeta"><span>{lead.category_name ?? "Top story"}</span><span>{timeAgo(lead.published_at)}</span></div>
          <h1><Link href={`/news/${lead.slug}`}>{lead.headline}</Link></h1>
          <p className="standfirst">{lead.summary}</p>
          <div className="byline">Reporting based on {lead.source_count ?? 1} source{(lead.source_count ?? 1) === 1 ? "" : "s"} · {lead.country_name ?? "International"}</div>
        </article>
        <aside className="topStories"><div className="sectionTitle"><h2>Top stories</h2><span>01 — 05</span></div>
          {featured.slice(1, 5).map((item, index) => <article className="sideStory" key={item.id}><span className="number">0{index + 2}</span><div><div className="storyMeta"><span>{item.category_name ?? "Latest"}</span><span>{timeAgo(item.published_at)}</span></div><h3><Link href={`/news/${item.slug}`}>{item.headline}</Link></h3></div></article>)}
          {featured.length <= 1 && <p className="emptyNote">Top stories will appear here as verified reporting is published.</p>}
        </aside>
      </section> : <section className="emptyLead"><span className="eyebrow">A NEW INDEPENDENT NEWSROOM</span><h1>Stories that matter.<br/><i>Context that counts.</i></h1><p>Global developments, carefully sourced and clearly explained. Our newsroom is preparing its first verified reports.</p><Link className="outlineButton" href="/about">Our editorial standards →</Link></section>}
      <section className="latestSection"><div className="sectionTitle"><h2>Latest reporting</h2><Link href="/latest">View all news →</Link></div>
        {more.length ? <div className="latestGrid">{more.map((item) => <article className="latestCard" key={item.id}>{item.image_url ? <Link href={`/news/${item.slug}`} className="cardImage"><img src={item.image_url} alt="" /></Link> : <div className="cardPlaceholder">GLOBAL / REPORT</div>}<div className="storyMeta"><span>{item.category_name ?? "News"}</span><span>{timeAgo(item.published_at)}</span></div><h3><Link href={`/news/${item.slug}`}>{item.headline}</Link></h3><p>{item.summary}</p><small>{item.country_name ?? "International"}</small></article>)}</div> : <div className="emptyLatest"><strong>The newsroom is getting ready.</strong><p>No articles have been published yet. Stories will appear here after sourcing and editorial checks.</p></div>}
      </section>
      <section className="newsletter"><div><span className="eyebrow">THE WORLD, IN CONTEXT</span><h2>Stay informed.<br/>Stay curious.</h2></div><p>Explore independent coverage across countries, politics, business, technology, science and culture. We publish only when our sourcing and editorial checks support the story.</p></section>
    </div>
    <footer><div className="wrap footerInner"><Link className="brand footerBrand" href="/">MANJIT<span>RANA</span><small>GLOBAL NEWS</small></Link><div><Link href="/about">About</Link><Link href="/editorial-policy">Editorial policy</Link><Link href="/corrections">Corrections</Link><Link href="/contact">Contact</Link><Link href="/admin">Admin</Link></div><small>© {new Date().getFullYear()} ManjitRana.com.np · Independent publication</small></div></footer>
  </main>;
}
