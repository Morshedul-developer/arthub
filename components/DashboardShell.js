"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const roleLabel = { user: "Buyer", artist: "Artist", admin: "Admin" };

const navItems = {
  user: [
    { label: "Overview", path: "" },
    { label: "Purchase History", path: "/purchases" },
    { label: "My Collection", path: "/collection" },
    { label: "Subscription", path: "/subscription" },
    { label: "Edit Profile", path: "/profile" },
  ],
  artist: [
    { label: "Overview", path: "" },
    { label: "Add Artwork", path: "/add-artwork" },
    { label: "Manage Artworks", path: "/manage-artworks" },
    { label: "Sales History", path: "/sales" },
    { label: "Edit Profile", path: "/profile" },
  ],
  admin: [
    { label: "Overview", path: "" },
    { label: "Manage Users", path: "/users" },
    { label: "All Artworks", path: "/artworks" },
    { label: "Transactions", path: "/transactions" },
    { label: "Analytics", path: "/analytics" },
    { label: "Edit Profile", path: "/profile" },
  ],
};

export default function DashboardShell({ role, children }) {
  const pathname = usePathname();
  const items = navItems[role] || [];
  const base = `/dashboard/${role}`;

  return (
    <div className="section">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-52">
          <div className="sticky top-24">
            <p className="mb-3 px-3 text-xs font-black uppercase tracking-widest text-stone-400">
              {roleLabel[role]} Dashboard
            </p>
            <nav className="grid gap-0.5">
              {items.map(({ label, path }) => {
                const href = `${base}${path}`;
                const active = path === "" ? pathname === base : pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
                      active
                        ? "bg-stone-900 text-white hover:bg-stone-700"
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
