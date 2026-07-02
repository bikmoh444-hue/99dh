"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, MessageSquare, Send, User } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.get("full_name"),
          email: form.get("email"),
          message: form.get("message")
        })
      });
      const data = await res.json();
      setSending(false);
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSent(true);
    } catch {
      setSending(false);
      setError("Erreur réseau. Vérifie ta connexion.");
    }
  }

  if (sent) {
    return (
      <div className="mt-10 rounded-xl bg-green-50 p-8 text-center">
        <Mail size={40} className="mx-auto text-green-600" />
        <p className="mt-4 text-xl font-black text-green-800">Message envoyé !</p>
        <p className="mt-2 text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-ink px-6 py-3 font-bold text-white">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 grid gap-5">
      <div className="relative">
        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input required name="full_name" placeholder="Votre nom complet" className="w-full rounded-lg border border-zinc-200 py-4 pl-11 pr-4 outline-none focus:border-ink" />
      </div>
      <div className="relative">
        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input required name="email" type="email" placeholder="Votre email" className="w-full rounded-lg border border-zinc-200 py-4 pl-11 pr-4 outline-none focus:border-ink" />
      </div>
      <div className="relative">
        <MessageSquare size={18} className="absolute left-4 top-4 text-zinc-400" />
        <textarea required name="message" placeholder="Votre message" rows={5} className="w-full rounded-lg border border-zinc-200 py-4 pl-11 pr-4 outline-none focus:border-ink" />
      </div>
      {error ? <p className="rounded-lg bg-red-50 p-3 font-bold text-red-700">{error}</p> : null}
      <button disabled={sending} className="flex items-center justify-center gap-3 rounded-lg bg-ink px-6 py-4 font-bold text-white disabled:opacity-50">
        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {sending ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
