import { Facebook, Instagram, Mail, Send } from "lucide-react";
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
            <a>About Us</a><a>Shipping Policy</a><a>Contact Support</a><a>Terms of Service</a>
          </div>
        </div>
        <div>
          <h3 className="font-black">Newsletter</h3>
          <div className="mt-3 flex overflow-hidden rounded-lg bg-white">
            <input placeholder="Email" className="min-w-0 flex-1 px-4 text-ink outline-none" />
            <button aria-label="Envoyer" className="bg-gold px-4 text-ink"><Send size={18} /></button>
          </div>
          {settings.contact_email ? <div className="mt-5 flex gap-3 text-zinc-300"><Mail size={18} /> {settings.contact_email}</div> : null}
          <div className="mt-4 flex gap-3">
            {settings.instagram_url ? <a href={settings.instagram_url} aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Instagram size={18} /></a> : null}
            {settings.facebook_url ? <a href={settings.facebook_url} aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Facebook size={18} /></a> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-zinc-400">© 2026 99 DH Store. Tous droits réservés.</div>
    </footer>
  );
}
