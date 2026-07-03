export type Locale = "ar" | "fr";

export const defaultLocale: Locale = "ar";
export const locales: Locale[] = ["ar", "fr"];

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "fr";
}

export function localized(value: unknown, locale: Locale = defaultLocale): string {
  if (!value) return "";

  if (typeof value === "object") {
    const translated = value as Partial<Record<Locale, unknown>>;
    return String(translated[locale] || translated.fr || translated.ar || "");
  }

  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) return value;

  try {
    const parsed = JSON.parse(trimmed) as Partial<Record<Locale, string>>;
    if (parsed && typeof parsed === "object") {
      return parsed[locale] || parsed.fr || parsed.ar || "";
    }
  } catch {
    return value;
  }

  return value;
}

export function localizedValue(value: unknown): Record<Locale, string> {
  if (!value) return { ar: "", fr: "" };

  if (typeof value === "object") {
    const translated = value as Partial<Record<Locale, unknown>>;
    return { ar: String(translated.ar || ""), fr: String(translated.fr || "") };
  }

  if (typeof value !== "string") return { ar: "", fr: "" };

  const trimmed = value.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as Partial<Record<Locale, string>>;
      return { ar: parsed.ar ?? "", fr: parsed.fr ?? "" };
    } catch {
      return { ar: value, fr: value };
    }
  }

  return { ar: value, fr: value };
}

export const t = localized;

export function translatable(ar: string, fr: string) {
  return JSON.stringify({ ar, fr });
}

export const ui = {
  ar: {
    home: "الرئيسية",
    categories: "الأقسام",
    deals: "العروض",
    contact: "تواصل معنا",
    expressDelivery: "توصيل سريع",
    everywhereMorocco: "في جميع أنحاء المغرب",
    exploreCategories: "تصفح الأقسام",
    todayPrice: "ثمن موحد اليوم",
    flashSales: "عروض محدودة",
    newest: "وصل حديثا",
    bestSellers: "الأكثر مبيعا",
    discoverAll: "اكتشف الكل",
    testimonials: "آراء الزبناء",
    publishedReviews: "آراء منشورة",
    allProducts: "جميع المنتجات",
    searchProducts: "ابحث عن المنتجات...",
    resultsFor: "نتائج البحث عن",
    productFound: "منتج موجود",
    productsFound: "منتجات موجودة",
    noResults: "لا توجد نتائج",
    tryAnotherSearch: "جرب كلمة بحث أخرى.",
    backHome: "العودة للرئيسية",
    product: "منتج",
    addToCart: "أضف للسلة",
    checkout: "إتمام الطلب",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    city: "المدينة",
    address: "العنوان الكامل",
    delivery: "التوصيل",
    total: "المجموع",
    sendMessage: "إرسال الرسالة"
  },
  fr: {
    home: "Home",
    categories: "Categories",
    deals: "Deals",
    contact: "Contact",
    expressDelivery: "Livraison Express",
    everywhereMorocco: "Partout au Maroc",
    exploreCategories: "Explorer nos categories",
    todayPrice: "Prix unique aujourd'hui",
    flashSales: "Ventes Flash",
    newest: "Nouveautes",
    bestSellers: "Meilleures ventes",
    discoverAll: "Decouvrir tout",
    testimonials: "Temoignages clients",
    publishedReviews: "Avis clients publies",
    allProducts: "Tous les produits",
    searchProducts: "Rechercher des produits...",
    resultsFor: "Resultats pour",
    productFound: "produit trouve",
    productsFound: "produits trouves",
    noResults: "Aucun resultat",
    tryAnotherSearch: "Essayez un autre terme de recherche.",
    backHome: "Retour a l'accueil",
    product: "Produit",
    addToCart: "Ajouter au panier",
    checkout: "Commander",
    fullName: "Nom complet",
    phone: "Numero de telephone",
    city: "Ville",
    address: "Adresse complete",
    delivery: "Livraison",
    total: "Total",
    sendMessage: "Envoyer le message"
  }
} satisfies Record<Locale, Record<string, string>>;
