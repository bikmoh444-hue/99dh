"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";

export function SiteHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <button aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 lg:hidden">
            <Menu size={20} />
          </button>
          <Link href="/" className="whitespace-nowrap text-xl font-black tracking-tight">
            <span className="hidden sm:inline">99 DH Store</span>
            <span className="sm:hidden">99+</span>
          </Link>
          <div className="relative order-last w-full lg:order-none lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-ink" placeholder="Rechercher des produits..." />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
            <Link href="/">Home</Link>
            <Link href="#categories">Categories</Link>
            <Link href="#deals">Deals</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button aria-label="Favoris" className="hidden h-10 w-10 place-items-center rounded-full border border-zinc-200 lg:grid">
              <Heart size={19} />
            </button>
            <button aria-label="Panier" onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
              <ShoppingBag size={19} />
              {count ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-black text-ink">{count}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
