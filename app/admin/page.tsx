"use client";

import Link from "next/link";
import { Bell, Download, Package, Search, ShoppingBag, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoOrders } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice, statusClass, statusLabel } from "@/lib/utils";
import { createBrowserSupabase } from "@/lib/supabase";

const statuses: Array<"all" | OrderStatus> = ["all", "en_attente", "en_cours", "livree", "annulee"];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Order | null>(demoOrders[0]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [adminNote, setAdminNote] = useState(demoOrders[0]?.admin_note ?? "");
  const [unreadContact, setUnreadContact] = useState(0);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders?.length) {
          setOrders(data.orders);
          setSelected(data.orders[0]);
          setAdminNote(data.orders[0]?.admin_note ?? "");
        }
      });

    const supabase = createBrowserSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        setNewOrderAlert(true);
        fetch("/api/orders").then((res) => res.json()).then((data) => data.orders && setOrders(data.orders));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetch("/api/contact").then((res) => res.json()).then((data) => {
      if (data.messages) setUnreadContact(data.messages.filter((m: any) => !m.is_read).length);
    });
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const statusOk = filter === "all" || order.status === filter;
      const text = `${order.order_number} ${order.full_name} ${order.phone}`.toLowerCase();
      return statusOk && text.includes(query.toLowerCase());
    });
  }, [orders, filter, query]);

  const stats = {
    total: orders.length,
    en_attente: orders.filter((o) => o.status === "en_attente").length,
    en_cours: orders.filter((o) => o.status === "en_cours").length,
    livree: orders.filter((o) => o.status === "livree").length,
    annulee: orders.filter((o) => o.status === "annulee").length,
    revenue: orders.filter((o) => o.status !== "annulee").reduce((sum, order) => sum + Number(order.total_amount), 0)
  };

  const chart = Array.from({ length: 7 }).map((_, index) => ({
    day: `J-${6 - index}`,
    commandes: Math.max(0, orders.length - index + (index % 2))
  }));
  const statCards: Array<[string, string | number, LucideIcon]> = [
    ["Total commandes", stats.total, ShoppingBag],
    ["En attente", stats.en_attente, Bell],
    ["En cours", stats.en_cours, Package],
    ["Livrées", stats.livree, Users],
    ["Annulées", stats.annulee, Package],
    ["CA total", formatPrice(stats.revenue), Download]
  ];

  async function updateStatus(order: Order, status: OrderStatus) {
    setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status } : item)));
    if (selected?.id === order.id) setSelected({ ...order, status });
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  }

  async function saveAdminNote() {
    if (!selected) return;
    setOrders((current) => current.map((item) => (item.id === selected.id ? { ...item, admin_note: adminNote } : item)));
    setSelected({ ...selected, admin_note: adminNote });
    await fetch(`/api/orders/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note: adminNote })
    });
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div>
            <h1 className="text-2xl font-black">Dashboard Admin</h1>
            <p className="text-sm text-zinc-500">Commandes, produits et ventes 199 DH Store</p>
          </div>
          <div className="flex items-center gap-3">
            {newOrderAlert ? <span className="rounded-full bg-gold px-3 py-2 text-sm font-black text-ink"><Bell size={15} className="inline" /> Nouvelle commande</span> : null}
            <Link href="/admin/categories" className="rounded-lg border border-ink px-4 py-3 font-bold">Catégories</Link>
            <Link href="/admin/contact" className="relative rounded-lg border border-ink px-4 py-3 font-bold">
              Contact
              {unreadContact > 0 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-black text-white">{unreadContact}</span> : null}
            </Link>
            <Link href="/admin/settings" className="rounded-lg border border-ink px-4 py-3 font-bold">Paramètres</Link>
            <Link href="/admin/testimonials" className="rounded-lg border border-ink px-4 py-3 font-bold">Témoignages</Link>
            <Link href="/admin/products" className="rounded-lg bg-ink px-4 py-3 font-bold text-white">Produits</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statCards.map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded-xl bg-white p-4 shadow-sm">
              <Icon className="h-5 w-5 text-zinc-500" />
              <p className="mt-3 text-sm text-zinc-500">{String(label)}</p>
              <p className="text-2xl font-black">{String(value)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Commandes par jour</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area dataKey="commandes" stroke="#111111" fill="#F5C518" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Détail commande</h2>
            {selected ? (
              <div className="mt-4 space-y-3 text-sm">
                <p><b>#{selected.order_number}</b> - {statusLabel(selected.status)}</p>
                <p><b>Client:</b> {selected.full_name} / {selected.phone}</p>
                <p><b>Ville:</b> {selected.city}</p>
                <p><b>Adresse:</b> {selected.address}</p>
                <div>
                  <b>Produits:</b>
                  <ul className="mt-2 space-y-1">
                    {selected.order_items?.map((item, index) => <li key={index}>{item.quantity}x {item.product_name}</li>)}
                  </ul>
                </div>
                <label className="grid gap-2 font-bold">
                  Note interne
                  <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={3} className="rounded-lg border border-zinc-200 px-3 py-2 font-normal outline-none focus:border-ink" />
                </label>
                <button onClick={saveAdminNote} className="w-full rounded-lg bg-ink px-4 py-3 font-bold text-white">Sauvegarder la note</button>
                <button onClick={() => window.print()} className="w-full rounded-lg border border-ink px-4 py-3 font-bold">Imprimer le bon</button>
              </div>
            ) : <p className="mt-4 text-zinc-500">Sélectionnez une commande.</p>}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === status ? "bg-ink text-white" : "bg-zinc-100"}`}>
                  {status === "all" ? "Toutes" : statusLabel(status)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, téléphone ou N°" className="w-full rounded-lg border border-zinc-200 py-3 pl-10 pr-4 outline-none focus:border-ink lg:w-80" />
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="p-3">N°</th><th className="p-3">Client</th><th className="p-3">Ville</th><th className="p-3">Produits</th><th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} onClick={() => { setSelected(order); setAdminNote(order.admin_note ?? ""); }} className="cursor-pointer border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="p-3 font-black">#{order.order_number}</td>
                    <td className="p-3">{order.full_name}<br /><span className="text-zinc-500">{order.phone}</span></td>
                    <td className="p-3">{order.city}</td>
                    <td className="p-3">{order.order_items?.map((item) => `${item.quantity}x ${item.product_name}`).join(", ")}</td>
                    <td className="p-3 font-black">{formatPrice(Number(order.total_amount))}</td>
                    <td className="p-3">{new Date(order.created_at).toLocaleDateString("fr-MA")}</td>
                    <td className="p-3">
                      <select value={order.status} onChange={(event) => updateStatus(order, event.target.value as OrderStatus)} className={`rounded-full px-3 py-2 text-xs font-black ${statusClass(order.status)}`}>
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
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
