"use client";

import { use } from "react";
import { api } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

const tiers = [
  { id: "free",    label: "Free",    limit: "Up to 3 artworks",  price: "$0 / month" },
  { id: "pro",     label: "Pro",     limit: "Up to 9 artworks",  price: "$9.99 / month" },
  { id: "premium", label: "Premium", limit: "Unlimited artworks", price: "$19.99 / month" },
];

export default function SubscriptionPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  async function subscribe(tier) {
    const result = await api("/checkout/subscribe", { method: "POST", body: JSON.stringify({ tier }) });
    if (result.url) window.location.href = result.url;
    else alert(result.message);
  }

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  const current = data.profile?.subscriptionTier || "free";

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Subscription</h1>
        <p className="mt-1 text-stone-500">Current plan: <span className="font-bold capitalize text-emerald-700">{current}</span></p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiers.map(({ id, label, limit, price }) => {
          const isCurrent = current === id;
          return (
            <div key={id} className={`card p-6 ${isCurrent ? "border-2 border-emerald-500" : ""}`}>
              {isCurrent && <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Current Plan</span>}
              <h2 className="text-xl font-black">{label}</h2>
              <p className="mt-1 text-2xl font-black text-emerald-700">{price}</p>
              <p className="mt-2 text-sm text-stone-500">{limit}</p>
              {!isCurrent && id !== "free" && (
                <button className="btn btn-dark mt-4 w-full" onClick={() => subscribe(id)}>
                  Upgrade to {label}
                </button>
              )}
              {!isCurrent && id === "free" && (
                <p className="mt-4 text-sm text-stone-400">Downgrade not available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
