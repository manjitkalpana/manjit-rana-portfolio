import ContactForm from "./ContactForm";
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Code2, Database, ExternalLink, Facebook, Github, Globe2, Layers3, Linkedin, Mail, MapPin, Palette, SearchCheck, Server, Sparkles, Terminal, Workflow, Zap } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

const skills = [
  { name: "Next.js", group: "Framework", icon: Layers3 },
  { name: "React", group: "Frontend", icon: Code2 },
  { name: "TypeScript", group: "Language", icon: Terminal },
  { name: "Tailwind CSS", group: "Styling", icon: Palette },
  { name: "Supabase", group: "Backend", icon: Database },
  { name: "Vercel", group: "Deployment", icon: Server },
  { name: "Git & GitHub", group: "Workflow", icon: Github },
  { name: "SEO & UI/UX", group: "Experience", icon: SearchCheck },
];

const projects = [
  { number: "01", name: "KothaKhoj Nepal", type: "PROPERTY DISCOVERY", status: "IN DEVELOPMENT", description: "A simpler way to discover rooms, rentals and stays across Nepal, designed around the needs of local people.", tags: ["Next.js", "Supabase", "Search"], href: "https://kothakhoj.manjitrana.com.np", label: "Explore project", tone: "mint" },
  { number: "02", name: "Nepal Job Finder", type: "CAREER & COMMUNITY", status: "IN DEVELOPMENT", description: "A concept for making job opportunities easier to discover, understand and access for people across Nepal.", tags: ["Web app", "Accessibility", "Nepal"], href: "mailto:rnmanjit192@gmail.com?subject=Nepal%20Job%20Finder", label: "Discuss project", tone: "lilac" },
];

