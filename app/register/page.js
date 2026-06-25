"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password
    });

    if (result.error) {
      setLoading(false);
      return setError(result.error.message || "Registration failed.");
    }

    await api("/profile/sync", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        role: form.role,
        betterAuthUserId: result.data?.user?.id
      })
    });

    // Issue JWT cookie immediately after registration
    await api("/auth/token", { method: "POST" }).catch(() => {});

    setLoading(false);
    // Hard navigation so the page fully reloads with the JWT cookie already set.
    // Soft navigation (router.push) keeps React state alive and the Navbar effect
    // won't re-fire because session?.user object reference hasn't changed.
    window.location.href = form.role === "artist" ? "/dashboard/artist" : form.role === "admin" ? "/dashboard/admin" : "/";
  }

  return (
    <section className="section max-w-xl" style={styles.section}>
      <div className="card p-6" style={styles.card}>
        <h1 className="text-3xl font-black" style={styles.title}>Create Account</h1>
        <p className="mt-2 text-stone-600" style={styles.subtitle}>Register as a buyer or artist. Admin can be seeded separately.</p>
        {error && <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700" style={styles.error}>{error}</p>}
        <form onSubmit={submit} className="mt-6 grid gap-4" style={styles.form}>
          <input className="field" style={styles.field} placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className="field" style={styles.field} type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <select className="field" style={styles.field} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="user">Buyer</option>
            <option value="artist">Artist</option>
          </select>
          <input className="field" style={styles.field} type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <input className="field" style={styles.field} type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
          <button className="btn btn-dark" style={styles.primaryButton} disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        </form>
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine} />
        </div>
        <button
          type="button"
          style={styles.googleButton}
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/auth/callback" })}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
        <p className="mt-4 text-sm text-stone-600" style={styles.footerText}>
          Already have an account? <Link href="/login" className="font-bold text-emerald-700" style={styles.link}>Login</Link>
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
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1.25rem 0 0"
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e7e5e4"
  },
  dividerText: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  googleButton: {
    marginTop: "0.75rem",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    border: "1px solid #d6d3d1",
    borderRadius: "0.5rem",
    background: "white",
    color: "#1c1917",
    padding: "0.85rem 1rem",
    fontWeight: 800,
    fontSize: "0.95rem",
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
