"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { categories, products as demoProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { createBrowserSupabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [manualUrl, setManualUrl] = useState("");
  const [specs, setSpecs] = useState<Array<{ label: string; value: string }>>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products").then((res) => res.json()).then((data) => data.products?.length && setProducts(data.products));
  }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setImageUrls((current) => [...current, ...uploaded]);
  }

  function addManualUrl() {
    if (!manualUrl.trim()) return;
    setImageUrls((current) => [...current, manualUrl.trim()]);
    setManualUrl("");
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImageUrls((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateSpec(index: number, key: "label" | "value", value: string) {
    setSpecs((current) => current.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec)));
  }

  function startEdit(product: Product) {
    setEditing(product);
    setImageUrls(product.images?.length ? product.images : [product.image_url]);
    setSpecs(product.specs ?? []);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      category_id: String(form.get("category_id")),
      stock: Number(form.get("stock")),
      is_flash_sale: form.get("is_flash_sale") === "on",
      flash_sale_end: form.get("flash_sale_end") ? String(form.get("flash_sale_end")) : null,
      price: 99,
      rating: 4.8,
      reviews_count: 0,
      is_active: form.get("is_active") === "on",
      image_urls: imageUrls,
      specs
    };
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setProducts((current) => [
      result.product ?? { ...payload, id: crypto.randomUUID(), image_url: imageUrls[0], images: imageUrls, category: categories.find((c) => c.id === payload.category_id)?.name ?? "" },
      ...current
    ]);
    setImageUrls([]);
    setSpecs([]);
    setEditing(null);
    event.currentTarget.reset();
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      category_id: String(form.get("category_id")),
      stock: Number(form.get("stock")),
      is_active: form.get("is_active") === "on",
      is_flash_sale: form.get("is_flash_sale") === "on",
      flash_sale_end: form.get("flash_sale_end") ? String(form.get("flash_sale_end")) : null,
      images: imageUrls,
      specs
    };
    await fetch(`/api/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setProducts((current) => current.map((item) => (item.id === editing.id ? { ...item, ...payload, image_url: imageUrls[0], images: imageUrls, specs } : item)));
    setEditing(null);
    setImageUrls([]);
    setSpecs([]);
  }

  async function remove(product: Product) {
    setProducts((current) => current.filter((item) => item.id !== product.id));
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <Link href="/admin" className="mb-2 inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft size={16} /> Dashboard</Link>
            <h1 className="text-2xl font-black">Gestion des produits</h1>
          </div>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[430px_1fr] lg:px-8">
        <form key={editing?.id ?? "new"} onSubmit={editing ? saveEdit : submit} className="h-fit rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">{editing ? "Modifier le produit" : "Ajouter un produit"}</h2>
          <div className="mt-5 grid gap-4">
            <input required name="name" defaultValue={editing?.name} placeholder="Nom" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <textarea name="description" defaultValue={editing?.description} placeholder="Description" rows={3} className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <select name="category_id" defaultValue={editing?.category_id ?? categories[0].id} className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <input required name="stock" type="number" defaultValue={editing?.stock ?? 100} placeholder="Stock" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <label className="flex items-center gap-3 font-bold"><input name="is_active" defaultChecked={editing?.is_active ?? true} type="checkbox" /> Actif</label>
            <label className="flex items-center gap-3 font-bold"><input name="is_flash_sale" defaultChecked={editing?.is_flash_sale} type="checkbox" /> Vente flash</label>
            <input name="flash_sale_end" type="datetime-local" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
            <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-center font-bold">
              <ImagePlus className="mb-2" />
              Upload multiple d'images
              <input type="file" multiple accept="image/*" onChange={(event) => uploadFiles(event.target.files)} className="hidden" />
            </label>
            <div className="flex gap-2">
              <input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="Ou coller une URL image" className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
              <button type="button" onClick={addManualUrl} className="rounded-lg bg-ink px-4 text-white"><Plus size={18} /></button>
            </div>
            {imageUrls.length ? (
              <div className="grid gap-2">
                {imageUrls.map((url, index) => (
                  <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-zinc-100">
                      <Image src={url} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-xs">{index === 0 ? "Principale - " : ""}{url}</span>
                    <button type="button" onClick={() => moveImage(index, -1)} aria-label="Monter"><ArrowUp size={15} /></button>
                    <button type="button" onClick={() => moveImage(index, 1)} aria-label="Descendre"><ArrowDown size={15} /></button>
                    <button type="button" onClick={() => setImageUrls((current) => current.filter((_, i) => i !== index))} aria-label="Supprimer" className="text-red-600"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="rounded-xl border border-zinc-200 p-3">
              <div className="flex items-center justify-between">
                <p className="font-black">Caractéristiques</p>
                <button type="button" onClick={() => setSpecs((current) => [...current, { label: "", value: "" }])} className="text-sm font-bold underline">Ajouter</button>
              </div>
              <div className="mt-3 grid gap-2">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <input value={spec.label} onChange={(event) => updateSpec(index, "label", event.target.value)} placeholder="Label" className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
                    <input value={spec.value} onChange={(event) => updateSpec(index, "value", event.target.value)} placeholder="Valeur" className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
                    <button type="button" onClick={() => setSpecs((current) => current.filter((_, i) => i !== index))} className="text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button disabled={!imageUrls.length} className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white disabled:bg-zinc-300"><Plus size={18} /> {editing ? "Enregistrer" : "Ajouter"}</button>
            {editing ? <button type="button" onClick={() => { setEditing(null); setImageUrls([]); setSpecs([]); }} className="rounded-lg border border-ink px-4 py-3 font-bold">Annuler</button> : null}
          </div>
        </form>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Catalogue</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr><th className="p-3">Produit</th><th className="p-3">Catégorie</th><th className="p-3">Stock</th><th className="p-3">Prix</th><th className="p-3">Flash</th><th className="p-3">Images</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-100">
                    <td className="p-3 font-black">{product.name}</td>
                    <td className="p-3">{product.category ?? categories.find((c) => c.id === product.category_id)?.name}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{formatPrice(Number(product.price))}</td>
                    <td className="p-3">{product.is_flash_sale ? "Oui" : "Non"}</td>
                    <td className="p-3">{product.images?.length ?? 1}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => startEdit(product)} className="mr-3 font-bold underline">Modifier</button>
                      <button onClick={() => remove(product)} aria-label="Supprimer" className="text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