export default function Home() {
  return <main className="portfolio">
    <nav className="nav shell" aria-label="Main navigation">
      <a className="brand brandIdentity" href="#top" aria-label="Manjit Rana home"><span className="brandName">manjit<span className="brandDot">.</span></span></a>
      <div className="navLinks"><a href="#work">Work</a><a href="#about">About</a><a href="#skills">Stack</a></div>
      <a className="navCta" href="#contact">Let&apos;s talk <ArrowUpRight size={16} /></a>
    </nav>

    <section className="hero shell" id="top">
      <div className="heroTopline"><span className="availability"><i /> OPEN TO FREELANCE</span><span className="heroLocation"><MapPin size={14} /> NEPAL · UTC+5:45</span></div>
      <div className="heroMain">
        <div className="heroCopy">
          <p className="heroIntro">INDEPENDENT DEVELOPER & DIGITAL CREATOR</p>
          <h1>Ideas into<br /><em>useful things.</em></h1>
          <p className="heroSummary">I&apos;m Manjit Rana — a BIT student and web developer building thoughtful digital experiences for real people, with a focus on clarity, speed and usefulness.</p>
          <div className="heroActions"><a className="primaryButton" href="#work">Explore my work <ArrowDownRight size={17} /></a><a className="textButton" href="mailto:rnmanjit192@gmail.com">Get in touch <ArrowUpRight size={16} /></a></div>
        </div>
        <div className="heroArtwork" aria-label="Abstract digital design illustration">
          <div className="artTop"><span>DESIGN / BUILD / REFINE</span><span>MR—026</span></div>
          <div className="artOrb"><div className="orbCore" /><span className="orbLabel labelA">THOUGHTFUL<br />BY DESIGN</span><span className="orbLabel labelB">BUILT TO WORK ↗</span></div>
          <div className="artBottom"><span>Curiosity is the starting point.</span><span><Sparkles size={14} /> 01 / 03</span></div>
        </div>
      </div>
      <div className="heroMeta"><span><b>01</b> BUILD WITH INTENTION</span><span><b>02</b> KEEP IT HUMAN</span><span><b>03</b> SHIP & IMPROVE</span></div>
    </section>

    <section className="work shell" id="work">
      <div className="sectionHead"><div><p className="sectionEyebrow">SELECTED PROJECTS / 2026</p><h2>Work in progress<span>.</span></h2></div><p className="sectionNote">A few ideas I&apos;m turning into practical products. Each project is shared with an honest status.</p></div>
      <div className="projectGrid">{projects.map((project) => <article className={`project project-${project.tone}`} key={project.number}>
        <div className="projectHeader"><span>PROJECT / {project.number}</span><span className="projectStatus"><i /> {project.status}</span></div>
        <div className="projectCanvas"><div className="canvasGrid" /><div className="canvasShape"><span>{project.number}</span></div><span className="canvasCaption">{project.type}</span><span className="canvasArrow"><ArrowUpRight size={22} /></span></div>
        <div className="projectInfo"><p className="projectType">{project.type}</p><h3>{project.name}</h3><p className="projectDescription">{project.description}</p><div className="projectTags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="projectLink" href={project.href} target={project.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">{project.label} <ArrowUpRight size={16} /></a></div>
      </article>)}</div>
    </section>

    <section className="about" id="about"><div className="shell aboutGrid">
      <div className="aboutLabel"><p className="sectionEyebrow">A LITTLE ABOUT ME</p><div className="aboutMonogram">M<span>.</span>R</div><p className="aboutCaption">Based in Sudurpashchim, Nepal<br />Building for the wider world.</p></div>
      <div className="aboutCopy"><h2>Curious by nature.<br /><em>Practical by choice.</em></h2><p className="lead">I enjoy learning by building things that solve real problems — then refining them until they feel clear, useful and easy to use.</p><p>I study Information Technology at Kailali Multiple Campus, Far Western University, and work as an IT Assistant at Beldandi Institute of Technology. I&apos;m especially interested in education, local discovery, jobs and accessible tools.</p><div className="aboutDetails"><div><span>01 / CURRENT FOCUS</span><strong>Web apps & product thinking</strong></div><div><span>02 / LANGUAGES</span><strong>Nepali · English · Hindi</strong></div><div><span>03 / WORK STYLE</span><strong>Curious, honest, iterative</strong></div></div></div>
    </div></section>

    <section className="skills shell" id="skills"><div className="sectionHead"><div><p className="sectionEyebrow">TOOLS OF THE TRADE</p><h2>My working stack<span>.</span></h2></div><p className="sectionNote">A practical toolkit for turning early ideas into responsive, maintainable web experiences.</p></div><div className="skillList">{skills.map((skill, index) => { const Icon = skill.icon; return <div className="skillRow" key={skill.name}><span className="skillNumber">0{index + 1}</span><Icon size={21} strokeWidth={1.6} /><strong>{skill.name}</strong><span className="skillGroup">{skill.group}</span><span className="skillArrow"><ArrowUpRight size={17} /></span></div>; })}</div><div className="skillFoot"><span><Zap size={15} /> ALWAYS LEARNING</span><span><Workflow size={15} /> DESIGN → BUILD → ITERATE</span></div></section>

    <section className="contact" id="contact"><div className="shell contactInner"><div className="contactIntro"><p className="sectionEyebrow">HAVE SOMETHING IN MIND?</p><h2>Let&apos;s build<br /><em>what&apos;s next.</em></h2><p>Have a project, a freelance opportunity, or an idea worth exploring? Send a message and let&apos;s start with a conversation.</p><a className="emailLink" href="mailto:rnmanjit192@gmail.com"><Mail size={17} /> rnmanjit192@gmail.com <ArrowUpRight size={16} /></a><div className="socialLinks" aria-label="Social profiles"><a href="https://github.com/manjitkalpana" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a><a href="https://www.linkedin.com/in/kmcmanjeet12/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a><a href="https://www.facebook.com/kmcmanjeet12" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={19} /></a><a href="https://www.tiktok.com/@kanxa_babu9" target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok size={18} /></a><a href="https://www.freelancer.si/u/rnmanjit2844" target="_blank" rel="noreferrer" aria-label="Freelancer"><BriefcaseBusiness size={18} /></a></div></div><div className="contactFormWrap"><div className="formHeading"><span>YOUR NEXT IDEA</span><span>LET&apos;S TALK ↘</span></div><ContactForm /></div></div></section>
    <footer className="shell"><a className="footerBrand" href="#top">manjit<span>.</span></a><p>Designed with intention. Built in Nepal.</p><div className="footerRight"><span>© 2026 MANJIT RANA</span><a href="#top">BACK TO TOP ↑</a></div></footer>
  </main>;
}
