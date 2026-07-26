"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth-client";
import { setSessionHint } from "../../lib/session-hint";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await authClient.signIn.email({
      email: form.email,
      password: form.password
    });

    if (result.error) {
      setLoading(false);
      return setError(result.error.message || "Login failed.");
    }

    // Exchange Better Auth session for JWT and get role for redirect
    const tokenResult = await api("/auth/token", { method: "POST" }).catch(() => null);
    const role = tokenResult?.role;
    setSessionHint();

    setLoading(false);
    router.refresh();
    const target = role === "artist" ? "/dashboard/artist" : role === "admin" ? "/dashboard/admin" : "/";
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.push(redirect && redirect.startsWith(target) ? redirect : target);
  }

  return (
    <section className="section max-w-xl" style={styles.section}>
      <div className="card p-6" style={styles.card}>
        <h1 className="text-3xl font-black" style={styles.title}>Login</h1>
        <p className="mt-2 text-stone-600" style={styles.subtitle}>Sign in to your ArtHub account.</p>
        {error && <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700" style={styles.error}>{error}</p>}
        <form onSubmit={submit} className="mt-6 grid gap-4" style={styles.form}>
          <input className="field" style={styles.field} type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="field" style={styles.field} type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button className="btn btn-dark" style={styles.primaryButton} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <button
          className="btn btn-light mt-3 w-full"
          style={styles.secondaryButton}
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/auth/callback` })}
        >
          Continue with Google
        </button>
        <p className="mt-4 text-sm text-stone-600" style={styles.footerText}>
          New here? <Link href="/register" className="font-bold text-emerald-700" style={styles.link}>Create account</Link>
        </p>
      </div>
    </section>
  );
}

const styles = {
  section: {
    maxWidth: "38rem",
    minHeight: "calc(100vh - 20rem)",
    margin: "0 auto",
    padding: "4rem 1rem"
  },
  card: {
    border: "1px solid #e7e5e4",
    borderRadius: "0.75rem",
    background: "white",
    boxShadow: "0 16px 40px rgba(28,25,23,0.08)",
    padding: "2rem"
  },
  title: {
    margin: 0,
    fontSize: "2.25rem",
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#1c1917"
  },
  subtitle: {
    marginTop: "0.75rem",
    color: "#57534e",
    lineHeight: 1.6
  },
  error: {
    marginTop: "1rem",
    borderRadius: "0.45rem",
    background: "#fff1f2",
    color: "#be123c",
    padding: "0.8rem",
    fontSize: "0.92rem"
  },
  form: {
    marginTop: "1.5rem",
    display: "grid",
    gap: "1rem"
  },
  field: {
    width: "100%",
    border: "1px solid #d6d3d1",
    borderRadius: "0.5rem",
    padding: "0.85rem 0.95rem",
    outline: "none",
    fontSize: "1rem"
  },
  primaryButton: {
    border: 0,
    borderRadius: "0.5rem",
    background: "#1c1917",
    color: "white",
    padding: "0.85rem 1rem",
    fontWeight: 800,
  },
  secondaryButton: {
    width: "100%",
    marginTop: "0.8rem",
    border: "1px solid #d6d3d1",
    borderRadius: "0.5rem",
    background: "white",
    color: "#1c1917",
    padding: "0.85rem 1rem",
    fontWeight: 800,
  },
  footerText: {
    marginTop: "1rem",
    color: "#57534e",
    fontSize: "0.95rem"
  },
  link: {
    color: "#047857",
    fontWeight: 800,
    textDecoration: "none"
  }
};
