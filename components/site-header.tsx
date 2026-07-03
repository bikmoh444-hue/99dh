"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";

export function SiteHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setLogoUrl(data.settings?.logo_url ?? ""))
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <button aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 lg:hidden">
              <Menu size={20} />
            </button>
            <Link href="/" className="shrink-0">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="whitespace-nowrap text-xl font-black tracking-tight">
                  <span className="hidden sm:inline">99 DH Store</span>
                  <span className="sm:hidden">99+</span>
                </span>
              )}
            </Link>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-bold lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex">
            <Link href="/">Home</Link>
            <Link href="/#categories">Categories</Link>
            <Link href="/#deals">Deals</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
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
