"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import ImageUpload from "../../../../components/ImageUpload";

export default function AddArtworkPage({ params }) {
  const { role } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Painting", imageUrl: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api("/artworks", { method: "POST", body: JSON.stringify(form) });
      setMessage("Artwork published successfully!");
      setForm({ title: "", description: "", price: "", category: "Painting", imageUrl: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-black">Add Artwork</h1>
      <form onSubmit={submit} className="card p-6">
        {message && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p>}
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">Title</label>
            <input className="field" placeholder="Artwork title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">Description</label>
            <textarea className="field min-h-28" placeholder="Describe your artwork" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-stone-700">Price ($)</label>
              <input className="field" type="number" min="1" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-stone-700">Category</label>
              <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Painting</option><option>Digital</option><option>Sculpture</option><option>Abstract</option><option>Photography</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">Image</label>
            <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Artwork Image" />
          </div>
          <div className="flex gap-3">
            <button className="btn btn-dark flex-1" disabled={loading || !form.imageUrl}>
              {loading ? "Publishing…" : "Publish Artwork"}
            </button>
            <button type="button" className="btn btn-light" onClick={() => router.push(`/dashboard/${role}/manage-artworks`)}>
              View My Artworks
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
