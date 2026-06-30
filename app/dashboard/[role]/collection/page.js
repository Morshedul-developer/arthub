"use client";

import { use } from "react";
import Link from "next/link";
import { money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

export default function CollectionPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-black">My Collection</h1>

      {data.boughtArtworks?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.boughtArtworks.map((artwork) => (
            <Link key={artwork._id} href={`/artworks/${artwork._id}`}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:shadow-md">
              <div className="aspect-square overflow-hidden bg-stone-100">
                <img src={artwork.imageUrl} alt={artwork.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-bold">{artwork.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-emerald-700">{money(artwork.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-stone-500">Your collection is empty.</p>
          <Link href="/artworks" className="btn btn-dark mt-4 inline-flex">Browse Artworks</Link>
        </div>
      )}
    </div>
  );
}
