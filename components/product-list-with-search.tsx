"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ui } from "@/lib/i18n";
import type { Product } from "@/lib/types";

type Labels = typeof ui.ar;

export function ProductListWithSearch({ products, categoryName, labels = ui.ar }: { products: Product[]; categoryName?: string; labels?: Labels }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : products;

  return (
    <>
      <div className="relative mb-6 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-ink"
          placeholder={labels.searchProducts}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">
            {query.trim() ? <>{labels.resultsFor} &quot;{query}&quot;</> : categoryName ?? labels.allProducts}
          </h1>
          <p className="mt-1 text-zinc-500">
            {filtered.length} {filtered.length > 1 ? labels.productsFound : labels.productFound}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryName ? (
            <Link
              href="/produits"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-3 text-sm font-bold"
            >
              <SlidersHorizontal size={16} /> {labels.allProducts}
            </Link>
          ) : null}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-3 text-sm font-bold"
          >
            {labels.backHome}
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-zinc-50 p-16 text-center">
          <Search size={40} className="mx-auto text-zinc-300" />
          <p className="mt-4 text-xl font-black text-zinc-500">{labels.noResults}</p>
          <p className="mt-2 text-zinc-400">{labels.tryAnotherSearch}</p>
          <button
            onClick={() => setQuery("")}
            className="mt-6 inline-block rounded-lg bg-ink px-6 py-3 font-bold text-white"
          >
            {labels.allProducts}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
