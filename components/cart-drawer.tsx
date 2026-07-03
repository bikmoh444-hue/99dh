"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { ui, type Locale } from "@/lib/i18n";

export function CartDrawer({ open, onClose, locale = "ar" }: { open: boolean; onClose: () => void; locale?: Locale }) {
  const { lines, total, count, increment, decrement, removeItem } = useCart();
  const ar = locale === "ar";
  const t = ui[locale];

  return (
    <div className={open ? "fixed inset-0 z-50" : "pointer-events-none fixed inset-0 z-50"}>
      <button aria-label="Fermer le panier" onClick={onClose} className={open ? "absolute inset-0 bg-black/35" : "absolute inset-0 bg-black/0"} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-black sm:text-xl">{ar ? "السلة" : "Panier"}</h2>
            <p className="text-xs text-zinc-500 sm:text-sm">{count} {ar ? "منتج" : "article(s)"}</p>
          </div>
          <button aria-label="Fermer" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 sm:h-10 sm:w-10">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-3 sm:p-5">
          {lines.length === 0 ? (
            <p className="rounded-xl bg-zinc-50 p-4 text-center text-sm text-zinc-600">{ar ? "السلة فارغة." : "Votre panier est vide."}</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {lines.map((line) => (
                <div key={line.product.id} className="grid grid-cols-[64px_1fr] gap-3 rounded-xl border border-zinc-200 p-2.5 sm:grid-cols-[76px_1fr] sm:p-3">
                  <div className="relative h-16 overflow-hidden rounded-lg bg-zinc-100 sm:h-20">
                    <Image src={line.product.image_url} alt={line.product.name} fill sizes="76px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-xs font-black leading-snug sm:text-sm">{line.product.name}</h3>
                      <button aria-label="Supprimer" onClick={() => removeItem(line.product.id)} className="text-zinc-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="mt-1 text-xs font-bold sm:text-sm">{formatPrice(line.product.price)}</p>
                    <div className="mt-2 flex items-center justify-between sm:mt-3">
                      <div className="flex items-center rounded-full border border-zinc-200">
                        <button aria-label="Diminuer" onClick={() => decrement(line.product.id)} className="grid h-7 w-7 place-items-center sm:h-8 sm:w-8">
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold sm:w-8 sm:text-sm">{line.quantity}</span>
                        <button aria-label="Augmenter" onClick={() => increment(line.product.id)} className="grid h-7 w-7 place-items-center sm:h-8 sm:w-8">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-xs font-black sm:text-sm">{formatPrice(line.quantity * line.product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-zinc-200 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-base font-black sm:mb-4 sm:text-lg">
            <span>{t.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link onClick={onClose} href="/checkout" className={`block rounded-lg px-4 py-3 text-center text-sm font-bold text-white sm:text-base ${lines.length ? "bg-ink" : "pointer-events-none bg-zinc-300"}`}>
            {t.checkout}
          </Link>
        </div>
      </aside>
    </div>
  );
}
