"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import type { FeatureItem, SiteSettings } from "@/lib/types";

const iconOptions = [
  "Smartphone", "Home", "Sparkles", "Shirt", "Utensils", "Zap", "Watch",
  "Heart", "PackageCheck", "Search", "ShieldCheck", "ShoppingBag", "Truck",
  "CreditCard", "LockKeyhole"
];

const tabs = [
  { id: "general", label: "Général" },
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "social", label: "Réseaux sociaux" }
] as const;

type TabId = typeof tabs[number]["id"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((res) => res.json()).then((data) => {
      setSettings(data.settings);
      setFeatures(data.settings?.features ?? []);
      setHeroImageUrl(data.settings?.hero_image_url ?? "");
      setLogoUrl(data.settings?.logo_url ?? "");
    });
  }, []);

  function updateFeature(index: number, field: keyof FeatureItem, value: string) {
    setFeatures((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function submit() {
    if (!settings) return;
    const form = document.forms.namedItem("settings-form") as HTMLFormElement;
    const data = new FormData(form);
    const payload = {
      logo_url: logoUrl,
      shipping_fee: Number(data.get("shipping_fee") ?? 0),
      whatsapp_number: String(data.get("whatsapp_number") ?? ""),
      phone_number: String(data.get("phone_number") ?? ""),
      contact_email: String(data.get("contact_email") ?? ""),
      instagram_url: String(data.get("instagram_url") ?? ""),
      facebook_url: String(data.get("facebook_url") ?? ""),
      whatsapp_message: String(data.get("whatsapp_message") ?? ""),
      show_testimonials: data.get("show_testimonials") === "on",
      hero_badge_text: String(data.get("hero_badge_text") ?? ""),
      hero_title: String(data.get("hero_title") ?? ""),
      hero_subtitle: String(data.get("hero_subtitle") ?? ""),
      hero_description: String(data.get("hero_description") ?? ""),
      hero_image_url: heroImageUrl,
      hero_cta_primary_text: String(data.get("hero_cta_primary_text") ?? ""),
      hero_cta_primary_link: String(data.get("hero_cta_primary_link") ?? ""),
      hero_cta_secondary_text: String(data.get("hero_cta_secondary_text") ?? ""),
      hero_cta_secondary_link: String(data.get("hero_cta_secondary_link") ?? ""),
      features
    };
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setSettings(result.settings);
    setFeatures(result.settings?.features ?? []);
    setHeroImageUrl(result.settings?.hero_image_url ?? "");
    setLogoUrl(result.settings?.logo_url ?? "");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
          <h1 className="text-2xl font-black">Paramètres du store</h1>
        </div>
      </header>

      {settings ? (
        <section className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-5 py-3 text-sm font-bold transition ${
                  activeTab === tab.id ? "bg-ink text-white" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form id="settings-form" name="settings-form" onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid gap-6">
            {activeTab === "general" ? (
              <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">Général</h2>
                <label className="grid gap-2 font-bold">Frais de livraison (DH)
                  <input name="shipping_fee" type="number" defaultValue={settings.shipping_fee} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Email contact
                  <input name="contact_email" type="email" defaultValue={settings.contact_email} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Logo du store
                  <ImageUpload value={logoUrl} onChange={setLogoUrl} />
                </label>
                <label className="flex items-center gap-3 font-bold">
                  <input name="show_testimonials" type="checkbox" defaultChecked={settings.show_testimonials} className="h-5 w-5" />
                  Afficher la section témoignages
                </label>
              </div>
            ) : null}

            {activeTab === "hero" ? (
              <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">Section Hero (accueil)</h2>
                <label className="grid gap-2 font-bold">Badge
                  <input name="hero_badge_text" defaultValue={settings.hero_badge_text} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Titre
                  <input name="hero_title" defaultValue={settings.hero_title} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Sous-titre
                  <input name="hero_subtitle" defaultValue={settings.hero_subtitle} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Description
                  <textarea name="hero_description" defaultValue={settings.hero_description} rows={2} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Image d&apos;arrière-plan
                  <ImageUpload value={heroImageUrl} onChange={setHeroImageUrl} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 font-bold">CTA principal — texte
                    <input name="hero_cta_primary_text" defaultValue={settings.hero_cta_primary_text} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">CTA principal — lien
                    <input name="hero_cta_primary_link" defaultValue={settings.hero_cta_primary_link} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">CTA secondaire — texte
                    <input name="hero_cta_secondary_text" defaultValue={settings.hero_cta_secondary_text} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">CTA secondaire — lien
                    <input name="hero_cta_secondary_link" defaultValue={settings.hero_cta_secondary_link} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                </div>
              </div>
            ) : null}

            {activeTab === "features" ? (
              <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">Barre de confiance (features)</h2>
                <p className="text-sm text-zinc-500">4 éléments affichés sous le hero sur la page d&apos;accueil.</p>
                {features.map((feature, index) => (
                  <div key={index} className="rounded-lg border border-zinc-200 p-4">
                    <p className="mb-3 font-bold">Élément {index + 1}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="grid gap-1 text-sm font-bold">Icône
                        <select value={feature.icon} onChange={(e) => updateFeature(index, "icon", e.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink">
                          {iconOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm font-bold">Titre
                        <input value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                      </label>
                      <label className="grid gap-1 text-sm font-bold">Sous-titre
                        <input value={feature.subtitle} onChange={(e) => updateFeature(index, "subtitle", e.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "social" ? (
              <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">Réseaux sociaux & contact</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 font-bold">Numéro WhatsApp
                    <input name="whatsapp_number" defaultValue={settings.whatsapp_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">Téléphone
                    <input name="phone_number" defaultValue={settings.phone_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">Instagram
                    <input name="instagram_url" defaultValue={settings.instagram_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                  <label className="grid gap-2 font-bold">Facebook
                    <input name="facebook_url" defaultValue={settings.facebook_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                  </label>
                </div>
                <label className="grid gap-2 font-bold">Message WhatsApp par défaut
                  <textarea name="whatsapp_message" defaultValue={settings.whatsapp_message} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
              </div>
            ) : null}

            {saved ? <p className="rounded-lg bg-green-50 p-3 font-bold text-green-700">Paramètres enregistrés.</p> : null}
            <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white"><Save size={18} /> Enregistrer</button>
          </form>
        </section>
      ) : <section className="mx-auto max-w-4xl px-4 py-8"><p>Chargement...</p></section>}
    </main>
  );
}
