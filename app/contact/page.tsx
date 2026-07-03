import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import ContactForm from "@/components/contact-form";
import { getRequestLocale } from "@/lib/locale-server";

export default async function ContactPage() {
  const locale = await getRequestLocale();

  return (
    <main className="bg-white">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-ink">
          <ArrowLeft size={16} /> {locale === "ar" ? "العودة للرئيسية" : "Retour a l'accueil"}
        </Link>
        <h1 className="text-4xl font-black">{locale === "ar" ? "تواصل معنا" : "Contactez-nous"}</h1>
        <p className="mt-3 text-zinc-500">
          {locale === "ar" ? "عندك سؤال أو اقتراح؟ راسلنا من هنا." : "Une question ? Une suggestion ? Envoyez-nous un message."}
        </p>
        <ContactForm locale={locale} />
      </section>
      <SiteFooter />
    </main>
  );
}
