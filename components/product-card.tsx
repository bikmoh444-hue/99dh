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
    <article className="group rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/produit/${product.id}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
        <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <PriceBadge compact />
        </div>
        <button aria-label="Ajouter aux favoris" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-sm md:hidden">
          <Heart size={18} />
        </button>
      </div>
      <div className="space-y-2 px-1 pt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{product.category}</p>
        <h3 className="min-h-11 text-sm font-black leading-snug text-ink md:text-base">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <Star size={14} className="fill-gold text-gold" />
          <span className="font-bold text-ink">{product.rating}</span>
          <span>({product.reviews_count} avis)</span>
        </div>
      </div>
      </Link>
      <div className="px-1 pt-2">
        <button onClick={() => addItem(product)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 py-3 text-sm font-bold text-white">
          <ShoppingBag size={17} />
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
