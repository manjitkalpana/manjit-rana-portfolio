"use client";

import { useCallback, useEffect, useState } from "react";

type Story = {
  id: string; title: string; url: string; summary: string | null;
  published_at: string | null; created_at: string; status: string;
  verification_status: string; draft_headline: string | null;
  draft_summary: string | null; draft_body_md: string | null;
  editorial_notes: string | null; duplicate_group: string | null;
  suggested_category: string | null; country_code: string | null;
};
type Stats = { total: number; needsReview: number; corroborated: number; rejected: number; published: number };

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f4f5f7", color: "#18202b", fontFamily: "Arial, sans-serif", padding: "28px 18px 60px" },
  shell: { maxWidth: 1120, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 28 },
  brand: { fontSize: 22, fontWeight: 900, letterSpacing: "-1px" },
  muted: { color: "#687386", fontSize: 13 },
  panel: { background: "#fff", border: "1px solid #e2e6ec", borderRadius: 14, padding: 22, boxShadow: "0 5px 20px rgba(20,30,50,.04)" },
  button: { border: "1px solid #d5dbe4", background: "#fff", borderRadius: 8, padding: "9px 12px", fontWeight: 700, cursor: "pointer", color: "#18202b" },
  input: { width: "100%", border: "1px solid #d5dbe4", borderRadius: 8, padding: 12, fontSize: 15, margin: "10px 0 14px" },
  badge: { display: "inline-block", background: "#eef2f7", borderRadius: 20, padding: "5px 9px", fontSize: 11, fontWeight: 700, color: "#48566b" },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState<Story[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState("needs_review");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const response = await fetch("/api/admin/discovered", { cache: "no-store" });
    if (response.status === 401) { setLoggedIn(false); return; }
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Unable to load newsroom."); return; }
    setItems(data.items || []);
    setStats(data.stats || null);
    setLoggedIn(true);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy("login"); setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    setBusy("");
    if (!response.ok) { setError(data.error || "Login failed."); return; }
    setPassword(""); setLoggedIn(true); await load();
  }

  async function act(item: Story, action: "verify" | "reject" | "publish") {
    if (action === "publish" && !window.confirm("Publish this story on the public website? Only proceed after checking the original reports and confirming the facts independently.")) return;
    const key = item.id + action; setBusy(key); setError(""); setMessage("");
    const response = await fetch("/api/admin/discovered", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, action })
    });
    const data = await response.json();
    setBusy("");
    if (!response.ok) { setError(data.error || "Action failed."); return; }
    setMessage(data.message || (action === "reject" ? "Story rejected." : "Story updated."));
    await load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setLoggedIn(false); setItems([]); setStats(null);
  }

  const visible = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "corroborated") return item.verification_status === "corroborated";
    if (filter === "rejected") return item.status === "rejected";
    if (filter === "published") return item.status === "published";
    return item.status === "needs_review" && item.verification_status !== "corroborated";
  });

  if (!loggedIn) return <main style={styles.page}><div style={{ ...styles.shell, maxWidth: 430, paddingTop: 70 }}>
    <div style={{ ...styles.panel, padding: 28 }}>
      <div style={styles.brand}>MANJIT<span style={{ color: "#b51f2b" }}>RANA</span> NEWSROOM</div>
      <p style={styles.muted}>Private editorial dashboard. Sign in to review discovered stories.</p>
      <form onSubmit={login}>
        <label htmlFor="admin-password" style={{ fontSize: 13, fontWeight: 700 }}>Admin password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <button type="submit" disabled={busy === "login"} style={{ ...styles.button, width: "100%", background: "#172235", color: "#fff", padding: 12 }}>{busy === "login" ? "Signing in…" : "Sign in"}</button>
      </form>
      {error && <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p>}
      <p style={{ ...styles.muted, marginTop: 18 }}>Admin access is private. Never share your password or session.</p>
    </div>
  </div></main>;

  return <main style={styles.page}><div style={styles.shell}>
    <header style={styles.header}>
      <div><div style={styles.brand}>MANJIT<span style={{ color: "#b51f2b" }}>RANA</span> NEWSROOM</div><div style={styles.muted}>Editorial review desk · RSS discoveries are not verified reporting</div></div>
      <div style={{ display: "flex", gap: 8 }}><button style={styles.button} onClick={() => void load()}>Refresh</button><button style={styles.button} onClick={() => void logout()}>Sign out</button></div>
    </header>

    {stats && <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))", gap: 12, marginBottom: 20 }}>
      {([["Total discoveries", stats.total], ["Needs review", stats.needsReview], ["Editor verified", stats.corroborated], ["Published", stats.published], ["Rejected", stats.rejected]] as [string,number][]).map(([label,value]) => <div key={label} style={styles.panel}><div style={{ ...styles.muted, marginBottom: 8 }}>{label}</div><div style={{ fontSize: 27, fontWeight: 800 }}>{value}</div></div>)}
    </section>}

    <section style={styles.panel}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div><h1 style={{ fontSize: 22, margin: 0 }}>Discovered stories</h1><p style={styles.muted}>Review the original publisher report before taking editorial action.</p></div>
        <select aria-label="Filter stories" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...styles.input, width: "auto", margin: 0 }}>
          <option value="needs_review">Needs review</option><option value="corroborated">Editor verified</option><option value="published">Published</option><option value="rejected">Rejected</option><option value="all">All records</option>
        </select>
      </div>
      {message && <p style={{ color: "#067647", background: "#ecfdf3", padding: 10, borderRadius: 8, fontSize: 13 }}>{message}</p>}
      {error && <p style={{ color: "#b42318", background: "#fef3f2", padding: 10, borderRadius: 8, fontSize: 13 }}>{error}</p>}
      {visible.length === 0 && <p style={styles.muted}>No stories in this view yet.</p>}
      <div style={{ display: "grid", gap: 14 }}>
        {visible.map((item) => <article key={item.id} style={{ border: "1px solid #e5e9ef", borderRadius: 11, padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 9 }}>
            <span style={styles.badge}>{item.status.replaceAll("_", " ")}</span>
            <span style={styles.badge}>{item.verification_status.replaceAll("_", " ")}</span>
            {item.suggested_category && <span style={styles.badge}>{item.suggested_category}</span>}
            {item.duplicate_group && <span style={styles.badge}>Duplicate group available</span>}
          </div>
          <h2 style={{ fontSize: 18, lineHeight: 1.35, margin: "7px 0" }}>{item.draft_headline || item.title}</h2>
          <p style={{ color: "#586477", fontSize: 14, lineHeight: 1.55 }}>{item.draft_summary || item.summary || "No publisher summary supplied."}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#687386", margin: "12px 0" }}>
            <span>Collected: {new Date(item.created_at).toLocaleString()}</span>
            <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 700 }}>Open original report ↗</a>
          </div>
          {item.editorial_notes && <p style={{ background: "#fff8e6", color: "#7a4b00", padding: 10, borderRadius: 7, fontSize: 12, lineHeight: 1.5 }}>{item.editorial_notes}</p>}
          <details style={{ margin: "12px 0" }}><summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Preview generated draft</summary><pre style={{ whiteSpace: "pre-wrap", font: "13px/1.6 Arial", background: "#f7f8fa", padding: 12, borderRadius: 8 }}>{item.draft_body_md || "No draft body available."}</pre></details>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {item.status !== "rejected" && item.status !== "published" && item.verification_status !== "corroborated" && <button disabled={!!busy} onClick={() => void act(item,"verify")} style={{ ...styles.button, background: "#eff6ff", borderColor: "#bfdbfe" }}>{busy === item.id+"verify" ? "Saving…" : "I checked sources — mark verified"}</button>}
            {item.status !== "rejected" && item.status !== "published" && item.verification_status === "corroborated" && <button disabled={!!busy} onClick={() => void act(item,"publish")} style={{ ...styles.button, background: "#172235", color: "#fff" }}>{busy === item.id+"publish" ? "Publishing…" : "Publish article"}</button>}
            {item.status !== "rejected" && item.status !== "published" && <button disabled={!!busy} onClick={() => void act(item,"reject")} style={{ ...styles.button, color: "#b42318" }}>{busy === item.id+"reject" ? "Rejecting…" : "Reject"}</button>}
          </div>
          {item.verification_status !== "corroborated" && item.status !== "published" && <p style={{ ...styles.muted, marginBottom: 0 }}>Publishing stays locked until you manually confirm independent verification.</p>}
        </article>)}
      </div>
    </section>
    <p style={{ ...styles.muted, marginTop: 18 }}>Publishing makes the article public immediately. Check names, dates, claims, context, and source links before marking a story verified.</p>
  </div></main>;
}
