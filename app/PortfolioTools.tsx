"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Clipboard, Code2, Command, Search, X } from "lucide-react";

export default function PortfolioTools() {
  const [tab, setTab] = useState<"schema" | "metadata">("schema");
  const [copied, setCopied] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Manjit Rana",
    url: "https://manjitrana.com.np",
    jobTitle: "Web Developer",
    email: "rnmanjit192@gmail.com",
    sameAs: ["https://github.com/manjitkalpana", "https://www.linkedin.com/in/kmcmanjeet12/", "https://www.facebook.com/kmcmanjeet12"],
    knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Web development"],
    address: { "@type": "PostalAddress", addressRegion: "Sudurpashchim Province", addressCountry: "NP" }
  }, null, 2);
  const metadata = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manjit Rana | Web Developer & Digital Builder",
  description: "Portfolio of Manjit Rana, an IT student and web developer in Nepal building useful digital experiences.",
  metadataBase: new URL("https://manjitrana.com.np"),
  openGraph: {
    title: "Manjit Rana | Web Developer",
    description: "Web projects, skills and contact information.",
    url: "https://manjitrana.com.np",
    siteName: "Manjit Rana",
    locale: "en_US",
    type: "website"
  }
};`;
  const code = tab === "schema" ? schema : metadata;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (id: string) => {
    setPaletteOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const commands = [
    { label: "Go to projects", hint: "View selected work", id: "work" },
    { label: "Open SEO metadata lab", hint: "View JSON-LD and metadata", id: "seo-lab" },
    { label: "Go to contact", hint: "Get in touch", id: "contact" },
    { label: "Open terminal", hint: "Try portfolio commands", id: "terminal" },
  ].filter((item) => (item.label + " " + item.hint).toLowerCase().includes(search.toLowerCase()));

  return <>
    <section id="seo-lab" className="creativeSeoSection">
      <div className="creativeShell">
        <div className="creativeSectionHead"><div><p className="creativeEyebrow"><Code2 size={14}/> SEO / METADATA LAB</p><h2>Clear structure.<br/><em>Better discovery.</em></h2></div><p>Example structured data and Next.js metadata for the portfolio. Review and adapt these snippets before using them in a production site.</p></div>
        <div className="creativeSeoPanel"><div className="creativeSeoTabs"><button type="button" onClick={() => setTab("schema")} className={tab === "schema" ? "active" : ""}>JSON-LD Person schema</button><button type="button" onClick={() => setTab("metadata")} className={tab === "metadata" ? "active" : ""}>Next.js metadata</button><button type="button" onClick={copyCode} className="creativeCopyButton">{copied ? <Check size={14}/> : <Clipboard size={14}/>} {copied ? "Copied" : "Copy code"}</button></div><pre className="creativeCodeOutput"><code>{code}</code></pre><p className="creativeSeoNote">The snippet is a reference example. Ensure personal details, social URLs and metadata match the live website before publishing.</p></div>
      </div>
    </section>

    <button type="button" className="creativeCommandLauncher" onClick={() => setPaletteOpen(true)} aria-label="Open command palette"><Command size={15}/> Search portfolio <kbd>⌘ K</kbd></button>
    {paletteOpen && <div className="creativePaletteBackdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}><div className="creativePalette" role="dialog" aria-modal="true" aria-label="Portfolio command palette"><div className="creativePaletteSearch"><Search size={17}/><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sections..." /><button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close command palette"><X size={17}/></button></div><div className="creativePaletteItems">{commands.map((item) => <button type="button" key={item.id} onClick={() => goTo(item.id)}><span><strong>{item.label}</strong><small>{item.hint}</small></span><ArrowUpRight size={16}/></button>)}{commands.length === 0 && <p>No matching sections. Try “projects”, “contact”, or “SEO”.</p>}</div><div className="creativePaletteFoot">Navigate with your mouse · Press Esc to close</div></div></div>}
  </>;
}
