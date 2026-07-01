import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, RotateCcw, Star, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { ProductBuyBox, ProductGallery } from "@/components/product-detail-actions";
import { PriceBadge } from "@/components/price-badge";
import { getProductData } from "@/lib/data";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product, similar, reviews } = await getProductData(id);
  if (!product) notFound();

  return (
    <main className="pb-20 md:pb-0">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <ProductGallery product={product} />
        <div>
          <div className="text-sm font-bold text-zinc-500">
            <Link href="/">Accueil</Link> / <span>{product.category}</span> / <span className="text-ink">{product.name}</span>
          </div>
          <h1 className="mt-3 text-4xl font-black leading-tight lg:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="fill-gold text-gold" size={18} />
            <span className="font-black">{product.rating}</span>
            <span className="text-zinc-500">({product.reviews_count} avis)</span>
          </div>
          <div className="mt-4"><PriceBadge /></div>
          <p className="mt-4 text-base leading-7 text-zinc-600">{product.description}</p>
          <div className="mt-5">
            <ProductBuyBox product={product} />
          </div>
          <div className="mt-5 grid gap-3 rounded-xl bg-mist p-4 sm:grid-cols-3">
            {[
              [Truck, "Livraison rapide"],
              [CreditCard, "Paiement à la livraison"],
              [RotateCcw, "Retour facile"]
            ].map(([Icon, label]) => (
              <div key={String(label)} className="flex items-center gap-2 font-bold"><Icon className="h-5 w-5" /> {String(label)}</div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-zinc-200 p-5">
            <h2 className="text-xl font-black">Caractéristiques</h2>
            {product.specs.length ? (
              <dl className="mt-3 grid gap-2 text-sm">
                {product.specs.map((spec) => (
                  <div key={`${spec.label}-${spec.value}`} className="flex justify-between gap-4 border-b border-zinc-100 py-2">
                    <dt className="font-bold text-zinc-500">{spec.label}</dt>
                    <dd className="text-right font-black">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : <p className="mt-3 text-zinc-500">Aucune caractéristique renseignée.</p>}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h2 className="text-3xl font-black">Avis clients</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-zinc-200 p-5">
              <div className="flex items-center justify-between">
                <p className="font-black">{review.customer_name}</p>
                <p className="flex items-center gap-1 font-bold"><Star className="fill-gold text-gold" size={16} /> {review.rating}</p>
              </div>
              <p className="mt-3 text-zinc-600">{review.comment}</p>
              <p className="mt-3 text-xs text-zinc-400">{new Date(review.created_at).toLocaleDateString("fr-MA")}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h2 className="text-3xl font-black">Produits similaires</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {similar.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </main>
  );
}
