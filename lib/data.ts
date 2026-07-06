import { categories as fallbackCategories, products as fallbackProducts, testimonials as fallbackTestimonials } from "@/lib/mock-data";
import { createServerSupabase } from "@/lib/supabase";
import { defaultLocale, localized, translatable, type Locale } from "@/lib/i18n";
import { FIXED_PRODUCT_PRICE, normalizeFixedPriceText } from "@/lib/pricing";
import type { Category, FeatureItem, Product, ProductReview, SiteSettings, Testimonial } from "@/lib/types";

const defaultFeatures = [
  { icon: "Truck", title: translatable("توصيل سريع", "Livraison rapide"), subtitle: translatable("24/48 ساعة في جميع المدن", "24/48h partout") },
  { icon: "CreditCard", title: translatable("الدفع عند الاستلام", "Paiement a la livraison"), subtitle: translatable("شراء آمن ومريح", "Securite totale") },
  { icon: "PackageCheck", title: translatable("منتجات مختارة", "Produits selectionnes"), subtitle: translatable("جودة بثمن مناسب", "Qualite premium") },
  { icon: "LockKeyhole", title: translatable("طلب آمن", "Achat securise"), subtitle: translatable("معلوماتك محمية", "Donnees protegees") }
];

/*
const oldDefaultFeatures = [
  { icon: "Truck", title: "Livraison rapide", subtitle: "24/48h partout" },
  { icon: "CreditCard", title: "Paiement à la livraison", subtitle: "Sécurité totale" },
  { icon: "PackageCheck", title: "Produits sélectionnés", subtitle: "Qualité premium" },
  { icon: "LockKeyhole", title: "Achat sécurisé", subtitle: "Données protégées" }
];
*/

export const fallbackSiteSettings: SiteSettings = {
  id: 1,
  shipping_fee: 35,
  whatsapp_number: "",
  phone_number: "",
  contact_email: "",
  instagram_url: "",
  facebook_url: "",
  whatsapp_message: "",
  show_testimonials: true,
  hero_badge_text: translatable("عروض حصرية", "Offres Exclusives"),
  hero_title: translatable("كلشي بـ 199 درهم", "Tout à 199 DH"),
  hero_subtitle: translatable("أفضل المنتجات اليومية بثمن واحد فقط.", "Les meilleurs produits du quotidien à un seul prix."),
  hero_description: translatable("أفضل المنتجات اليومية بثمن واحد فقط.", "Les meilleurs produits du quotidien à un seul prix."),
  hero_image_url: "",
  hero_cta_primary_text: translatable("تسوق الآن", "Acheter maintenant"),
  hero_cta_primary_link: "#categories",
  hero_cta_secondary_text: translatable("اكتشف العروض", "Voir les offres"),
  hero_cta_secondary_link: "#deals",
  logo_url: "",
  features: defaultFeatures
};

function normalizeProduct(item: any, locale: Locale = defaultLocale): Product {
  const galleryRows = [...(item.product_images ?? [])].sort((a: any, b: any) => a.position - b.position).map((image: any) => image.image_url);
  const images = item.images?.length ? item.images : galleryRows;
  return {
    ...item,
    price: FIXED_PRODUCT_PRICE,
    name: localized(item.name, locale),
    description: localized(item.description, locale),
    image_url: images[0] ?? item.image_url ?? fallbackProducts[0].image_url,
    images: images.length ? images : [item.image_url ?? fallbackProducts[0].image_url],
    specs: Array.isArray(item.specs) ? item.specs : [],
    category: localized(item.categories?.name ?? item.category ?? "Produit", locale)
  };
}

function normalizeSiteSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    hero_title: normalizeFixedPriceText(settings.hero_title),
    hero_cta_primary_link: "#categories",
    hero_cta_secondary_text: normalizeFixedPriceText(settings.hero_cta_secondary_text),
    hero_cta_secondary_link: "#deals"
  };
}

