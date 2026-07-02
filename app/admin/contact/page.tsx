"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Check, X } from "lucide-react";
import type { ContactMessage } from "@/lib/types";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetch("/api/contact").then((res) => res.json()).then((data) => setMessages(data.messages ?? []));
  }, []);

  async function toggleRead(msg: ContactMessage) {
    setMessages((current) => current.map((m) => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
    await fetch(`/api/contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id, is_read: !msg.is_read })
    });
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black">Messages reçus</h1>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold">{messages.filter((m) => !m.is_read).length} non lu{messages.filter((m) => !m.is_read).length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {messages.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-zinc-500 shadow-sm">
            <Mail size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-bold">Aucun message reçu.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`rounded-xl border p-5 shadow-sm transition ${msg.is_read ? "bg-white border-zinc-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-black">{msg.full_name}</p>
                      <a href={`mailto:${msg.email}`} className="text-sm text-zinc-500 underline">{msg.email}</a>
                      <span className="text-xs text-zinc-400">{new Date(msg.created_at).toLocaleString("fr-MA")}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-600">{msg.message}</p>
                  </div>
                  <button
                    onClick={() => toggleRead(msg)}
                    className={`shrink-0 rounded-full p-2 transition ${msg.is_read ? "bg-zinc-100 text-zinc-400 hover:bg-amber-100 hover:text-amber-600" : "bg-green-100 text-green-700 hover:bg-zinc-100 hover:text-zinc-400"}`}
                    aria-label={msg.is_read ? "Marquer non lu" : "Marquer lu"}
                  >
                    {msg.is_read ? <X size={16} /> : <Check size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
