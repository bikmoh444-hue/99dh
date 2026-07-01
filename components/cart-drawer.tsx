"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, count, increment, decrement, removeItem } = useCart();

  return (
    <div className={open ? "fixed inset-0 z-50" : "pointer-events-none fixed inset-0 z-50"}>
      <button aria-label="Fermer le panier" onClick={onClose} className={open ? "absolute inset-0 bg-black/35" : "absolute inset-0 bg-black/0"} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-zinc-200 p-5">
          <div>
            <h2 className="text-xl font-black">Panier</h2>
            <p className="text-sm text-zinc-500">{count} article(s)</p>
          </div>
          <button aria-label="Fermer" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200">
            <X size={19} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {lines.length === 0 ? (
            <p className="rounded-xl bg-zinc-50 p-5 text-center text-sm text-zinc-600">Votre panier est vide.</p>
          ) : (
            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.product.id} className="grid grid-cols-[76px_1fr] gap-3 rounded-xl border border-zinc-200 p-3">
                  <div className="relative h-20 overflow-hidden rounded-lg bg-zinc-100">
                    <Image src={line.product.image_url} alt={line.product.name} fill sizes="76px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-black leading-snug">{line.product.name}</h3>
                      <button aria-label="Supprimer" onClick={() => removeItem(line.product.id)} className="text-zinc-400 hover:text-red-600">
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold">{formatPrice(line.product.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-zinc-200">
                        <button aria-label="Diminuer" onClick={() => decrement(line.product.id)} className="grid h-8 w-8 place-items-center">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{line.quantity}</span>
                        <button aria-label="Augmenter" onClick={() => increment(line.product.id)} className="grid h-8 w-8 place-items-center">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-black">{formatPrice(line.quantity * line.product.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-zinc-200 p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link onClick={onClose} href="/checkout" className={`block rounded-lg px-4 py-3 text-center font-bold text-white ${lines.length ? "bg-ink" : "pointer-events-none bg-zinc-300"}`}>
            Passer la commande
          </Link>
        </div>
      </aside>
    </div>
  );
}
