"use client";

import Link from "next/link";
import { money } from "../lib/api";

export default function ArtworkCard({ artwork }) {
  const artistName = artwork.artist?.name || "Unknown Artist";

  return (
    <Link href={`/artworks/${artwork._id}`} className="group block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md" style={styles.card}>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100" style={styles.imageWrap}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          style={styles.image}
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a8a29e' font-size='14' font-family='sans-serif'%3EImage unavailable%3C/text%3E%3C/svg%3E";
            e.currentTarget.onError = null;
          }}
        />
        {artwork.status === "sold" && (
          <span className="absolute right-3 top-3 rounded bg-rose-600 px-2 py-1 text-xs font-bold uppercase text-white" style={styles.sold}>Sold</span>
        )}
      </div>
      <div className="p-4" style={styles.body}>
        <div className="flex items-start justify-between gap-3" style={styles.row}>
          <div>
            <h3 className="font-semibold text-stone-950" style={styles.title}>{artwork.title}</h3>
            <p className="mt-1 text-sm text-stone-500" style={styles.artist}>{artistName}</p>
          </div>
          <p className="font-bold text-emerald-700" style={styles.price}>{money(artwork.price)}</p>
        </div>
        <p className="mt-3 inline-flex rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600" style={styles.category}>{artwork.category}</p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: "block",
    overflow: "hidden",
    border: "1px solid var(--line)",
    borderRadius: "0.65rem",
    background: "var(--surface)",
    boxShadow: "0 10px 26px rgba(28,25,23,0.07)",
    textDecoration: "none",
    color: "inherit"
  },
  imageWrap: {
    position: "relative",
    aspectRatio: "4 / 3",
    overflow: "hidden",
    background: "#f5f5f4"
  },
  image: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover"
  },
  sold: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    borderRadius: "0.35rem",
    background: "#e11d48",
    color: "white",
    padding: "0.28rem 0.5rem",
    fontSize: "0.72rem",
    fontWeight: 900,
    textTransform: "uppercase"
  },
  body: {
    padding: "1rem"
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "0.75rem"
  },
  title: {
    margin: 0,
    color: "var(--ink)",
    fontWeight: 800
  },
  artist: {
    margin: "0.3rem 0 0",
    color: "var(--muted)",
    fontSize: "0.9rem"
  },
  price: {
    margin: 0,
    color: "var(--accent)",
    fontWeight: 900,
    whiteSpace: "nowrap"
  },
  category: {
    display: "inline-flex",
    margin: "0.85rem 0 0",
    borderRadius: "0.35rem",
    background: "rgba(120,113,108,0.12)",
    color: "var(--muted)",
    padding: "0.3rem 0.5rem",
    fontSize: "0.78rem",
    fontWeight: 700
  }
};
