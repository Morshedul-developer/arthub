"use client";

import { use, useState } from "react";
import Link from "next/link";
import { api, money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

export default function AdminArtworksPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);
  const [artworks, setArtworks] = useState(null);

  const list = artworks ?? data?.artworks ?? [];

  async function deleteArtwork(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await api(`/artworks/${id}`, { method: "DELETE" });
    setArtworks(list.filter((a) => a._id !== id));
  }

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">All Artworks</h1>
        <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-bold text-stone-600">{list.length} artworks</span>
      </div>

      <div className="card overflow-x-auto p-5">
        <table className="w-full text-left text-sm">
          <thead className="text-stone-500">
            <tr><th className="pb-3">Title</th><th className="pb-3">Artist</th><th className="pb-3">Category</th><th className="pb-3">Price</th><th className="pb-3">Status</th><th className="pb-3"></th></tr>
          </thead>
          <tbody>
            {list.map((artwork) => (
              <tr key={artwork._id} className="border-t border-stone-200">
                <td className="py-3 font-medium">
                  <Link href={`/artworks/${artwork._id}`} className="hover:text-emerald-700 hover:underline">{artwork.title}</Link>
                </td>
                <td>{artwork.artist?.name || "—"}</td>
                <td>{artwork.category}</td>
                <td>{money(artwork.price)}</td>
                <td>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${artwork.status === "sold" ? "bg-stone-100 text-stone-500" : "bg-emerald-100 text-emerald-700"}`}>
                    {artwork.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => deleteArtwork(artwork._id, artwork.title)}
                    className="rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
