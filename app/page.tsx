import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Star, Truck, Zap } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { StoreIcon } from "@/components/icon";
import { PriceBadge } from "@/components/price-badge";
import { SiteFooter } from "@/components/site-footer";
import { getStorefrontData } from "@/lib/data";

function heroTitleHtml(title: string) {
  if (title.includes("99 DH")) {
    const parts = title.split("99 DH");
    return parts.map((part, i) =>
      i < parts.length - 1
        ? <Fragment key={i}>{part}<span className="inline-flex translate-y-[-6px] rounded-full bg-gold px-4 py-2 text-3xl md:text-5xl">99 DH</span></Fragment>
        : part
    );
  }
  return title;
}

export default async function HomePage() {
  const { categories, products, testimonials, settings } = await getStorefrontData();
  const flash = products.filter((product) => product.is_flash_sale).slice(0, 4);
  const newest = (() => {
    const nonFlash = products.filter(p => !p.is_flash_sale);
    return nonFlash.length >= 2 ? nonFlash.slice(0, 2) : products.slice(0, Math.min(2, products.length));
  })();
  const best = products.slice(0, 4);
  const end = flash[0]?.flash_sale_end ?? new Date(Date.now() + 8 * 3600000).toISOString();

  return (
    <main className="bg-white">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 w-fit rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase text-ink">{settings.hero_badge_text}</div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-ink md:text-7xl">
            {heroTitleHtml(settings.hero_title)}
          </h1>
          {settings.hero_subtitle ? <p className="mt-4 text-lg font-bold text-zinc-500">{settings.hero_subtitle}</p> : null}
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">{settings.hero_description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={settings.hero_cta_primary_link} className="rounded-lg bg-ink px-6 py-4 text-center font-bold text-white">{settings.hero_cta_primary_text}</Link>
            <Link href={settings.hero_cta_secondary_link} className="rounded-lg border border-ink px-6 py-4 text-center font-bold text-ink">{settings.hero_cta_secondary_text}</Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 shadow-soft">
            <Image src={settings.hero_image_url || products[0].image_url} alt="Produits 99 DH Store" fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
          <div className="absolute bottom-5 left-5 rounded-xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold"><Truck size={22} /></div>
              <div>
                <p className="font-black">Livraison Express</p>
                <p className="text-sm text-zinc-500">Partout au Maroc</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-mist">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 lg:grid-cols-4 lg:px-8">
          {settings.features?.map((feature) => (
            <div key={feature.title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white"><StoreIcon name={feature.icon} className="h-5 w-5" /></div>
              <div>
                <p className="font-black">{feature.title}</p>
                <p className="text-sm text-zinc-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="text-3xl font-black">Explorer nos catégories</h2>
        <div className="mt-7 grid grid-cols-3 gap-4 md:grid-cols-7">
          {categories.map((category) => (
            <Link key={category.id} href={`/produits?category=${encodeURIComponent(category.id)}`} className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold">
                <StoreIcon name={category.icon} className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-black">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="deals" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-bold text-zinc-600"><Zap className="fill-gold text-gold" size={18} /> Prix unique aujourd'hui</p>
              <h2 className="mt-1 text-3xl font-black text-ink">Ventes Flash</h2>
            </div>
            <div className="rounded-full border border-zinc-200 bg-mist px-2 py-1 text-ink">
              <Countdown end={end} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {flash.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div>
          <h2 className="mb-5 text-3xl font-black">Nouveautés</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {newest.map((product) => (
              <Link href={`/produit/${product.id}`} key={product.id} className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-100 p-6 shadow-sm">
                <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 text-white">
                  <PriceBadge compact />
                  <h3 className="mt-3 text-2xl font-black">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-3xl font-black">Meilleures ventes</h2>
          <div className="space-y-3">
            {best.map((product) => (
              <Link href={`/produit/${product.id}`} key={product.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image src={product.image_url} alt={product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{product.name}</p>
                  <PriceBadge compact />
                </div>
              </Link>
            ))}
          </div>
          <Link href="#deals" className="mt-5 block rounded-lg border border-ink px-5 py-3 text-center font-bold">Découvrir tout</Link>
        </div>
      </section>

      {settings.show_testimonials ? (
        <section className="bg-mist py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-black">Témoignages clients</h2>
              <p className="mt-2 flex items-center justify-center gap-1 font-bold"><Star className="fill-gold text-gold" size={18} /> Avis clients publiés</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.city}</p>
                  </div>
                  <p className="mt-4 leading-7 text-zinc-600">"{item.message}"</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
