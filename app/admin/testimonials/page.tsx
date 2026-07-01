"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetch("/api/testimonials").then((res) => res.json()).then((data) => setItems(data.testimonials ?? []));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      id: editing?.id,
      name: String(form.get("name")),
      city: String(form.get("city")),
      message: String(form.get("message")),
      rating: Number(form.get("rating"))
    };
    const response = await fetch("/api/testimonials", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setItems((current) => editing ? current.map((item) => item.id === editing.id ? result.testimonial : item) : [result.testimonial, ...current]);
    setEditing(null);
    event.currentTarget.reset();
  }

  async function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
          <h1 className="text-2xl font-black">Témoignages</h1>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <form key={editing?.id ?? "new"} onSubmit={submit} className="h-fit rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">{editing ? "Modifier" : "Ajouter"}</h2>
          <div className="mt-5 grid gap-3">
            <input required name="name" defaultValue={editing?.name} placeholder="Nom" className="rounded-lg border border-zinc-200 px-4 py-3" />
            <input required name="city" defaultValue={editing?.city} placeholder="Ville" className="rounded-lg border border-zinc-200 px-4 py-3" />
            <textarea required name="message" defaultValue={editing?.message} placeholder="Message" rows={4} className="rounded-lg border border-zinc-200 px-4 py-3" />
            <input required name="rating" type="number" min={1} max={5} defaultValue={editing?.rating ?? 5} className="rounded-lg border border-zinc-200 px-4 py-3" />
            <button className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white"><Plus size={18} /> Enregistrer</button>
          </div>
        </form>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-3">Nom</th><th className="p-3">Ville</th><th className="p-3">Note</th><th className="p-3"></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-zinc-100">
                  <td className="p-3 font-black">{item.name}</td>
                  <td className="p-3">{item.city}</td>
                  <td className="p-3">{item.rating}/5</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditing(item)} className="mr-3 font-bold underline">Modifier</button>
                    <button onClick={() => remove(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
