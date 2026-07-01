import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAD = new Intl.NumberFormat("fr-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0
});

export function formatPrice(value: number) {
  return MAD.format(value).replace("MAD", "DH");
}

export function statusLabel(status: string) {
  return {
    en_attente: "En attente",
    en_cours: "En cours",
    livree: "Livrée",
    annulee: "Annulée"
  }[status] ?? status;
}

export function statusClass(status: string) {
  return {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_cours: "bg-blue-100 text-blue-800",
    livree: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800"
  }[status] ?? "bg-zinc-100 text-zinc-800";
}
