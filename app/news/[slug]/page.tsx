import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticleSources } from "@/lib/news";

export const revalidate = 300;

function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const match = part.match(/^(https?:\/\/[^.,;:!?)}\]]+)([.,;:!?)}\]]*)$/);
    const url = match?.[1] ?? part;
    const punctuation = match?.[2] ?? "";
    return (
      <span key={index}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="articleSourceLink"
          style={{ color: "#2563eb", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 600, overflowWrap: "anywhere" }}
        >
          {url}
        </a>
        {punctuation}
      </span>
    );
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return article
    ? { title: article.headline, description: article.summary, openGraph: { title: article.headline, description: article.summary, images: article.image_url ? [article.image_url] : [] } }
    : {};
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const sources = await getArticleSources(article.id);

  return (
    <main className="wrap articlePage">
      <a className="backLink" href="/">← Back to front page</a>
      <div className="storyMeta">
        <span>{article.category_name ?? "News"}</span>
        <span>{article.country_name ?? "International"}</span>
        <span>{new Date(article.published_at).toLocaleString()}</span>
      </div>
      <h1>{article.headline}</h1>
      <p className="standfirst">{article.summary}</p>
      {article.image_url && (
        <figure className="articleHero">
          <img src={article.image_url} alt="" />
          {article.image_credit && <figcaption>{article.image_credit}</figcaption>}
        </figure>
      )}
      <div className="articleBody">
        {(article.body_md ?? "").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
          <p key={index}>{renderLinkedText(paragraph.replace(/^#+\s*/, ""))}</p>
        ))}
      </div>
      {sources.length > 0 && (
        <section className="articleSources" aria-labelledby="article-sources-heading">
          <h2 id="article-sources-heading">Original sources</h2>
          <ul>
            {sources.map((source, index) => (
              <li key={`${source.source_url}-${index}`}>
                <a href={source.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 600, overflowWrap: "anywhere" }}>
                  Read original report — {source.publisher_name || "Source"} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="articleDisclosure">This report is based on source material recorded by the newsroom. See source attribution and editorial notes before publication.</p>
    </main>
  );
}
