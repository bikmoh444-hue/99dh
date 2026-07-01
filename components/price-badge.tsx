export function PriceBadge({ compact = false }: { compact?: boolean }) {
  return <span className={compact ? "rounded-full bg-gold px-3 py-1 text-xs font-black text-ink" : "rounded-full bg-gold px-4 py-2 text-sm font-black text-ink"}>99 DH</span>;
}
