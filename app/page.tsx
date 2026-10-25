import ContactForm from "./ContactForm";
import { Activity, ArrowDown, ArrowUp, BriefcaseBusiness, Code2, Cpu, Database, ExternalLink, Facebook, Figma, Github, Globe2, GraduationCap, House, Layers3, Linkedin, Mail, MapPin, Palette, SearchCheck, Server, ShieldCheck, Sparkles, Terminal, UserRound, Wifi, Zap } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

const skills = [
  { name: "Next.js", icon: Layers3 }, { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Code2 }, { name: "Tailwind CSS", icon: Palette },
  { name: "Supabase", icon: Database }, { name: "Vercel", icon: Server },
  { name: "Git & GitHub", icon: Github }, { name: "Responsive Design", icon: Globe2 },
  { name: "SEO", icon: SearchCheck }, { name: "UI/UX", icon: Figma },
];

export default function Home() {
  return <main>
    <nav className="nav shell" aria-label="Main navigation">
      <a className="brand brandIdentity" href="#top" aria-label="Manjit Rana home"><span className="brandName">Manjit Rana<i>.</i></span></a>
      <div className="navLinks"><a href="#about"><UserRound size={15} /> About</a><a href="#skills"><Code2 size={15} /> Skills</a><a href="#contact"><Mail size={15} /> Contact</a></div>
      <a className="navCta" href="mailto:rnmanjit192@gmail.com">Let&apos;s talk <ExternalLink size={16} /></a>
    </nav>

    <section className="hero shell" id="top">
      <div className="heroEyebrow"><span className="statusDot" /> Available for freelance projects <span className="systemOnline"><Wifi size={13} /> SYSTEM ONLINE</span></div>
      <h1>I build digital products<br /><em>with purpose.</em></h1>
      <div className="heroBottom">
        <p>I&apos;m <strong>Manjit Rana</strong>, a BIT student and web developer from Nepal. I turn useful ideas into fast, thoughtful and accessible digital experiences.</p>
        <a className="roundLink" href="#about" aria-label="Learn about me"><span>About me</span><ArrowDown size={25} /></a>
      </div>
      <div className="digitalRail" aria-label="Professional highlights"><span><Code2 size={17} /><b>Web</b><small>Development</small></span><span><Globe2 size={17} /><b>Nepal</b><small>Digital products</small></span><span><ShieldCheck size={17} /><b>Reliable</b><small>Clear project status</small></span></div>
      <div className="heroGrid" aria-hidden="true"><span className="shape shapeOne" /><span className="shape shapeTwo" /><span className="shape shapeThree" /><span className="codeCard"><div className="terminalTop"><i /><i /><i /><small><Terminal size={12} /> portfolio.tsx</small></div><code><em>const</em> builder = &#123;<br />&nbsp;&nbsp;name: &quot;Manjit Rana&quot;,<br />&nbsp;&nbsp;mission: &quot;build → impact&quot;<br />&#125;;</code></span></div>
    </section>

    <section className="marquee" aria-label="Areas of expertise"><div>WEB DEVELOPMENT <span>✦</span> PRODUCT DESIGN <span>✦</span> PROBLEM SOLVING <span>✦</span> DIGITAL EXPERIENCES <span>✦</span> WEB DEVELOPMENT</div></section>

    <section className="about" id="about"><div className="shell aboutGrid">
      
      <div className="aboutCopy"><span className="kicker">A little about me</span><h2>Curious mind.<br />Practical builder.</h2>
        <p className="lead">I study Bachelor of Information Technology at Kailali Multiple Campus, Far Western University. I enjoy learning by building—then improving until the result feels simple and useful.</p>
        <p>My work combines front-end development, product thinking and hands-on deployment. I&apos;m especially interested in education, local discovery, jobs and tools that make everyday tasks easier.</p>
        <div className="experiencePanel" aria-label="Professional profile">
          <div><BriefcaseBusiness size={18} /><span><small>Experience</small><strong>IT Assistant</strong><em>Beldandi Institute of Technology</em></span></div>
          <div><Globe2 size={18} /><span><small>Languages</small><strong>Nepali · English · Hindi</strong><em>Professional communication</em></span></div>
          <a href="https://www.freelancer.si/u/rnmanjit2844" target="_blank" rel="noreferrer"><ExternalLink size={18} /><span><small>Freelancer</small><strong>@rnmanjit2844</strong><em>$10 USD / hour profile</em></span></a>
        </div>
        <div className="facts"><div><GraduationCap size={20} /><strong>BIT</strong><span>Current degree</span></div><div><MapPin size={20} /><strong>NP</strong><span>Based in Nepal</span></div></div>
      </div>
    </div></section>

    <section className="skills shell" id="skills"><div className="sectionHead compact"><div><span className="kicker">Digital toolkit</span><h2>Technology I work with</h2></div><div className="toolkitChip"><Cpu size={17} /> Modern web stack <Zap size={15} /></div></div><div className="skillList">{skills.map((skill,index)=>{const Icon=skill.icon;return <span key={skill.name}><b>{String(index+1).padStart(2,"0")}</b><Icon size={21} />{skill.name}<small>READY</small></span>})}</div></section>

    <section className="contact" id="contact"><div className="shell contactInner"><div className="contactIntro"><span className="kicker">Have a project in mind?</span><h2>Let&apos;s make something<br /><em>worth sharing.</em></h2><p>Share a few details and I&apos;ll get back to you. You can also email me directly at <a href="mailto:rnmanjit192@gmail.com">rnmanjit192@gmail.com</a>.</p><div className="socialLinks" aria-label="Social profiles"><a href="https://www.linkedin.com/in/kmcmanjeet12/" target="_blank" rel="noreferrer"><Linkedin size={19} /><span><b>LinkedIn</b><small>/kmcmanjeet12</small></span><ExternalLink size={14} /></a><a href="https://www.facebook.com/kmcmanjeet12" target="_blank" rel="noreferrer"><Facebook size={19} /><span><b>Facebook</b><small>/kmcmanjeet12</small></span><ExternalLink size={14} /></a><a href="https://www.tiktok.com/@kanxa_babu9" target="_blank" rel="noreferrer"><FaTiktok size={18} /><span><b>TikTok</b><small>@kanxa_babu9</small></span><ExternalLink size={14} /></a><a href="https://www.freelancer.si/u/rnmanjit2844" target="_blank" rel="noreferrer"><BriefcaseBusiness size={19} /><span><b>Freelancer</b><small>@rnmanjit2844</small></span><ExternalLink size={14} /></a></div></div><ContactForm /></div></section>
    <footer className="shell"><div className="brand fullBrand">Manjit Rana<span>.</span></div><p>© 2026 Manjit Rana. Accurate project status, genuine work.</p><div><a href="https://github.com/manjitkalpana" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://www.linkedin.com/in/kmcmanjeet12/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://www.facebook.com/kmcmanjeet12" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a href="https://www.tiktok.com/@kanxa_babu9" target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok size={17} /></a><a href="https://www.freelancer.si/u/rnmanjit2844" target="_blank" rel="noreferrer" aria-label="Freelancer"><BriefcaseBusiness size={17} /></a><a href="#top">Back to top <ArrowUp size={16} /></a></div></footer>
  </main>;
}
