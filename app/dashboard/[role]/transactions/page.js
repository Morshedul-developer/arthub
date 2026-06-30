"use client";

import { use } from "react";
import { money } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

export default function TransactionsPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  const totalRevenue = data.transactions?.filter((t) => t.status === "paid").reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Transactions</h1>
        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">Revenue: {money(totalRevenue)}</div>
      </div>

      <div className="card overflow-x-auto p-5">
        {data.transactions?.length ? (
          <table className="w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr><th className="pb-3">ID</th><th className="pb-3">Type</th><th className="pb-3">User</th><th className="pb-3">Artwork</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr key={t._id} className="border-t border-stone-200">
                  <td className="py-3 font-mono text-xs text-stone-400">{t._id.slice(-6)}</td>
                  <td className="capitalize">{t.type}</td>
                  <td>{t.buyer?.email || "—"}</td>
                  <td>{t.artwork?.title || "—"}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${t.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="text-right font-bold text-emerald-700">{money(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-stone-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
