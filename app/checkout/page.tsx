"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export default function CheckoutPage() {
  const { lines, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const shippingFee = settings ? Number(settings.shipping_fee) : 0;
  const grandTotal = total + shippingFee;

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      customer: {
        full_name: String(form.get("full_name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") ?? ""),
        address: String(form.get("address") ?? "")
      },
      items: lines.map((line) => ({
        product_id: line.product.id,
        product_name: line.product.name,
        quantity: line.quantity,
        unit_price: line.product.price,
        subtotal: line.quantity * line.product.price
      })),
      subtotal: total,
      shipping_fee: shippingFee,
      total_amount: grandTotal,
      total: grandTotal
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "Impossible de confirmer la commande.");
      return;
    }
    clearCart();
    router.push(`/confirmation?order=${result.order_number}`);
  }

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h1 className="text-4xl font-black">Confirmer la commande</h1>
          <p className="mt-2 text-zinc-600">Paiement à la livraison. Aucun paiement en ligne n'est demandé.</p>
          <form onSubmit={submit} className="mt-8 grid gap-4 rounded-xl border border-zinc-200 p-5 shadow-sm">
            <label className="grid gap-2 font-bold">Nom complet<input required name="full_name" className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" /></label>
            <label className="grid gap-2 font-bold">Numéro de téléphone<input required name="phone" className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" /></label>
            <label className="grid gap-2 font-bold">Ville<input required name="city" className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" /></label>
            <label className="grid gap-2 font-bold">Adresse complète<textarea required name="address" rows={4} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" /></label>
            {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
            <button disabled={loading || !lines.length || !settings} className="flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 font-bold text-white disabled:bg-zinc-300">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Confirmer la commande
            </button>
          </form>
        </div>
        <aside className="h-fit rounded-xl bg-mist p-5">
          <h2 className="text-xl font-black">Récapitulatif</h2>
          <div className="mt-5 space-y-4">
            {lines.length ? lines.map((line) => (
              <div key={line.product.id} className="flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-100">
                  <Image src={line.product.image_url} alt={line.product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black">{line.product.name}</p>
                  <p className="text-sm text-zinc-500">Qté {line.quantity}</p>
                </div>
                <p className="font-black">{formatPrice(line.quantity * line.product.price)}</p>
              </div>
            )) : <p className="text-zinc-600">Votre panier est vide. <Link href="/" className="font-bold underline">Retour boutique</Link></p>}
          </div>
          <div className="mt-5 border-t border-zinc-300 pt-5">
            <div className="flex justify-between text-sm font-bold text-zinc-600"><span>Sous-total</span><span>{formatPrice(total)}</span></div>
            <div className="mt-2 flex justify-between text-sm font-bold text-zinc-600"><span>Livraison</span><span>{settings ? formatPrice(shippingFee) : "..."}</span></div>
            <div className="mt-3 flex justify-between text-lg font-black"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
