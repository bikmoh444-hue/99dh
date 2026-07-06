"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { LanguageToggle } from "@/components/language-toggle";
import { useCart } from "@/components/cart-provider";
import { ui, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale = "ar" }: { locale?: Locale }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const [logoUrl, setLogoUrl] = useState("");
  const t = ui[locale];

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setLogoUrl(data.settings?.logo_url ?? ""))
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-3 py-2 sm:h-16 sm:px-4 sm:py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 lg:hidden">
              <Menu size={18} />
            </button>
            <Link href="/" className="shrink-0">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={48} height={48} className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12" />
              ) : (
                <span className="whitespace-nowrap text-lg font-black tracking-tight sm:text-xl">
                  <span className="hidden sm:inline">199 DH Store</span>
                  <span className="sm:hidden">199+</span>
                </span>
              )}
            </Link>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-bold lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex">
            <Link href="/">{t.home}</Link>
            <Link href="/#categories">{t.categories}</Link>
            <Link href="/#deals">{t.deals}</Link>
            <Link href="/contact">{t.contact}</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <button aria-label="Favoris" className="hidden h-10 w-10 place-items-center rounded-full border border-zinc-200 lg:grid">
              <Heart size={19} />
            </button>
            <button aria-label="Panier" onClick={() => setCartOpen(true)} className="relative grid h-9 w-9 place-items-center rounded-full bg-ink text-white shadow-sm sm:h-10 sm:w-10">
              <ShoppingBag size={17} className="sm:h-[19px] sm:w-[19px]" />
              {count ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-ink sm:h-5 sm:min-w-5 sm:text-xs">{count}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} locale={locale} />
    </>
  );
}
