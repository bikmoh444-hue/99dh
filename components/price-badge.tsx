import { FIXED_PRODUCT_PRICE_LABEL } from "@/lib/pricing";

export function PriceBadge({ compact = false }: { compact?: boolean }) {
  return <span className={compact ? "rounded-full bg-gold px-2.5 py-1 text-[10px] font-black text-ink sm:px-3 sm:text-xs" : "rounded-full bg-gold px-3 py-1.5 text-xs font-black text-ink sm:px-4 sm:py-2 sm:text-sm"}>{FIXED_PRODUCT_PRICE_LABEL}</span>;
}
