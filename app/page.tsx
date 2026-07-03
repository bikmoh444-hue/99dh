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
import { CategoriesSection } from "@/components/categories-section";
import { getStorefrontData } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale-server";
import { localized, ui } from "@/lib/i18n";

function heroTitleHtml(title: string) {
  if (title.includes("99 DH")) {
    const parts = title.split("99 DH");
    return parts.map((part, i) =>
      i < parts.length - 1
        ? <Fragment key={i}>{part}<span className="inline-flex translate-y-[-3px] rounded-full bg-gold px-2.5 py-1.5 text-2xl sm:px-4 sm:py-2 sm:text-3xl md:translate-y-[-6px] md:text-5xl">99 DH</span></Fragment>
        : part
    );
  }
  return title;
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const labels = ui[locale];
  const { categories, products, testimonials, settings } = await getStorefrontData(locale);
  const heroBadge = localized(settings.hero_badge_text, locale);
  const heroTitle = localized(settings.hero_title, locale);
  const heroSubtitle = localized(settings.hero_subtitle, locale);
  const heroDescription = localized(settings.hero_description, locale);
  const primaryCtaText = localized(settings.hero_cta_primary_text, locale);
  const secondaryCtaText = localized(settings.hero_cta_secondary_text, locale);
  const flash = products.filter((product) => product.is_flash_sale).slice(0, 4);
  const newest = (() => {
    const nonFlash = products.filter((product) => !product.is_flash_sale);
    return nonFlash.length >= 2 ? nonFlash.slice(0, 2) : products.slice(0, Math.min(2, products.length));
  })();
  const best = products.slice(0, 4);
  const end = flash[0]?.flash_sale_end ?? new Date(Date.now() + 8 * 3600000).toISOString();

  return (
    <main className="overflow-hidden bg-white">
      <SiteHeader locale={locale} />
      <section className="mx-auto grid max-w-7xl gap-5 px-3 py-6 sm:gap-8 sm:px-4 sm:py-10 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-3 w-fit rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-black uppercase text-ink sm:mb-5 sm:px-4 sm:py-2 sm:text-xs">{heroBadge}</div>
          <h1 className="max-w-3xl text-[2.45rem] font-black leading-[0.95] tracking-normal text-ink sm:text-5xl md:text-7xl">
            {heroTitleHtml(heroTitle)}
          </h1>
          {heroSubtitle ? <p className="mt-3 text-sm font-bold leading-6 text-zinc-500 sm:mt-4 sm:text-lg">{heroSubtitle}</p> : null}
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:mt-6 sm:text-lg sm:leading-8">{heroDescription}</p>
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-8 sm:flex sm:flex-row sm:gap-3">
            <Link href={settings.hero_cta_primary_link} className="rounded-lg bg-ink px-5 py-3 text-center text-sm font-bold text-white sm:px-6 sm:py-4 sm:text-base">{primaryCtaText}</Link>
            <Link href={settings.hero_cta_secondary_link} className="rounded-lg border border-ink px-5 py-3 text-center text-sm font-bold text-ink sm:px-6 sm:py-4 sm:text-base">{secondaryCtaText}</Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-zinc-100 shadow-soft sm:aspect-[4/3]">
            <Image src={settings.hero_image_url || products[0].image_url} alt="Produits 99 DH Store" fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-contain sm:object-cover" />
          </div>
          <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 p-3 shadow-soft backdrop-blur sm:bottom-5 sm:left-5 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gold sm:h-11 sm:w-11"><Truck size={18} className="sm:h-[22px] sm:w-[22px]" /></div>
              <div>
                <p className="text-sm font-black sm:text-base">{labels.expressDelivery}</p>
                <p className="text-xs text-zinc-500 sm:text-sm">{labels.everywhereMorocco}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-mist">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-7 lg:grid-cols-4 lg:px-8">
          {settings.features?.map((feature) => (
            <div key={feature.title} className="flex items-center gap-2.5 sm:gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white sm:h-11 sm:w-11"><StoreIcon name={feature.icon} className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div>
                <p className="text-sm font-black leading-tight sm:text-base">{localized(feature.title, locale)}</p>
                <p className="text-xs text-zinc-500 sm:text-sm">{localized(feature.subtitle, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CategoriesSection categories={categories} title={labels.exploreCategories} locale={locale} />

      <section id="deals" className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-7 sm:gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 sm:gap-2 sm:text-base"><Zap className="fill-gold text-gold" size={16} /> {labels.todayPrice}</p>
              <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">{labels.flashSales}</h2>
            </div>
            <div className="rounded-full border border-zinc-200 bg-mist px-2 py-1 text-xs text-ink sm:text-base">
              <Countdown end={end} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {flash.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-3 py-8 sm:px-4 sm:py-12 lg:grid-cols-[2fr_1fr] lg:px-8">
        <div>
          <h2 className="mb-4 text-2xl font-black sm:mb-5 sm:text-3xl">{labels.newest}</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {newest.map((product) => (
              <Link href={`/produit/${product.id}`} key={product.id} className="relative min-h-52 overflow-hidden rounded-xl bg-zinc-100 p-4 shadow-sm sm:min-h-72 sm:p-6">
                <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-white sm:p-6">
                  <PriceBadge compact />
                  <h3 className="mt-2 line-clamp-2 text-lg font-black sm:mt-3 sm:text-2xl">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-black sm:mb-5 sm:text-3xl">{labels.bestSellers}</h2>
          <div className="space-y-3">
            {best.map((product) => (
              <Link href={`/produit/${product.id}`} key={product.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 sm:p-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:h-16 sm:w-16">
                  <Image src={product.image_url} alt={product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black sm:text-base">{product.name}</p>
                  <PriceBadge compact />
                </div>
              </Link>
            ))}
          </div>
          <Link href="#deals" className="mt-5 block rounded-lg border border-ink px-5 py-3 text-center text-sm font-bold sm:text-base">{labels.discoverAll}</Link>
        </div>
      </section>

      {settings.show_testimonials ? (
        <section className="bg-mist py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-black sm:text-3xl">{labels.testimonials}</h2>
              <p className="mt-2 flex items-center justify-center gap-1 text-sm font-bold sm:text-base"><Star className="fill-gold text-gold" size={18} /> {labels.publishedReviews}</p>
            </div>
            <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                  <div>
                    <p className="text-sm font-black sm:text-base">{item.name}</p>
                    <p className="text-xs text-zinc-500 sm:text-sm">{item.city}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 sm:mt-4 sm:text-base sm:leading-7">"{item.message}"</p>
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
