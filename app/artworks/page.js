"use client";

import { useEffect, useMemo, useState } from "react";
import ArtworkCard from "../../components/ArtworkCard";
import LoadingCards from "../../components/LoadingCards";
import { api } from "../../lib/api";

const categories = ["All", "Painting", "Digital", "Sculpture", "Abstract", "Photography", "Mixed Media"];

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    min: "",
    max: "",
    sort: "newest",
    page: 1
  });

  const query = useMemo(() => new URLSearchParams(filters).toString(), [filters]);

  useEffect(() => {
    setLoading(true);
    api(`/artworks?${query}`)
      .then((data) => {
        setArtworks(data.items);
        setMeta({ page: data.page, pages: data.pages || 1, total: data.total });
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));
  }

  return (
    <section className="section">
      <div className="mb-8">
        <p className="font-semibold text-emerald-700">Marketplace</p>
        <h1 className="mt-2 text-4xl font-black">Browse Artworks</h1>
        <p className="mt-3 max-w-2xl text-stone-600">Search, filter, and sort artworks. Purchase and comment actions require login.</p>
      </div>

      <div className="card mb-8 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <input className="field" placeholder="Search title or category" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
        <select className="field" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input className="field" placeholder="Min price" value={filters.min} onChange={(event) => updateFilter("min", event.target.value)} />
        <input className="field" placeholder="Max price" value={filters.max} onChange={(event) => updateFilter("max", event.target.value)} />
        <select className="field" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_low">Price low-high</option>
          <option value="price_high">Price high-low</option>
        </select>
      </div>

      {loading && <LoadingCards count={8} />}
      {error && <div className="card p-6 text-rose-700">{error}</div>}
      {!loading && !error && !artworks.length && <div className="card p-8 text-center text-stone-600">No artworks matched your filters.</div>}

      {!loading && !error && artworks.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map((artwork) => <ArtworkCard key={artwork._id} artwork={artwork} />)}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-stone-500">{meta.total} artworks found</p>
            <div className="flex gap-2">
              <button className="btn btn-light" disabled={meta.page <= 1} onClick={() => updateFilter("page", meta.page - 1)}>Previous</button>
              <span className="btn btn-light">Page {meta.page} / {meta.pages}</span>
              <button className="btn btn-light" disabled={meta.page >= meta.pages} onClick={() => updateFilter("page", meta.page + 1)}>Next</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
