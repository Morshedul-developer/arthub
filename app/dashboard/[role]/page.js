"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart, ImagePlus, Palette, ShoppingBag, TrendingUp, Users, WalletCards } from "lucide-react";
import { api, money } from "../../../lib/api";

export default function DashboardPage({ params }) {
  const { role } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const load = () =>
      api(`/dashboard/${role}`)
        .then((d) => {
          if (d.profile?.role && d.profile.role !== role) {
            router.replace(`/dashboard/${d.profile.role}`);
            return;
          }
          setData(d);
        })
        .catch((err) => setError(err.message));

    if (sessionId) {
      api("/checkout/verify", { method: "POST", body: JSON.stringify({ sessionId }) })
        .catch(() => {})
        .finally(load);
    } else {
      load();
    }
  }, [role, router, searchParams]);

  if (error) return (
    <div className="card p-8 text-center">
      <h1 className="text-2xl font-black">Dashboard locked</h1>
      <p className="mt-2 text-stone-600">{error}</p>
      <Link href="/login" className="btn btn-dark mt-5">Login</Link>
    </div>
  );

  if (!data) return <div className="card h-64 animate-pulse" />;

  if (role === "artist") {
    const totalSales = data.sales?.length || 0;
    const revenue = data.sales?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;
    const activeArtworks = data.artworks?.filter((a) => a.status === "active").length || 0;

    return (
      <div className="grid gap-6">
        <div>
          <p className="font-semibold text-emerald-700">Welcome back</p>
          <h1 className="mt-1 text-3xl font-black">{data.profile?.name}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Palette, "Artworks", data.artworks?.length || 0],
            [ImagePlus, "Active", activeArtworks],
            [ShoppingBag, "Sales", totalSales],
            [TrendingUp, "Revenue", money(revenue)],
          ].map(([Icon, label, value]) => (
            <div key={label} className="card p-5">
              <Icon className="text-emerald-700" size={20} />
              <p className="mt-4 text-sm text-stone-500">{label}</p>
              <p className="text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>
        {data.sales?.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Recent Sales</h2>
              <Link href="/dashboard/artist/sales" className="text-sm font-bold text-emerald-700 hover:underline">View all</Link>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-stone-500"><tr><th>Artwork</th><th>Buyer</th><th>Date</th><th className="text-right">Amount</th></tr></thead>
                <tbody>
                  {data.sales.slice(0, 5).map((sale) => (
                    <tr key={sale._id} className="border-t border-stone-200">
                      <td className="py-2 font-medium">{sale.artwork?.title || "—"}</td>
                      <td>{sale.buyer?.name || "—"}</td>
                      <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="text-right font-bold text-emerald-700">{money(sale.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (role === "user") {
    const totalSpent = data.purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    return (
      <div className="grid gap-6">
        <div>
          <p className="font-semibold text-emerald-700">Welcome back</p>
          <h1 className="mt-1 text-3xl font-black">{data.profile?.name}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [ShoppingBag, "Purchases", data.purchases?.length || 0],
            [Palette, "Collection", data.boughtArtworks?.length || 0],
            [WalletCards, "Total Spent", money(totalSpent)],
          ].map(([Icon, label, value]) => (
            <div key={label} className="card p-5">
              <Icon className="text-emerald-700" size={20} />
              <p className="mt-4 text-sm text-stone-500">{label}</p>
              <p className="text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Recent Purchases</h2>
            <Link href="/dashboard/user/purchases" className="text-sm font-bold text-emerald-700 hover:underline">View all</Link>
          </div>
          {data.purchases?.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-stone-500"><tr><th>Artwork</th><th>Artist</th><th>Date</th><th className="text-right">Amount</th></tr></thead>
                <tbody>
                  {data.purchases.slice(0, 5).map((item) => (
                    <tr key={item._id} className="border-t border-stone-200">
                      <td className="py-2 font-medium">{item.artwork?.title}</td>
                      <td>{item.artist?.name}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="text-right font-bold text-emerald-700">{money(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-stone-500">No purchases yet. <Link href="/artworks" className="font-bold text-emerald-700 hover:underline">Browse artworks</Link></p>
          )}
        </div>
      </div>
    );
  }

  // Admin overview
  return (
    <div className="grid gap-6">
      <div>
        <p className="font-semibold text-emerald-700">Welcome back</p>
        <h1 className="mt-1 text-3xl font-black">{data.profile?.name || "Admin"}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          [Users, "Total Users", data.stats?.totalUsers],
          [Palette, "Artists", data.stats?.totalArtists],
          [WalletCards, "Artworks Sold", data.stats?.totalArtworksSold],
          [BarChart, "Revenue", money(data.stats?.totalRevenue)],
        ].map(([Icon, label, value]) => (
          <div key={label} className="card p-5">
            <Icon className="text-emerald-700" size={20} />
            <p className="mt-4 text-sm text-stone-500">{label}</p>
            <p className="text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
