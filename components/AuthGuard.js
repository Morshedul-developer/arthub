"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { api } from "../lib/api";

export default function AuthGuard({ role, children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/login?redirect=/dashboard/${role}`);
      return;
    }

    let cancelled = false;
    api("/profile/me")
      .then((profile) => {
        if (cancelled) return;
        if (profile.role !== role) router.replace("/unauthorized");
        else setChecked(true);
      })
      .catch(() => {
        if (!cancelled) router.replace(`/login?redirect=/dashboard/${role}`);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user, role, router]);

  if (isPending || !checked) {
    return <div className="card h-64 animate-pulse" />;
  }

  return children;
}
