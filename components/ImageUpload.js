"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function ImageUpload({ value, onChange, label = "Image", aspectRatio = "aspect-video" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error?.message || "Upload failed.");

      onChange(data.data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
          <img src={value} alt={label} className={`w-full object-cover ${aspectRatio}`} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 py-6 text-sm font-semibold text-stone-500 transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "Uploading…" : `Upload ${label}`}
        </button>
      )}

      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
