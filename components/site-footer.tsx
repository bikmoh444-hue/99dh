import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-2xl font-black">99 DH Store</h2>
          <p className="mt-3 text-zinc-300">La boutique marocaine à prix unique pour acheter vite, simplement et sans paiement en ligne.</p>
        </div>
        <div>
          <h3 className="font-black">Aide & Support</h3>
          <div className="mt-3 grid gap-2 text-zinc-300">
            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
            <span>Livraison 24/48h</span>
            <span>Paiement à la livraison</span>
            <span>Retour sous 7 jours</span>
          </div>
        </div>
        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-3 grid gap-3 text-zinc-300">
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
            <div className="mt-5 flex gap-3">
              {settings.instagram_url ? <a href={settings.instagram_url} aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Instagram size={18} /></a> : null}
              {settings.facebook_url ? <a href={settings.facebook_url} aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Facebook size={18} /></a> : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-zinc-400">© 2026 99 DH Store. Tous droits réservés.</div>
    </footer>
  );
}
