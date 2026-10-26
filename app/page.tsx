"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Code2, Database, Facebook, Github, Layers3, Linkedin, Mail, MapPin, Moon, Palette, SearchCheck, Server, Sun, Terminal, Workflow, Zap, Globe2, Sparkles, Menu } from "lucide-react";

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
  { number: "01", name: "KothaKhoj Nepal", type: "PROPERTY DISCOVERY", status: "IN DEVELOPMENT", description: "A simpler way to discover rooms, rentals and stays across Nepal, designed around the needs of local people.", neDescription: "नेपालभर कोठा, भाडा र बसोबास खोज्न सजिलो बनाउने, स्थानीय आवश्यकतामा केन्द्रित डिजिटल प्लेटफर्म।", tags: ["Next.js", "Supabase", "Search"], href: "https://kothakhoj.manjitrana.com.np", label: "Explore project", neLabel: "प्रोजेक्ट हेर्नुहोस्", tone: "orange" },
  { number: "02", name: "Nepal Job Finder", type: "CAREER & COMMUNITY", status: "IN DEVELOPMENT", description: "A concept for making job opportunities easier to discover, understand and access for people across Nepal.", neDescription: "नेपालभर रोजगारीका अवसर सजिलै खोज्न, बुझ्न र पहुँच पाउन सहयोग गर्ने अवधारणा।", tags: ["Web app", "Accessibility", "Nepal"], href: "mailto:rnmanjit192@gmail.com?subject=Nepal%20Job%20Finder", label: "Discuss project", neLabel: "कुरा गरौँ", tone: "violet" },
];

