import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white" style={styles.footer}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8" style={styles.inner}>
        <div>
          <h2 className="text-xl font-bold" style={styles.title}>ArtHub</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-300" style={styles.text}>
            A focused marketplace where artists can publish work and collectors can discover original pieces.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400" style={styles.heading}>Quick links</h3>
          <div className="mt-3 grid gap-2 text-sm" style={styles.quickLinks}>
            <Link href="/artworks">Browse</Link>
            <Link href="/dashboard/user">Dashboard</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400" style={styles.heading}>Newsletter</h3>
          <div className="mt-3 flex rounded border border-stone-700 bg-stone-900 p-1" style={styles.newsletter}>
            <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Email address" style={styles.newsletterInput} />
            <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold">Join</button>
          </div>
          <div className="mt-4 flex gap-3 text-stone-300" style={styles.socials}>
            <Facebook size={18} />
            <Instagram size={18} />
            <Twitter size={18} />
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 px-4 py-4 text-center text-xs text-stone-400" style={styles.copy}>
        Copyright 2026 ArtHub. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: "1px solid #292524",
    background: "#1c1917",
    color: "white"
  },
  inner: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "2.5rem 1rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "2rem"
  },
  title: {
    fontSize: "1.35rem",
    fontWeight: 800,
    margin: 0
  },
  text: {
    maxWidth: "26rem",
    color: "#d6d3d1",
    fontSize: "0.95rem",
    lineHeight: 1.7
  },
  heading: {
    margin: 0,
    color: "#a8a29e",
    fontSize: "0.8rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  quickLinks: {
    display: "grid",
    gap: "0.65rem",
    marginTop: "0.9rem",
    fontSize: "0.95rem"
  },
  newsletter: {
    marginTop: "0.9rem",
    display: "flex",
    border: "1px solid #57534e",
    borderRadius: "0.45rem",
    padding: "0.25rem",
    background: "#292524"
  },
  newsletterInput: {
    minWidth: 0,
    flex: 1,
    border: 0,
    outline: 0,
    color: "white",
    background: "transparent",
    padding: "0.65rem"
  },
  socials: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
    color: "#d6d3d1"
  },
  copy: {
    borderTop: "1px solid #292524",
    padding: "1rem",
    textAlign: "center",
    color: "#a8a29e",
    fontSize: "0.8rem"
  }
};
