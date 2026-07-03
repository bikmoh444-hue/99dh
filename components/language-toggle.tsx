"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

function readLocale(): Locale {
  if (typeof document === "undefined") return "ar";
  return document.cookie.split("; ").find((row) => row.startsWith("locale="))?.split("=")[1] === "fr" ? "fr" : "ar";
}

export function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    setLocale(readLocale());
  }, []);

  function changeLocale(next: Locale) {
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(next);
    window.location.reload();
  }

  return (
    <div className="flex rounded-full border border-zinc-200 bg-white p-0.5 text-[10px] font-black sm:p-1 sm:text-xs">
      <button
        type="button"
        onClick={() => changeLocale("ar")}
        className={`h-7 rounded-full px-2 sm:h-8 sm:px-3 ${locale === "ar" ? "bg-ink text-white" : "text-ink"}`}
      >
        AR
      </button>
      <button
        type="button"
        onClick={() => changeLocale("fr")}
        className={`h-7 rounded-full px-2 sm:h-8 sm:px-3 ${locale === "fr" ? "bg-ink text-white" : "text-ink"}`}
      >
        FR
      </button>
    </div>
  );
}
