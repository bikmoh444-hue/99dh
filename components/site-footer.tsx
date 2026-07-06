import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-8 text-sm sm:px-4 sm:py-12 sm:text-base md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-black sm:text-2xl">199 DH Store</h2>
          <p className="mt-2 leading-6 text-zinc-300 sm:mt-3">
            La boutique marocaine a prix unique pour acheter vite, simplement et sans paiement en ligne.
          </p>
        </div>
        <div>
          <h3 className="font-black">Aide & Support</h3>
          <div className="mt-2 grid gap-1.5 text-zinc-300 sm:mt-3 sm:gap-2">
            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
            <span>Livraison 24/48h</span>
            <span>Paiement a la livraison</span>
            <span>Retour sous 7 jours</span>
          </div>
        </div>
        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-2 grid gap-2 text-zinc-300 sm:mt-3 sm:gap-3">
            {settings.phone_number ? (
              <div className="flex items-center gap-3"><Phone size={16} /> {settings.phone_number}</div>
            ) : null}
            {settings.contact_email ? (
              <div className="flex items-center gap-3"><Mail size={16} /> {settings.contact_email}</div>
            ) : null}
            {settings.whatsapp_number ? (
              <div className="flex items-center gap-3"><MessageCircle size={16} /> {settings.whatsapp_number}</div>
            ) : null}
            <Link href="/contact" className="flex items-center gap-3 font-bold text-gold hover:text-white">
              Nous contacter →
            </Link>
          </div>
          {settings.instagram_url || settings.facebook_url ? (
            <div className="mt-4 flex gap-2.5 sm:mt-5 sm:gap-3">
              {settings.instagram_url ? <a href={settings.instagram_url} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink sm:h-10 sm:w-10"><Instagram size={17} /></a> : null}
              {settings.facebook_url ? <a href={settings.facebook_url} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink sm:h-10 sm:w-10"><Facebook size={17} /></a> : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 px-3 py-4 text-center text-xs text-zinc-400 sm:py-5 sm:text-sm">
        © 2026 199 DH Store. Tous droits reserves.
      </div>
    </footer>
  );
}