const copy = {
  en: {
    navWork: "Work", navAbout: "About", navStack: "Stack", navContact: "Let's talk",
    availability: "OPEN TO FREELANCE", intro: "WEB DEVELOPER · IT STUDENT",
    titleA: "I make", titleB: "ideas happen.", summary: "I'm Manjit Rana — an IT student and web developer creating useful digital experiences for real people. I care about clear design, thoughtful details and things that actually work.",
    explore: "Explore my work", contact: "Get in touch", artwork: "BUILD / SHIP / IMPROVE", artBottom: "Thoughtful code. Useful products.",
    meta1: "MAKE IT USEFUL", meta2: "KEEP IT HUMAN", meta3: "ALWAYS IMPROVE",
    projectsEyebrow: "SELECTED PROJECTS / 2026", projectsTitle: "Ideas in motion", projectsNote: "Small beginnings, real problems. These are independent projects in active development.",
    status: "IN DEVELOPMENT", aboutEyebrow: "THE DEVELOPER BEHIND THE CODE", aboutTitleA: "Curious mind.", aboutTitleB: "Practical maker.", aboutLead: "I learn best by building things that solve real problems — then improving them until they feel simple, clear and useful.",
    aboutText: "I study Information Technology at Kailali Multiple Campus, Far Western University, and work as an IT Assistant at Beldandi Institute of Technology. I'm especially interested in education, local discovery, jobs and accessible tools.",
    focusLabel: "CURRENT FOCUS", focus: "Web apps & product thinking", languagesLabel: "LANGUAGES", languages: "Nepali · English · Hindi", styleLabel: "WORK STYLE", workStyle: "Curious, honest, iterative",
    skillsEyebrow: "TECH STACK", skillsTitle: "Things I build with", skillsNote: "A practical toolkit for turning early ideas into responsive, maintainable web experiences.",
    learning: "ALWAYS LEARNING", process: "DESIGN → BUILD → ITERATE",
    contactEyebrow: "HAVE A PROJECT IN MIND?", contactTitleA: "Let's make", contactTitleB: "something good.", contactText: "Have a project, a freelance opportunity, or an idea worth exploring? Send a message and let's start with a conversation.",
    footer: "Designed with curiosity. Built in Nepal.", backTop: "BACK TO TOP",
  },
  ne: {
    navWork: "काम", navAbout: "मेरो बारेमा", navStack: "सीप", navContact: "सम्पर्क",
    availability: "फ्रीलान्स कामका लागि उपलब्ध", intro: "स्वतन्त्र डेभलपर र डिजिटल सिर्जनाकर्ता",
    titleA: "सोचलाई", titleB: "साकार बनाउँछु।", summary: "म मनजित राना — उपयोगी डिजिटल अनुभव बनाउने आईटी विद्यार्थी र वेब डेभलपर हुँ। स्पष्ट डिजाइन, साना विवरण र साँच्चिकै काम गर्ने समाधानमा ध्यान दिन्छु।",
    explore: "मेरो काम हेर्नुहोस्", contact: "सम्पर्क गर्नुहोस्", artwork: "सिर्जना / जिज्ञासा / कोड", artBottom: "अलिकति कल्पनाले धेरै फरक पार्छ।",
    meta1: "उपयोगी बनाऔँ", meta2: "मानिसलाई प्राथमिकता", meta3: "सधैँ सुधार",
    projectsEyebrow: "छानिएका प्रोजेक्ट / २०२६", projectsTitle: "अगाडि बढिरहेका विचार", projectsNote: "सानो सुरुवात, वास्तविक समस्या। यी व्यक्तिगत प्रोजेक्टहरू विकासको क्रममा छन्।",
    status: "विकास हुँदै", aboutEyebrow: "डिजाइन पछाडिको व्यक्ति", aboutTitleA: "जिज्ञासु सोच।", aboutTitleB: "व्यावहारिक निर्माता।", aboutLead: "वास्तविक समस्या समाधान गर्ने कुरा बनाएर सिक्छु — त्यसपछि त्यसलाई सरल, स्पष्ट र उपयोगी नबनेसम्म सुधार गर्छु।",
    aboutText: "म कैलाली बहुमुखी क्याम्पस, सुदूरपश्चिम विश्वविद्यालयमा सूचना प्रविधि अध्ययन गर्छु र बेलडाँडी इन्स्टिच्युट अफ टेक्नोलोजीमा आईटी सहायकको रूपमा काम गर्छु। शिक्षा, स्थानीय खोज, रोजगारी र सबैले प्रयोग गर्न सक्ने डिजिटल उपकरणमा मेरो रुचि छ।",
    focusLabel: "हालको ध्यान", focus: "वेब एप र उत्पादन सोच", languagesLabel: "भाषाहरू", languages: "नेपाली · अंग्रेजी · हिन्दी", styleLabel: "काम गर्ने शैली", workStyle: "जिज्ञासु, इमानदार, निरन्तर सुधार",
    skillsEyebrow: "मेरो डिजिटल टुलबक्स", skillsTitle: "म प्रयोग गर्ने सीप", skillsNote: "प्रारम्भिक विचारलाई उत्तरदायी र व्यवस्थित वेब अनुभवमा बदल्ने व्यावहारिक उपकरणहरू।",
    learning: "सिक्दै र सुधार्दै", process: "डिजाइन → निर्माण → सुधार",
    contactEyebrow: "केही नयाँ बनाउने सोच छ?", contactTitleA: "सँगै बनाऔँ", contactTitleB: "केही राम्रो।", contactText: "प्रोजेक्ट, फ्रीलान्स अवसर वा नयाँ विचार छ? सन्देश पठाउनुहोस्, कुराकानीबाट सुरु गरौँ।",
    footer: "जिज्ञासाबाट डिजाइन। नेपालमा निर्माण।", backTop: "माथि जानुहोस्",
  }
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "ne">("en");
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Welcome to manjit.dev", "Type help to explore this portfolio."]);
  const runTerminal = () => {
    const command = terminalInput.trim().toLowerCase().replace(/^\\s+|\\s+$/g, "");
    if (!command) return;
    const responses: Record<string, string> = {
      help: "PROFILE COMMANDS\\n  whoami       — short introduction\\n  profile      — professional profile\\n  about        — background and interests\\n  education    — education details\\n  experience   — work experience\\n  location     — general location\\n  languages    — spoken languages\\n  interests    — interests and focus\\n  goals        — career goals\\n\\nPORTFOLIO COMMANDS\\n  projects     — current projects\\n  kothakhoj    — KothaKhoj Nepal details\\n  jobfinder    — Nepal Job Finder details\\n  skills       — technical skills\\n  stack        — technologies I use\\n  github       — GitHub profile\\n  repositories — GitHub repositories\\n  portfolio    — website address\\n  social       — social profile links\\n  contact      — contact email\\n  availability — freelance availability\\n  clear        — clear terminal output",
      whoami: "Manjit Rana — IT student, web developer, and digital creator based in Nepal.",
      profile: "NAME: Manjit Rana\\nROLE: IT Student · Web Developer · Digital Creator\\nSTATUS: Building independent web projects and open to suitable freelance opportunities.\\nWORK STYLE: Curious, practical, honest, and iterative.",
      about: "I enjoy building useful digital experiences, learning by making real projects, and improving design, usability, and functionality. I am especially interested in education tools, local discovery, jobs, and accessible web apps.",
      education: "FIELD: Information Technology\\nINSTITUTION: Kailali Multiple Campus, Far Western University (as listed in this portfolio).\\nFOCUS: Web development, software projects, and practical IT skills.",
      experience: "CURRENT WORK: IT Assistant at Beldandi Institute of Technology (as listed in this portfolio).\\nEXPERIENCE STYLE: Practical IT support and learning through independent digital projects.",
      location: "BASED IN: Sudurpashchim Province, Nepal.\\nTIME ZONE: Nepal Time (UTC+5:45).",
      languages: "Nepali · English · Hindi",
      interests: "Web development, useful digital products, education technology, local discovery, job platforms, user-friendly design, and learning new tools.",
      goals: "Build reliable, accessible web apps; grow as a developer; collaborate on meaningful projects; and help people discover useful digital services.",
      projects: "01 — KothaKhoj Nepal: room, rental, and stay discovery platform (in development).\\n02 — Nepal Job Finder: job discovery concept for Nepal (in development).",
      kothakhoj: "KOTHAKHOJ NEPAL\\nPurpose: Help people discover rooms, rentals, and stays across Nepal.\\nStack: Next.js · Supabase · Search.\\nStatus: In development.\\nURL: https://kothakhoj.manjitrana.com.np",
      jobfinder: "NEPAL JOB FINDER\\nPurpose: Make job opportunities easier to discover and understand across Nepal.\\nStatus: In development.\\nContact to discuss: rnmanjit192@gmail.com",
      skills: "Next.js · React · TypeScript · Tailwind CSS · Supabase · Vercel · Git/GitHub · SEO · UI/UX.",
      stack: "FRAMEWORK: Next.js\\nFRONTEND: React\\nLANGUAGE: TypeScript\\nSTYLING: Tailwind CSS\\nBACKEND: Supabase\\nDEPLOYMENT: Vercel\\nWORKFLOW: Git & GitHub\\nFOCUS: SEO, responsive UI/UX",
      github: "GitHub: https://github.com/manjitkalpana",
      repositories: "Browse public repositories: https://github.com/manjitkalpana?tab=repositories",
      portfolio: "Website: https://manjitrana.com.np",
      social: "GitHub: github.com/manjitkalpana\\nLinkedIn: linkedin.com/in/kmcmanjeet12/\\nFacebook: facebook.com/kmcmanjeet12\\nFreelancer: freelancer.si/u/rnmanjit2844",
      contact: "Email: rnmanjit192@gmail.com\\nPortfolio: https://manjitrana.com.np",
      availability: "OPEN TO: Suitable freelance projects and collaborations.\\nBest first step: email rnmanjit192@gmail.com with project details.",
      clear: ""
    };
    if (command === "clear") { setTerminalOutput([]); setTerminalInput(""); return; }
    const output = responses[command] || "Command not found. Type help to see all available commands.";
    setTerminalOutput([...terminalOutput, `guest@manjit.dev:~$ ${command}`, ...output.split("\\n")]);
    setTerminalInput("");
  };
  const t = copy[lang];

  return <main className={`creativePortfolio ${dark ? "creativeDark" : "creativeLight"}`} lang={lang === "ne" ? "ne" : "en"}>
    <nav className="creativeNav creativeShell" aria-label="Main navigation">
      <a className="creativeBrand" href="#top" aria-label="Manjit Rana home">m<span>✳</span></a>
      <button className="creativeMenu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu size={19} /></button>
      <div className={`creativeNavLinks ${menuOpen ? "creativeMenuOpen" : ""}`}>
        <a href="#work" onClick={() => setMenuOpen(false)}>{t.navWork}</a><a href="#about" onClick={() => setMenuOpen(false)}>{t.navAbout}</a><a href="#skills" onClick={() => setMenuOpen(false)}>{t.navStack}</a>
      </div>
      <div className="creativeNavActions">
        <button className="creativeIconButton" onClick={() => setLang(lang === "en" ? "ne" : "en")} aria-label="Change language"><Globe2 size={16} /><span>{lang === "en" ? "नेपाली" : "English"}</span></button>
        <button className="creativeIconButton" onClick={() => setDark(!dark)} aria-label="Toggle dark and light theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
        <a className="creativeNavCta" href="#contact">{t.navContact}<ArrowUpRight size={15} /></a>
      </div>
    </nav>

    <section className="creativeHero creativeShell" id="top">
      <div className="creativeHeroLabel"><span className="creativeAvailability"><i />{t.availability}</span><span className="creativeLocation"><MapPin size={13} /> NEPAL · UTC+5:45</span></div>
      <div className="creativeHeroGrid">
        <div className="creativeHeroCopy">
          <p className="creativeEyebrow"><span>✳</span>{t.intro}</p>
          <h1>{t.titleA}<br /><em>{t.titleB}</em></h1>
          <p className="creativeSummary">{t.summary}</p>
          <div className="creativeActions"><a className="creativePrimary" href="#work">{t.explore}<ArrowDownRight size={17} /></a><a className="creativeTextLink" href="mailto:rnmanjit192@gmail.com">{t.contact}<ArrowUpRight size={16} /></a></div>
        </div>
        <div className="creativeArtwork" aria-label="Abstract creative digital artwork">
          <div className="creativeArtTop"><span>{t.artwork}</span><span>MR—026</span></div>
          <div className="creativeArtScene"><div className="creativeSun" /><div className="creativeBlob creativeBlobOne" /><div className="creativeBlob creativeBlobTwo" /><div className="creativeOrbit creativeOrbitOne" /><div className="creativeOrbit creativeOrbitTwo" /><div className="creativeSticker">IDEAS<br />WELCOME <ArrowUpRight size={16} /></div><div className="creativeSpark">✳</div></div>
          <div className="creativeArtBottom"><span>{t.artBottom}</span><Sparkles size={15} /></div>
        </div>
      </div>
      <div className="creativePrinciples"><span><b>01</b>{t.meta1}</span><span><b>02</b>{t.meta2}</span><span><b>03</b>{t.meta3}</span></div>
      <div className="creativeScrollHint"><span /> SCROLL TO EXPLORE</div>
    </section>

    <section className="creativeWork creativeShell" id="work">
      <div className="creativeSectionHead"><div><p className="creativeEyebrow">{t.projectsEyebrow}</p><h2>{t.projectsTitle}<em>.</em></h2></div><p>{t.projectsNote}</p></div>
      <div className="creativeProjectGrid">{projects.map((project) => <article className={`creativeProject creativeProject-${project.tone}`} key={project.number}>
        <div className="creativeProjectTop"><span>PROJECT / {project.number}</span><span className="creativeStatus"><i />{lang === "en" ? project.status : t.status}</span></div>
        <div className="creativeProjectArt"><div className="creativeProjectGridLines" /><div className="creativeProjectSymbol">{project.number === "01" ? <><span className="symbolHouse">⌂</span><span className="symbolRing" /></> : <><span className="symbolStar">✳</span><span className="symbolWindow" /></>}</div><span className="creativeProjectLabel">{project.type}</span><span className="creativeProjectCorner"><ArrowUpRight size={21} /></span></div>
        <div className="creativeProjectInfo"><p>{project.type}</p><h3>{project.name}</h3><div className="creativeProjectDesc">{lang === "en" ? project.description : project.neDescription}</div><div className="creativeTags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="creativeProjectActions"><a href={project.href} target={project.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">{lang === "en" ? project.label : project.neLabel}<ArrowUpRight size={16} /></a>{project.href.startsWith("https://") && <details className="creativePreview"><summary>{lang === "en" ? "Live preview" : "लाइभ प्रिभ्यू"}</summary><div className="creativePreviewFrame"><iframe src={project.href} title={`${project.name} live preview`} loading="lazy" referrerPolicy="no-referrer" /></div><a href={project.href} target="_blank" rel="noreferrer">Open in new tab <ArrowUpRight size={13}/></a></details>}</div></div>
      </article>)}</div>
    </section>

    <section className="creativeTerminal creativeShell" id="terminal"><div className="creativeTerminalIntro"><p className="creativeEyebrow"><Terminal size={14} /> INTERACTIVE TERMINAL</p><h2>A little <em>under the hood.</em></h2><p>Explore the portfolio using a few simple commands.</p></div><div className="creativeTerminalWindow"><div className="creativeTerminalBar"><span><i/><i/><i/></span><strong>manjit.dev — zsh</strong><a href="https://github.com/manjitkalpana" target="_blank" rel="noreferrer"><Github size={14}/> source</a></div><div className="creativeTerminalBody" aria-live="polite">{terminalOutput.map((line, i) => <p key={i} className={line.startsWith("guest@") ? "terminalCommand" : "terminalResponse"}>{line}</p>)}<form className="creativeTerminalPrompt" onSubmit={(event) => { event.preventDefault(); runTerminal(); }}><label htmlFor="terminal-command">guest@manjit.dev:~$</label><input id="terminal-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} placeholder="type help..." autoComplete="off" /><button type="submit" aria-label="Run terminal command"><ArrowUpRight size={16}/></button></form></div></div><a className="creativeGithubLink" href="https://github.com/manjitkalpana?tab=repositories" target="_blank" rel="noreferrer"><Github size={16}/> Browse GitHub repositories <ArrowUpRight size={15}/></a></section>

    <section className="creativeAbout" id="about"><div className="creativeShell creativeAboutGrid">
      <div className="creativeAboutVisual"><p className="creativeEyebrow">{t.aboutEyebrow}</p><div className="creativeMonogram"><span>M</span><span>R</span><i>✳</i></div><div className="creativeAboutCaption"><MapPin size={14} /> SUDURPASCHIM, NEPAL <span>·</span> BUILDING EVERY DAY</div></div>
      <div className="creativeAboutCopy"><p className="creativeEyebrow">DEVELOPER PROFILE</p><h2>{t.aboutTitleA}<br /><em>{t.aboutTitleB}</em></h2><p className="creativeLead">{t.aboutLead}</p><p>{t.aboutText}</p><div className="creativeFacts"><div><span>01 / {t.focusLabel}</span><strong>{t.focus}</strong></div><div><span>02 / {t.languagesLabel}</span><strong>{t.languages}</strong></div><div><span>03 / {t.styleLabel}</span><strong>{t.workStyle}</strong></div></div></div>
    </div></section>

    <section className="creativeSkills creativeShell" id="skills"><div className="creativeSectionHead"><div><p className="creativeEyebrow">{t.skillsEyebrow}</p><h2>{t.skillsTitle}<em>.</em></h2></div><p>{t.skillsNote}</p></div><div className="creativeSkillList">{skills.map((skill, index) => { const Icon = skill.icon; return <div className="creativeSkill" key={skill.name}><span className="creativeSkillNumber">0{index + 1}</span><Icon size={21} strokeWidth={1.7} /><strong>{skill.name}</strong><span className="creativeSkillGroup">{skill.group}</span><ArrowUpRight className="creativeSkillArrow" size={17} /></div>; })}</div><div className="creativeSkillFooter"><span><Zap size={15} />{t.learning}</span><span><Workflow size={15} />{t.process}</span></div></section>

    <section className="creativeContact" id="contact"><div className="creativeShell creativeContactGrid"><div className="creativeContactIntro"><p className="creativeEyebrow">{t.contactEyebrow}</p><h2>{t.contactTitleA}<br /><em>{t.contactTitleB}</em></h2><p>{t.contactText}</p><a className="creativeEmail" href="mailto:rnmanjit192@gmail.com"><Mail size={17} />rnmanjit192@gmail.com<ArrowUpRight size={16} /></a><div className="creativeSocials" aria-label="Social profiles"><a href="https://github.com/manjitkalpana" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a><a href="https://www.linkedin.com/in/kmcmanjeet12/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a><a href="https://www.facebook.com/kmcmanjeet12" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a><a href="https://www.freelancer.si/u/rnmanjit2844" target="_blank" rel="noreferrer" aria-label="Freelancer"><BriefcaseBusiness size={18} /></a></div></div><div className="creativeContactForm"><div className="creativeFormHeader"><span>NEW PROJECT / COLLABORATION</span><span>CONTACT.init() ↘</span></div><ContactForm /></div></div></section>

    <footer className="creativeFooter creativeShell"><a className="creativeFooterBrand" href="#top">manjit<span>✳</span></a><p>{t.footer}</p><div><span>© 2026 MANJIT RANA</span><a href="#top">{t.backTop} ↑</a></div></footer>
  </main>;
}
