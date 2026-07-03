"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";
import { PriceBadge } from "@/components/price-badge";
import { ui, type Locale } from "@/lib/i18n";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.image_url];
  const [active, setActive] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-square max-h-[500px] overflow-hidden rounded-xl bg-zinc-100 shadow-sm lg:aspect-[5/4]">
        <Image src={active} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        <div className="absolute left-4 top-4"><PriceBadge /></div>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
        {images.map((image) => (
          <button key={image} onClick={() => setActive(image)} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border ${active === image ? "border-ink" : "border-zinc-200"}`}>
            <Image src={image} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductBuyBox({ product, locale = "ar" }: { product: Product; locale?: Locale }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const t = ui[locale];

  function addMany() {
    Array.from({ length: quantity }).forEach(() => addItem(product));
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button aria-label="Diminuer" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200"><Minus size={17} /></button>
        <span className="w-10 text-center text-lg font-black">{quantity}</span>
        <button aria-label="Augmenter" onClick={() => setQuantity((value) => value + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200"><Plus size={17} /></button>
      </div>
      <button onClick={addMany} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 font-bold text-white">
        <ShoppingBag size={19} /> {t.addToCart}
      </button>
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink px-5 py-4 font-bold">
        <Heart size={19} /> {locale === "ar" ? "أضف للمفضلة" : "Ajouter aux favoris"}
      </button>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white p-3 md:hidden">
        <button onClick={addMany} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 font-bold text-white">
          <ShoppingBag size={19} /> {t.addToCart}
        </button>
      </div>
    </>
  );
}
