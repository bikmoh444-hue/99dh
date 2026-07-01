"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((res) => res.json()).then((data) => setSettings(data.settings));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      shipping_fee: Number(form.get("shipping_fee")),
      whatsapp_number: String(form.get("whatsapp_number") ?? ""),
      phone_number: String(form.get("phone_number") ?? ""),
      contact_email: String(form.get("contact_email") ?? ""),
      instagram_url: String(form.get("instagram_url") ?? ""),
      facebook_url: String(form.get("facebook_url") ?? ""),
      whatsapp_message: String(form.get("whatsapp_message") ?? ""),
      show_testimonials: form.get("show_testimonials") === "on"
    };
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setSettings(result.settings);
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
      <section className="mx-auto max-w-4xl px-4 py-8">
        {settings ? (
          <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-5 shadow-sm">
            <label className="grid gap-2 font-bold">Frais de livraison<input name="shipping_fee" type="number" defaultValue={settings.shipping_fee} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Numéro WhatsApp<input name="whatsapp_number" defaultValue={settings.whatsapp_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Téléphone<input name="phone_number" defaultValue={settings.phone_number} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Email contact<input name="contact_email" type="email" defaultValue={settings.contact_email} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Instagram<input name="instagram_url" defaultValue={settings.instagram_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Facebook<input name="facebook_url" defaultValue={settings.facebook_url} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="grid gap-2 font-bold">Message WhatsApp<textarea name="whatsapp_message" defaultValue={settings.whatsapp_message} rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 font-normal" /></label>
            <label className="flex items-center gap-3 font-bold"><input name="show_testimonials" type="checkbox" defaultChecked={settings.show_testimonials} /> Afficher la section témoignages</label>
            {saved ? <p className="rounded-lg bg-green-50 p-3 font-bold text-green-700">Paramètres enregistrés.</p> : null}
            <button className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white"><Save size={18} /> Enregistrer</button>
          </form>
        ) : <p>Chargement...</p>}
      </section>
    </main>
  );
}
