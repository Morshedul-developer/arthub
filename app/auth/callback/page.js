"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { api } from "../../../lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Issue JWT cookie and get role from Better Auth session
        const result = await api("/auth/token", { method: "POST" });
        const role = result?.role;

        setStatus("Redirecting…");

        if (role === "artist") router.replace("/dashboard/artist");
        else if (role === "admin") router.replace("/dashboard/admin");
        else router.replace("/");
      } catch {
        // Session not ready yet — retry once after a short delay
        setTimeout(async () => {
          try {
            const result = await api("/auth/token", { method: "POST" });
            const role = result?.role;
            if (role === "artist") router.replace("/dashboard/artist");
            else if (role === "admin") router.replace("/dashboard/admin");
            else router.replace("/");
          } catch {
            router.replace("/");
          }
        }, 1200);
      }
    }

    handleCallback();
  }, [router]);

  return (
    <section style={styles.root}>
      <div style={styles.card}>
        <span style={styles.icon}><Palette size={28} /></span>
        <p style={styles.status}>{status}</p>
        <div style={styles.dots}>
          <span style={{ ...styles.dot, animationDelay: "0s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
          <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  root: {
    minHeight: "calc(100vh - 8rem)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "1rem",
    padding: "3rem 4rem",
    boxShadow: "0 12px 40px rgba(28,25,23,0.08)"
  },
  icon: {
    display: "grid",
    placeItems: "center",
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "0.75rem",
    background: "#047857",
    color: "white"
  },
  status: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--ink)"
  },
  dots: {
    display: "flex",
    gap: "0.4rem",
    marginTop: "0.25rem"
  },
  dot: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    background: "#047857",
    display: "inline-block",
    animation: "bounce 1.2s infinite ease-in-out"
  }
};
