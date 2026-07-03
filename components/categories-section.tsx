"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StoreIcon } from "@/components/icon";
import type { Category } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export function CategoriesSection({ categories, title, locale = "fr" }: { categories: Category[]; title: string; locale?: Locale }) {
  const [expanded, setExpanded] = useState(false);
  const visibleCategories = expanded ? categories : categories.slice(0, 3);
  const hasMore = categories.length > 3;

  return (
    <section id="categories" className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10 lg:px-8 lg:py-12">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-2xl font-black leading-tight text-ink sm:text-3xl">{title}</h2>
        {hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-black text-ink shadow-sm transition hover:border-gold hover:text-gold sm:hidden"
          >
            {expanded ? (locale === "ar" ? "أقل" : "Voir moins") : (locale === "ar" ? "عرض الكل" : "Voir tout")}
            <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:mt-7 sm:gap-4 md:hidden">
        {(hasMore ? visibleCategories : categories).map((category) => (
          <Link
            key={category.id}
            href={`/produits?category=${encodeURIComponent(category.id)}`}
            className="group min-w-0 rounded-xl border border-zinc-200 bg-white p-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:shadow-soft sm:p-4"
          >
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gold transition group-hover:scale-105 sm:h-14 sm:w-14">
              <StoreIcon name={category.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <p className="mt-2 line-clamp-2 min-h-8 text-[11px] font-black leading-4 text-ink sm:mt-3 sm:text-sm">{category.name}</p>
          </Link>
        ))}
      </div>

      {hasMore ? (
        <div className="mt-4 hidden justify-center sm:flex md:hidden">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-ink shadow-sm transition hover:border-gold hover:text-gold"
          >
            {expanded ? (locale === "ar" ? "أقل" : "Voir moins") : (locale === "ar" ? "عرض الكل" : "Voir tout")}
            <ChevronDown size={15} className={`transition ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      ) : null}

      <div className="mt-7 hidden gap-4 md:grid md:grid-cols-7">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/produits?category=${encodeURIComponent(category.id)}`}
            className="group min-w-0 rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-gold hover:shadow-soft"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold transition group-hover:scale-105">
              <StoreIcon name={category.icon} className="h-6 w-6" />
            </div>
            <p className="mt-3 line-clamp-2 min-h-10 text-sm font-black leading-5 text-ink">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
