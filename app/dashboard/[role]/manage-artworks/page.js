"use client";

import { use, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api, money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";
import ImageUpload from "../../../../components/ImageUpload";

export default function ManageArtworksPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);
  const [artworks, setArtworks] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: "", category: "Painting", imageUrl: "" });

  const list = artworks ?? data?.artworks ?? [];

  function startEdit(artwork) {
    if (editingId === artwork._id) { setEditingId(null); return; }
    setEditingId(artwork._id);
    setEditForm({ title: artwork.title, description: artwork.description, price: artwork.price, category: artwork.category, imageUrl: artwork.imageUrl });
  }

  async function saveEdit(e, id) {
    e.preventDefault();
    try {
      const updated = await api(`/artworks/${id}`, { method: "PATCH", body: JSON.stringify(editForm) });
      setArtworks(list.map((a) => a._id === id ? { ...a, ...updated } : a));
      setEditingId(null);
      toast.success("Artwork updated.");
    } catch (err) {
      toast.error(err.message || "Failed to update artwork.");
    }
  }

  async function deleteArtwork(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api(`/artworks/${id}`, { method: "DELETE" });
      setArtworks(list.filter((a) => a._id !== id));
      if (editingId === id) setEditingId(null);
      toast.success("Artwork deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete artwork.");
    }
  }

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Manage Artworks</h1>
        <Link href={`/dashboard/${role}/add-artwork`} className="btn btn-dark">+ Add New</Link>
      </div>

      {list.length === 0 ? (
        <div className="card p-8 text-center text-stone-500">No artworks yet. <Link href={`/dashboard/${role}/add-artwork`} className="font-bold text-emerald-700 hover:underline">Add your first</Link></div>
      ) : (
        <div className="grid gap-3">
          {list.map((artwork) => (
            <div key={artwork._id} className="card overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <img src={artwork.imageUrl} alt={artwork.title} className="h-14 w-14 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{artwork.title}</p>
                  <p className="text-sm text-stone-500">{artwork.status} · {artwork.category} · {money(artwork.price)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="btn btn-light text-sm" onClick={() => startEdit(artwork)}>
                    {editingId === artwork._id ? "Cancel" : "Edit"}
                  </button>
                  <button onClick={() => deleteArtwork(artwork._id, artwork.title)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingId === artwork._id && (
                <form onSubmit={(e) => saveEdit(e, artwork._id)} className="border-t border-stone-200 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="field" placeholder="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                    <input className="field" placeholder="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
                    <textarea className="field min-h-20 sm:col-span-2" placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
                    <select className="field" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                      <option>Painting</option><option>Digital</option><option>Sculpture</option><option>Abstract</option><option>Photography</option>
                    </select>
                    <div />
                    <div className="sm:col-span-2">
                      <ImageUpload value={editForm.imageUrl} onChange={(url) => setEditForm({ ...editForm, imageUrl: url })} label="Artwork Image" />
                    </div>
                  </div>
                  <button className="btn btn-dark mt-3">Save Changes</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
