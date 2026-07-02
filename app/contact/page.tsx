import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-ink"><ArrowLeft size={16} /> Retour à l&apos;accueil</Link>
        <h1 className="text-4xl font-black">Contactez-nous</h1>
        <p className="mt-3 text-zinc-500">Une question ? Une suggestion ? Envoyez-nous un message.</p>
        <ContactForm />
      </section>
      <SiteFooter />
    </main>
  );
}
