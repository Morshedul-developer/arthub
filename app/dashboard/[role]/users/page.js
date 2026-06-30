"use client";

import { use, useState } from "react";
import { api } from "../../../../lib/api";
import { useDashboard } from "../../useDashboard";

const ROLES = ["user", "artist", "admin"];

export default function UsersPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);
  const [users, setUsers] = useState(null);
  const [changingId, setChangingId] = useState(null);

  const list = users ?? data?.users ?? [];

  async function changeRole(userId, newRole) {
    setChangingId(userId);
    try {
      const updated = await api(`/dashboard/admin/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role: newRole }) });
      setUsers(list.map((u) => u._id === userId ? { ...u, role: updated.role } : u));
    } finally {
      setChangingId(null);
    }
  }

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Manage Users</h1>
        <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-bold text-stone-600">{list.length} users</span>
      </div>

      <div className="card overflow-x-auto p-5">
        <table className="w-full text-left text-sm">
          <thead className="text-stone-500">
            <tr><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Change Role</th></tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr key={user._id} className="border-t border-stone-200">
                <td className="py-3 font-medium">{user.name}</td>
                <td className="text-stone-600">{user.email}</td>
                <td>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black capitalize ${
                    user.role === "admin" ? "bg-amber-100 text-amber-700" :
                    user.role === "artist" ? "bg-violet-100 text-violet-700" :
                    "bg-cyan-100 text-cyan-700"
                  }`}>{user.role}</span>
                </td>
                <td>
                  <div className="flex gap-1.5">
                    {ROLES.filter((r) => r !== user.role).map((r) => (
                      <button key={r} disabled={changingId === user._id}
                        onClick={() => changeRole(user._id, r)}
                        className="rounded border border-stone-200 bg-white px-2.5 py-1 text-xs font-bold text-stone-600 transition hover:border-stone-400 hover:text-stone-900 disabled:opacity-50 capitalize"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
