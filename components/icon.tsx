import {
  CreditCard,
  Heart,
  Home,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  Utensils,
  Watch,
  Zap
} from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Heart,
  Home,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  Utensils,
  Watch,
  Zap
};

export function StoreIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? ShoppingBag;
  return <Icon className={className} aria-hidden="true" />;
}
