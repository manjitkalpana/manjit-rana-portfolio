"use client";

import { FormEvent, useState } from "react";
import { Mail, MessageSquareText, Send, UserRound } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:rnmanjit192@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return <form className="contactForm" onSubmit={submit}>
    <div className="formRow">
      <label><span><UserRound size={15} /> Your name</span><input name="name" placeholder="Your full name" autoComplete="name" required /></label>
      <label><span><Mail size={15} /> Email address</span><input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
    </div>
    <label><span><MessageSquareText size={15} /> Tell me about your project</span><textarea name="message" placeholder="What would you like to build?" rows={5} required /></label>
    <div className="formFoot"><button type="submit">Send message <Send size={17} /></button>{sent && <p>Your email app is ready—press Send there to deliver your message.</p>}</div>
  </form>;
}
