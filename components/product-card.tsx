"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { PriceBadge } from "@/components/price-badge";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft sm:p-3">
      <Link href={`/produit/${product.id}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
        <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
          <PriceBadge compact />
        </div>
        <button aria-label="Ajouter aux favoris" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-sm md:hidden">
          <Heart size={16} />
        </button>
      </div>
      <div className="space-y-1.5 px-0.5 pt-2 sm:space-y-2 sm:px-1 sm:pt-3">
        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-zinc-500 sm:text-xs">{product.category}</p>
        <h3 className="line-clamp-2 min-h-9 text-xs font-black leading-snug text-ink sm:min-h-11 sm:text-sm md:text-base">{product.name}</h3>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 sm:text-xs">
          <Star size={12} className="fill-gold text-gold sm:h-3.5 sm:w-3.5" />
          <span className="font-bold text-ink">{product.rating}</span>
          <span className="truncate">({product.reviews_count})</span>
        </div>
      </div>
      </Link>
      <div className="px-0.5 pt-2 sm:px-1">
        <button onClick={() => addItem(product)} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-2 py-2.5 text-[11px] font-bold text-white sm:gap-2 sm:px-3 sm:py-3 sm:text-sm">
          <ShoppingBag size={14} className="sm:h-[17px] sm:w-[17px]" />
          <span className="truncate">Ajouter</span>
        </button>
      </div>
    </article>
  );
}
