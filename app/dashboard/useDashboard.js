"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export function useDashboard(role) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/dashboard/${role}`)
      .then((d) => {
        if (d.profile?.role && d.profile.role !== role) {
          router.replace(`/dashboard/${d.profile.role}`);
          return;
        }
        setData(d);
      })
      .catch((err) => setError(err.message));
  }, [role, router]);

  return { data, error };
}
