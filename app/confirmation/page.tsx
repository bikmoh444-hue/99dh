import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-12 text-center">
        <div>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-5 text-4xl font-black">Commande confirmée</h1>
          <p className="mt-3 text-lg text-zinc-600">Votre commande #{params.order ?? "demo"} a été reçue. Notre équipe vous contactera pour confirmer la livraison.</p>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-ink px-6 py-4 font-bold text-white">Retour à la boutique</Link>
        </div>
      </section>
    </main>
  );
}
