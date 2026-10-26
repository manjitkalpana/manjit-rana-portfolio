"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, Calculator, Check, Clipboard, Code2, Command, Search, X } from "lucide-react";

const projectTypes = [
  { name: "Landing page / portfolio", cost: 400, detail: "A polished, responsive website" },
  { name: "Full-stack web application", cost: 900, detail: "Application UI, data and authentication" },
  { name: "Custom browser tool", cost: 1400, detail: "Specialized interactive functionality" },
  { name: "Directory / marketplace", cost: 650, detail: "Listings, search and filters" },
];
const addOns = [
  { name: "User authentication & roles", cost: 200 },
  { name: "Payments integration", cost: 250 },
  { name: "Interactive canvas / local storage", cost: 300 },
  { name: "SEO & structured metadata", cost: 150 },
];

export default function PortfolioTools() {
  const [type, setType] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([3]);
  const [urgency, setUrgency] = useState(2);
  const [tab, setTab] = useState<"schema" | "metadata">("schema");
  const [copied, setCopied] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");

  const multiplier = urgency === 1 ? 0.85 : urgency === 3 ? 1.35 : 1;
  const timeline = urgency === 1 ? "Relaxed · 5–6 weeks" : urgency === 3 ? "Rush · 1–2 weeks" : "Standard · 3–4 weeks";
  const total = useMemo(() => Math.round((projectTypes[type].cost + selectedAddOns.reduce((sum, index) => sum + addOns[index].cost, 0)) * multiplier), [type, selectedAddOns, multiplier]);
  const npr = Math.round(total * 134);
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
    { label: "Open project estimator", hint: "Estimate cost and timeline", id: "project-estimator" },
    { label: "Open SEO metadata lab", hint: "View JSON-LD and metadata", id: "seo-lab" },
    { label: "Go to contact", hint: "Get in touch", id: "contact" },
    { label: "Open terminal", hint: "Try portfolio commands", id: "terminal" },
  ].filter((item) => (item.label + " " + item.hint).toLowerCase().includes(search.toLowerCase()));

  return <>
    <section id="project-estimator" className="creativeToolsSection creativeShell">
      <div className="creativeSectionHead">
        <div><p className="creativeEyebrow"><Calculator size={14} /> PROJECT PLANNER</p><h2>Estimate the <em>possibilities.</em></h2></div>
        <p>Use this as a starting-point estimate. Final pricing depends on requirements, integrations and project scope.</p>
      </div>
      <div className="creativeToolGrid">
        <div className="creativeToolPanel">
          <p className="creativeToolLabel">01 / Choose a project type</p>
          <div className="creativeTypeGrid">{projectTypes.map((item, index) => <button type="button" key={item.name} onClick={() => setType(index)} className={`creativeTypeOption ${type === index ? "selected" : ""}`}><strong>{item.name}</strong><span>{item.detail}</span></button>)}</div>
          <p className="creativeToolLabel">02 / Optional features</p>
          <div className="creativeAddonList">{addOns.map((item, index) => <label key={item.name}><input type="checkbox" checked={selectedAddOns.includes(index)} onChange={(event) => setSelectedAddOns((current) => event.target.checked ? [...current, index] : current.filter((value) => value !== index))} /><span>{item.name}</span><b>+${item.cost}</b></label>)}</div>
          <div className="creativeUrgency"><label htmlFor="project-urgency" className="creativeToolLabel">03 / Delivery timeline</label><strong>{timeline}</strong><input id="project-urgency" type="range" min="1" max="3" step="1" value={urgency} onChange={(event) => setUrgency(Number(event.target.value))} /><div><span>Relaxed</span><span>Standard</span><span>Rush</span></div></div>
        </div>
        <aside className="creativeEstimatePanel"><p className="creativeToolLabel">ESTIMATE / OUTPUT</p><span className="creativeEstimateCaption">Indicative project budget</span><strong className="creativeEstimatePrice">${total.toLocaleString()} <small>USD</small></strong><p className="creativeEstimateNpr">≈ NPR {npr.toLocaleString()} <small>using a sample rate of NPR 134/USD</small></p><div className="creativeEstimateLine"><span>Project type</span><b>{projectTypes[type].name}</b></div><div className="creativeEstimateLine"><span>Selected add-ons</span><b>{selectedAddOns.length}</b></div><div className="creativeEstimateLine"><span>Timeline</span><b>{timeline}</b></div><a className="creativePrimary" href={`mailto:rnmanjit192@gmail.com?subject=${encodeURIComponent("Project estimate enquiry")}&body=${encodeURIComponent(`Hello Manjit,\\n\\nI'd like to discuss a project.\\nType: ${projectTypes[type].name}\\nSelected add-ons: ${selectedAddOns.map((index) => addOns[index].name).join(", ") || "None"}\\nIndicative estimate: $ ${total} USD (about NPR ${npr})\\nTimeline: ${timeline}\\n\\nPlease let me know the next steps.`)}`}>Discuss this estimate <ArrowUpRight size={16}/></a><p className="creativeEstimateNote">Not a binding quote. Third-party fees, hosting and taxes may be separate.</p></aside>
      </div>
    </section>

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
