"use client";

import { useEffect, useState } from "react";

function parts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function Countdown({ end }: { end: string }) {
  const target = new Date(end).getTime();
  const [value, setValue] = useState("00:00:00");

  useEffect(() => {
    setValue(parts(target));
    const interval = window.setInterval(() => setValue(parts(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return <span className="rounded-full px-3 py-1 font-mono text-sm font-bold text-ink">{value}</span>;
}
