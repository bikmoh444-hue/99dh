"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { categories as demoCategories, products as demoProducts } from "@/lib/mock-data";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { createBrowserSupabase } from "@/lib/supabase";
import { localizedValue, translatable } from "@/lib/i18n";
import { FIXED_PRODUCT_PRICE, FIXED_PRODUCT_PRICE_LABEL } from "@/lib/pricing";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [manualUrl, setManualUrl] = useState("");
  const [specs, setSpecs] = useState<Array<{ label: string; value: string }>>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>(demoCategories);

  useEffect(() => {
    fetch("/api/products").then((res) => res.json()).then((data) => data.products?.length && setProducts(data.products));
    fetch("/api/categories").then((res) => res.json()).then((data) => data.categories?.length && setCategoryOptions(data.categories));
  }, []);

  function categoryName(categoryId: string | null) {
    return localizedValue(categoryOptions.find((category) => category.id === categoryId)?.name).ar;
  }

  function autoResizeTextArea(event: FormEvent<HTMLTextAreaElement>) {
    const element = event.currentTarget;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }

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

  function resetFormState() {
    setEditing(null);
    setImageUrls([]);
    setSpecs([]);
    setManualUrl("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: translatable(String(form.get("name_ar")), String(form.get("name_fr"))),
      description: translatable(String(form.get("description_ar")), String(form.get("description_fr"))),
      category_id: String(form.get("category_id")),
      stock: Number(form.get("stock")),
      is_flash_sale: form.get("is_flash_sale") === "on",
      flash_sale_end: form.get("flash_sale_end") ? String(form.get("flash_sale_end")) : null,
      price: FIXED_PRODUCT_PRICE,
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
      result.product
        ? { ...result.product, category: result.product.category ?? categoryName(payload.category_id) }
        : { ...payload, id: crypto.randomUUID(), image_url: imageUrls[0], images: imageUrls, category: categoryName(payload.category_id) },
      ...current
    ]);
    resetFormState();
    event.currentTarget.reset();
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: translatable(String(form.get("name_ar")), String(form.get("name_fr"))),
      description: translatable(String(form.get("description_ar")), String(form.get("description_fr"))),
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
    setProducts((current) => current.map((item) => (item.id === editing.id ? { ...item, ...payload, image_url: imageUrls[0], images: imageUrls, specs, category: categoryName(payload.category_id) } : item)));
    resetFormState();
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Catalogue</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">{products.length} produits dans le dashboard</p>
            </div>
            {editing ? <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-black text-ink">Edition en cours</span> : null}
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr><th className="p-3">Produit</th><th className="p-3">Categorie</th><th className="p-3">Stock</th><th className="p-3">Prix</th><th className="p-3">Flash</th><th className="p-3">Images</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-100">
                    <td className="p-3 font-black">{localizedValue(product.name).ar}</td>
                    <td className="p-3">{localizedValue(product.category).ar || categoryName(product.category_id)}</td>
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

        <form key={editing?.id ?? "new"} onSubmit={editing ? saveEdit : submit} className="h-fit overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-5 lg:max-h-[calc(100vh-40px)]">
          <div className="border-b border-zinc-200 px-4 py-4">
            <h2 className="text-lg font-black">{editing ? "Modifier le produit" : "Ajouter un produit"}</h2>
            <p className="mt-1 text-xs font-medium text-zinc-500">Actions toujours visibles, formulaire compact.</p>
          </div>

          <div className="grid max-h-[calc(100vh-180px)] gap-3 overflow-y-auto bg-zinc-50/60 p-3">
            <FormSection title="Basic Information">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <input required name="name_ar" dir="rtl" defaultValue={localizedValue(editing?.name).ar} placeholder="Nom AR" className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
                <input required name="name_fr" defaultValue={localizedValue(editing?.name).fr} placeholder="Nom FR" className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <textarea name="description_ar" dir="rtl" defaultValue={localizedValue(editing?.description).ar} onInput={autoResizeTextArea} placeholder="Description AR" rows={2} className="max-h-40 resize-none overflow-hidden rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
                <textarea name="description_fr" defaultValue={localizedValue(editing?.description).fr} onInput={autoResizeTextArea} placeholder="Description FR" rows={2} className="max-h-40 resize-none overflow-hidden rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
              </div>
              <select required name="category_id" defaultValue={editing?.category_id ?? categoryOptions[0]?.id ?? ""} className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink">
                {categoryOptions.map((category) => <option key={category.id} value={category.id}>{localizedValue(category.name).ar}</option>)}
              </select>
            </FormSection>

            <FormSection title="Pricing">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <p className="text-xs font-bold text-zinc-500">Prix fixe</p>
                  <p className="text-lg font-black text-ink">{FIXED_PRODUCT_PRICE_LABEL}</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <p className="text-xs font-bold text-zinc-500">Rating defaut</p>
                  <p className="text-lg font-black text-ink">4.8</p>
                </div>
              </div>
            </FormSection>

            <FormSection title="Inventory">
              <input required name="stock" type="number" defaultValue={editing?.stock ?? 100} placeholder="Stock" className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
            </FormSection>

            <FormSection title="Images">
              <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-sm font-bold transition hover:border-ink hover:bg-white">
                <ImagePlus className="mb-2" size={20} />
                Upload multiple d&apos;images
                <input type="file" multiple accept="image/*" onChange={(event) => uploadFiles(event.target.files)} className="hidden" />
              </label>
              <div className="mt-2 flex gap-2">
                <input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="Ou coller une URL image" className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
                <button type="button" onClick={addManualUrl} className="rounded-lg bg-ink px-3 text-white"><Plus size={18} /></button>
              </div>
              {imageUrls.length ? (
                <div className="mt-2 grid gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-100">
                        <Image src={url} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="min-w-0 flex-1 truncate text-xs">{index === 0 ? "Principale - " : ""}{url}</span>
                      <button type="button" onClick={() => moveImage(index, -1)} aria-label="Monter"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => moveImage(index, 1)} aria-label="Descendre"><ArrowDown size={14} /></button>
                      <button type="button" onClick={() => setImageUrls((current) => current.filter((_, i) => i !== index))} aria-label="Supprimer" className="text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              ) : null}
            </FormSection>

            <FormSection title="Settings">
              <div className="grid gap-2">
                <label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm font-bold">
                  <span>Actif</span>
                  <input name="is_active" defaultChecked={editing?.is_active ?? true} type="checkbox" className="h-4 w-4" />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm font-bold">
                  <span>Vente flash</span>
                  <input name="is_flash_sale" defaultChecked={editing?.is_flash_sale} type="checkbox" className="h-4 w-4" />
                </label>
                <input name="flash_sale_end" type="datetime-local" className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-ink" />
              </div>
            </FormSection>

            <FormSection title="Caracteristiques">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-500">Specifications produit</p>
                <button type="button" onClick={() => setSpecs((current) => [...current, { label: "", value: "" }])} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-ink hover:bg-zinc-200">Ajouter</button>
              </div>
              <div className="mt-2 grid gap-2">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <input value={spec.label} onChange={(event) => updateSpec(index, "label", event.target.value)} placeholder="Label" className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
                    <input value={spec.value} onChange={(event) => updateSpec(index, "value", event.target.value)} placeholder="Valeur" className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
                    <button type="button" onClick={() => setSpecs((current) => current.filter((_, i) => i !== index))} className="text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </FormSection>
          </div>

          <div className="sticky bottom-0 z-10 flex gap-2 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur">
            <button disabled={!imageUrls.length || !categoryOptions.length} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white shadow-sm disabled:bg-zinc-300">
              <Plus size={17} /> {editing ? "Enregistrer" : "Ajouter"}
            </button>
            {editing ? (
              <button type="button" onClick={resetFormState} className="rounded-lg border border-zinc-300 px-4 py-3 text-sm font-bold text-ink hover:border-ink">Annuler</button>
            ) : (
              <button type="button" onClick={resetFormState} className="rounded-lg border border-zinc-300 px-4 py-3 text-sm font-bold text-ink hover:border-ink">Reset</button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-zinc-500">{title}</h3>
      {children}
    </section>
  );
}
