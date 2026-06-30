"use client";

import { use } from "react";
import { useDashboard } from "../../useDashboard";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#06b6d4", "#eab308", "#ec4899", "#14b8a6", "#f43f5e"];

export default function AnalyticsPage({ params }) {
  const { role } = use(params);
  const { data, error } = useDashboard(role);

  if (error) return <div className="card p-8 text-center text-stone-600">{error}</div>;
  if (!data) return <div className="card h-64 animate-pulse" />;

  const { byCategory = [], sales = [] } = data.charts || {};

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-black">Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-lg font-black">Artworks by Category</h2>
          {byCategory.length ? (
            <ResponsiveContainer width="100%" height={380}>
              <PieChart margin={{ top: 10, right: 80, bottom: 10, left: 80 }}>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="40%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine
                >
                  {byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={60} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-stone-400">No data yet.</p>}
        </div>

        <div className="card flex flex-col p-5">
          <h2 className="mb-4 text-lg font-black">Recent Sales Revenue</h2>
          {sales.length ? (
            <div className="flex flex-1 items-center">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sales} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`$${v}`, "Amount"]} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-stone-400">No sales data yet.</p>}
        </div>
      </div>
    </div>
  );
}
