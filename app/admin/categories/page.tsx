"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types";

const iconOptions = [
  "Smartphone", "Home", "Sparkles", "Shirt", "Utensils", "Zap", "Watch",
  "Heart", "PackageCheck", "Search", "ShieldCheck", "ShoppingBag", "Truck",
  "CreditCard", "LockKeyhole"
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("ShoppingBag");

  useEffect(() => {
    fetch("/api/categories").then((res) => res.json()).then((data) => setCategories(data.categories ?? []));
  }, []);

  function resetForm() {
    setName("");
    setSlug("");
    setIcon("ShoppingBag");
    setEditing(null);
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon ?? "ShoppingBag");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { name, slug, icon };
    if (editing) {
      await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setCategories((current) => current.map((item) => item.id === editing.id ? { ...item, ...payload } : item));
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.category) setCategories((current) => [...current, result.category]);
    }
    resetForm();
  }

  async function remove(cat: Category) {
    setCategories((current) => current.filter((item) => item.id !== cat.id));
    await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
          <h1 className="text-2xl font-black">Gestion des catégories</h1>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[400px_1fr] lg:px-8">
        <form onSubmit={submit} className="h-fit rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">{editing ? "Modifier la catégorie" : "Ajouter une catégorie"}</h2>
          <div className="mt-5 grid gap-4">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (ex: electronique)" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink">
              {iconOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white"><Plus size={18} /> {editing ? "Enregistrer" : "Ajouter"}</button>
            {editing ? <button type="button" onClick={resetForm} className="rounded-lg border border-ink px-4 py-3 font-bold">Annuler</button> : null}
          </div>
        </form>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Catégories</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr><th className="p-3">Nom</th><th className="p-3">Slug</th><th className="p-3">Icône</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-zinc-100">
                    <td className="p-3 font-black">{cat.name}</td>
                    <td className="p-3">{cat.slug}</td>
                    <td className="p-3">{cat.icon ?? "—"}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => startEdit(cat)} className="mr-3 font-bold underline">Modifier</button>
                      <button onClick={() => remove(cat)} aria-label="Supprimer" className="text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 ? <tr><td colSpan={4} className="p-3 text-center text-zinc-500">Aucune catégorie.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