function normalizeTestimonial(item: any): Testimonial {
  return {
    id: item.id,
    name: item.name ?? item.customer_name,
    city: item.city ?? "",
    message: item.message,
    rating: Number(item.rating ?? 5),
    avatar_url: item.avatar_url,
    is_published: item.is_published ?? true,
    created_at: item.created_at
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createServerSupabase();
  if (!supabase) return normalizeSiteSettings(fallbackSiteSettings);
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (!data) return normalizeSiteSettings(fallbackSiteSettings);
  return normalizeSiteSettings({
    ...fallbackSiteSettings,
    ...data,
    shipping_fee: Number(data.shipping_fee ?? 0),
    features: Array.isArray(data.features) ? data.features as FeatureItem[] : defaultFeatures
  });
}

function localizeCategory(item: Category, locale: Locale): Category {
  return { ...item, name: localized(item.name, locale) };
}

function localizeFeature(item: FeatureItem, locale: Locale): FeatureItem {
  return {
    ...item,
    title: localized(item.title, locale),
    subtitle: localized(item.subtitle, locale)
  };
}

function localizeSettingField(settings: SiteSettings, field: keyof SiteSettings, locale: Locale) {
  const localizedColumn = (settings as any)[`${String(field)}_${locale}`];
  if (localizedColumn) return localized(localizedColumn, locale);
  return localized(settings[field], locale) || localized(fallbackSiteSettings[field], locale);
}

function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  return {
    ...settings,
    whatsapp_message: localizeSettingField(settings, "whatsapp_message", locale),
    hero_badge_text: localizeSettingField(settings, "hero_badge_text", locale),
    hero_title: localizeSettingField(settings, "hero_title", locale),
    hero_subtitle: localizeSettingField(settings, "hero_subtitle", locale),
    hero_description: localizeSettingField(settings, "hero_description", locale),
    hero_cta_primary_text: localizeSettingField(settings, "hero_cta_primary_text", locale),
    hero_cta_secondary_text: localizeSettingField(settings, "hero_cta_secondary_text", locale),
    features: settings.features.map((feature) => localizeFeature(feature, locale))
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return fallbackTestimonials.map((item, index) => ({ id: `fallback-${index}`, name: item.name, city: item.city, message: item.quote, rating: 5, avatar_url: item.avatar }));
  }
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3);
  return data?.length ? data.map(normalizeTestimonial) : [];
}

export async function getStorefrontData(locale: Locale = defaultLocale): Promise<{ categories: Category[]; products: Product[]; testimonials: Testimonial[]; settings: SiteSettings }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return {
      categories: fallbackCategories.map((category) => localizeCategory(category, locale)),
      products: fallbackProducts.map((product) => normalizeProduct(product, locale)),
      testimonials: await getTestimonials(),
      settings: localizeSettings(fallbackSiteSettings, locale)
    };
  }

  const [categoryResult, productResult, testimonialResult, settings] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
    getSiteSettings()
  ]);

  const dbCategories = (categoryResult.data?.length ? categoryResult.data : fallbackCategories).map((category: Category) => localizeCategory(category, locale));
  const dbProducts = productResult.data?.length ? productResult.data.map((product) => normalizeProduct(product, locale)) : fallbackProducts.map((product) => normalizeProduct(product, locale));
  const dbTestimonials = testimonialResult.data?.length ? testimonialResult.data.map(normalizeTestimonial) : [];

  return {
    categories: dbCategories,
    products: dbProducts,
    testimonials: dbTestimonials,
    settings: localizeSettings(settings, locale)
  };
}

export async function getProductData(id: string, locale: Locale = defaultLocale): Promise<{ product: Product | null; similar: Product[]; reviews: ProductReview[] }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    const product = fallbackProducts.find((item) => item.id === id) ?? null;
    return {
      product: product ? normalizeProduct(product, locale) : null,
      similar: fallbackProducts.filter((item) => item.category_id === product?.category_id && item.id !== id).slice(0, 4).map((item) => normalizeProduct(item, locale)),
      reviews: [
        { id: "r1", product_id: id, customer_name: "Sara", rating: 5, comment: "Produit conforme et livraison rapide.", created_at: new Date().toISOString() },
        { id: "r2", product_id: id, customer_name: "Yassine", rating: 4, comment: "Bon rapport qualité prix pour 199 DH.", created_at: new Date().toISOString() }
      ]
    };
  }

  const { data: productData } = await supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("id", id).eq("is_active", true).maybeSingle();
  const product = productData ? normalizeProduct(productData, locale) : null;
  const [similarResult, reviewsResult] = await Promise.all([
    product ? supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("category_id", product.category_id).neq("id", id).eq("is_active", true).limit(4) : Promise.resolve({ data: [] }),
    supabase.from("product_reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
  ]);

  return {
    product,
    similar: (similarResult.data ?? []).map((item) => normalizeProduct(item, locale)),
    reviews: reviewsResult.data ?? []
  };
}
