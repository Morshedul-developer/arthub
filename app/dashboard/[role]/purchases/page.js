"use client";

import { use } from "react";
import Link from "next/link";
import { money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

export default function PurchasesPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  const totalSpent = data.purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Purchase History</h1>
        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          Total spent: {money(totalSpent)}
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        {data.purchases?.length ? (
          <table className="w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr><th className="pb-3">Artwork</th><th className="pb-3">Artist</th><th className="pb-3">Date</th><th className="pb-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {data.purchases.map((item) => (
                <tr key={item._id} className="border-t border-stone-200">
                  <td className="py-3 font-medium">
                    <Link href={`/artworks/${item.artwork?._id}`} className="hover:text-emerald-700 hover:underline">
                      {item.artwork?.title || "—"}
                    </Link>
                  </td>
                  <td>{item.artist?.name || "—"}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="text-right font-bold text-emerald-700">{money(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-stone-500">No purchases yet. <Link href="/artworks" className="font-bold text-emerald-700 hover:underline">Browse artworks</Link></p>
        )}
      </div>
    </div>
  );
}
