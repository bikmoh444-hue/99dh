"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import type { FeatureItem, SiteSettings } from "@/lib/types";
import { localizedValue, translatable } from "@/lib/i18n";

const iconOptions = [
  "Smartphone", "Home", "Sparkles", "Shirt", "Utensils", "Zap", "Watch",
  "Heart", "PackageCheck", "Search", "ShieldCheck", "ShoppingBag", "Truck",
  "CreditCard", "LockKeyhole"
];

const tabs = [
  { id: "general", label: "General" },
  { id: "hero", label: "Hero AR/FR" },
  { id: "features", label: "Features AR/FR" },
  { id: "social", label: "Contact" }
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

  function updateFeatureText(index: number, field: "title" | "subtitle", lang: "ar" | "fr", value: string) {
    setFeatures((current) => current.map((item, i) => {
      if (i !== index) return item;
      const currentValue = localizedValue(item[field]);
      return { ...item, [field]: translatable(lang === "ar" ? value : currentValue.ar, lang === "fr" ? value : currentValue.fr) };
    }));
  }

  async function submit() {
    if (!settings) return;
    const form = document.forms.namedItem("settings-form") as HTMLFormElement;
    const data = new FormData(form);
    const field = (name: string, fallback: string) => data.has(name) ? String(data.get(name) ?? "") : fallback;
    const localizedField = (baseName: string, fallback: string) => {
      const current = localizedValue(fallback);
      return translatable(field(`${baseName}_ar`, current.ar), field(`${baseName}_fr`, current.fr));
    };
    const payload = {
      logo_url: logoUrl,
      shipping_fee: Number(field("shipping_fee", String(settings.shipping_fee))),
      whatsapp_number: field("whatsapp_number", settings.whatsapp_number),
      phone_number: field("phone_number", settings.phone_number),
      contact_email: field("contact_email", settings.contact_email),
      instagram_url: field("instagram_url", settings.instagram_url),
      facebook_url: field("facebook_url", settings.facebook_url),
      whatsapp_message: localizedField("whatsapp_message", settings.whatsapp_message),
      show_testimonials: data.has("show_testimonials") ? data.get("show_testimonials") === "on" : settings.show_testimonials,
      hero_badge_text: localizedField("hero_badge_text", settings.hero_badge_text),
      hero_title: localizedField("hero_title", settings.hero_title),
      hero_subtitle: localizedField("hero_subtitle", settings.hero_subtitle),
      hero_description: localizedField("hero_description", settings.hero_description),
      hero_image_url: heroImageUrl,
      hero_cta_primary_text: localizedField("hero_cta_primary_text", settings.hero_cta_primary_text),
      hero_cta_primary_link: field("hero_cta_primary_link", settings.hero_cta_primary_link),
      hero_cta_secondary_text: localizedField("hero_cta_secondary_text", settings.hero_cta_secondary_text),
      hero_cta_secondary_link: field("hero_cta_secondary_link", settings.hero_cta_secondary_link),
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

  if (!settings) {
    return <main className="min-h-screen bg-zinc-50"><section className="mx-auto max-w-4xl px-4 py-8"><p>Chargement...</p></section></main>;
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
          <h1 className="text-2xl font-black">Parametres du store</h1>
        </div>
      </header>

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

        <form id="settings-form" name="settings-form" onSubmit={(event) => { event.preventDefault(); submit(); }} className="grid gap-6">
          {activeTab === "general" ? (
            <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">General</h2>
              <label className="grid gap-2 font-bold">Frais de livraison (DH)
                <input name="shipping_fee" type="number" defaultValue={settings.shipping_fee} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
              </label>
              <label className="grid gap-2 font-bold">Email contact
                <input name="contact_email" type="email" defaultValue={settings.contact_email} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
              </label>
              <label className="grid gap-2 font-bold">Logo + favicon du site
                <ImageUpload value={logoUrl} onChange={setLogoUrl} />
              </label>
              <label className="flex items-center gap-3 font-bold">
                <input name="show_testimonials" type="checkbox" defaultChecked={settings.show_testimonials} className="h-5 w-5" />
                Afficher les temoignages
              </label>
            </div>
          ) : null}

          {activeTab === "hero" ? (
            <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">Hero content</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 font-bold">Badge AR
                  <input name="hero_badge_text_ar" dir="rtl" defaultValue={localizedValue(settings.hero_badge_text).ar} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Badge FR
                  <input name="hero_badge_text_fr" defaultValue={localizedValue(settings.hero_badge_text).fr} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Titre AR
                  <input name="hero_title_ar" dir="rtl" defaultValue={localizedValue(settings.hero_title).ar} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Titre FR
                  <input name="hero_title_fr" defaultValue={localizedValue(settings.hero_title).fr} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Sous-titre AR
                  <input name="hero_subtitle_ar" dir="rtl" defaultValue={localizedValue(settings.hero_subtitle).ar} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Sous-titre FR
                  <input name="hero_subtitle_fr" defaultValue={localizedValue(settings.hero_subtitle).fr} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold sm:col-span-2">Description AR
                  <textarea name="hero_description_ar" dir="rtl" defaultValue={localizedValue(settings.hero_description).ar} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold sm:col-span-2">Description FR
                  <textarea name="hero_description_fr" defaultValue={localizedValue(settings.hero_description).fr} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold sm:col-span-2">Image hero
                  <ImageUpload value={heroImageUrl} onChange={setHeroImageUrl} />
                </label>
                <label className="grid gap-2 font-bold">CTA principal AR
                  <input name="hero_cta_primary_text_ar" dir="rtl" defaultValue={localizedValue(settings.hero_cta_primary_text).ar} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">CTA principal FR
                  <input name="hero_cta_primary_text_fr" defaultValue={localizedValue(settings.hero_cta_primary_text).fr} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Lien CTA principal
                  <input name="hero_cta_primary_link" defaultValue={settings.hero_cta_primary_link} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">CTA secondaire AR
                  <input name="hero_cta_secondary_text_ar" dir="rtl" defaultValue={localizedValue(settings.hero_cta_secondary_text).ar} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">CTA secondaire FR
                  <input name="hero_cta_secondary_text_fr" defaultValue={localizedValue(settings.hero_cta_secondary_text).fr} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Lien CTA secondaire
                  <input name="hero_cta_secondary_link" defaultValue={settings.hero_cta_secondary_link} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
              </div>
            </div>
          ) : null}

          {activeTab === "features" ? (
            <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">Features AR/FR</h2>
              {features.map((feature, index) => (
                <div key={index} className="rounded-lg border border-zinc-200 p-4">
                  <p className="mb-3 font-bold">Element {index + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm font-bold">Icone
                      <select value={feature.icon} onChange={(event) => updateFeature(index, "icon", event.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink">
                        {iconOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm font-bold">Titre AR
                      <input dir="rtl" value={localizedValue(feature.title).ar} onChange={(event) => updateFeatureText(index, "title", "ar", event.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">Titre FR
                      <input value={localizedValue(feature.title).fr} onChange={(event) => updateFeatureText(index, "title", "fr", event.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">Sous-titre AR
                      <input dir="rtl" value={localizedValue(feature.subtitle).ar} onChange={(event) => updateFeatureText(index, "subtitle", "ar", event.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">Sous-titre FR
                      <input value={localizedValue(feature.subtitle).fr} onChange={(event) => updateFeatureText(index, "subtitle", "fr", event.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "social" ? (
            <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">Contact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 font-bold">WhatsApp
                  <input name="whatsapp_number" defaultValue={settings.whatsapp_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Telephone
                  <input name="phone_number" defaultValue={settings.phone_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Instagram
                  <input name="instagram_url" defaultValue={settings.instagram_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
                <label className="grid gap-2 font-bold">Facebook
                  <input name="facebook_url" defaultValue={settings.facebook_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
                </label>
              </div>
              <label className="grid gap-2 font-bold">Message WhatsApp AR
                <textarea name="whatsapp_message_ar" dir="rtl" defaultValue={localizedValue(settings.whatsapp_message).ar} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
              </label>
              <label className="grid gap-2 font-bold">Message WhatsApp FR
                <textarea name="whatsapp_message_fr" defaultValue={localizedValue(settings.whatsapp_message).fr} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal outline-none focus:border-ink" />
              </label>
            </div>
          ) : null}

          {saved ? <p className="rounded-lg bg-green-50 p-3 font-bold text-green-700">Parametres enregistres.</p> : null}
          <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white"><Save size={18} /> Enregistrer</button>
        </form>
      </section>
    </main>
  );
}
