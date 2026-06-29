"use client";

import { use } from "react";
import { money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

export default function SalesPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  const totalRevenue = data.sales?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Sales History</h1>
        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          Total: {money(totalRevenue)}
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        {data.sales?.length ? (
          <table className="w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr><th className="pb-3">Artwork</th><th className="pb-3">Buyer</th><th className="pb-3">Date</th><th className="pb-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {data.sales.map((sale) => (
                <tr key={sale._id} className="border-t border-stone-200">
                  <td className="py-3 font-medium">{sale.artwork?.title || "—"}</td>
                  <td>{sale.buyer?.name || "—"}</td>
                  <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="text-right font-bold text-emerald-700">{money(sale.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-stone-500">No sales yet.</p>
        )}
      </div>
    </div>
  );
}
