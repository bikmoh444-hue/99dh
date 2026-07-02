import { categories as fallbackCategories, products as fallbackProducts, testimonials as fallbackTestimonials } from "@/lib/mock-data";
import { createServerSupabase } from "@/lib/supabase";
import type { Category, FeatureItem, Product, ProductReview, SiteSettings, Testimonial } from "@/lib/types";

const defaultFeatures = [
  { icon: "Truck", title: "Livraison rapide", subtitle: "24/48h partout" },
  { icon: "CreditCard", title: "Paiement à la livraison", subtitle: "Sécurité totale" },
  { icon: "PackageCheck", title: "Produits sélectionnés", subtitle: "Qualité premium" },
  { icon: "LockKeyhole", title: "Achat sécurisé", subtitle: "Données protégées" }
];

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
  hero_badge_text: "Exclusivité Maroc",
  hero_title: "Tout à 99 DH",
  hero_subtitle: "",
  hero_description: "Des produits utiles, tendance et sélectionnés pour le quotidien marocain. Prix unique, livraison rapide, paiement à la livraison.",
  hero_image_url: "",
  hero_cta_primary_text: "Acheter maintenant",
  hero_cta_primary_link: "#deals",
  hero_cta_secondary_text: "Voir le catalogue",
  hero_cta_secondary_link: "#categories",
  logo_url: "",
  features: defaultFeatures
};

function normalizeProduct(item: any): Product {
  const galleryRows = [...(item.product_images ?? [])].sort((a: any, b: any) => a.position - b.position).map((image: any) => image.image_url);
  const images = item.images?.length ? item.images : galleryRows;
  return {
    ...item,
    image_url: images[0] ?? item.image_url ?? fallbackProducts[0].image_url,
    images: images.length ? images : [item.image_url ?? fallbackProducts[0].image_url],
    specs: Array.isArray(item.specs) ? item.specs : [],
    category: item.categories?.name ?? item.category ?? "Produit"
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
  if (!supabase) return fallbackSiteSettings;
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (!data) return fallbackSiteSettings;
  return {
    ...fallbackSiteSettings,
    ...data,
    shipping_fee: Number(data.shipping_fee ?? 0),
    features: Array.isArray(data.features) ? data.features as FeatureItem[] : defaultFeatures
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

export async function getStorefrontData(): Promise<{ categories: Category[]; products: Product[]; testimonials: Testimonial[]; settings: SiteSettings }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return {
      categories: fallbackCategories,
      products: fallbackProducts,
      testimonials: await getTestimonials(),
      settings: fallbackSiteSettings
    };
  }

  const [categoryResult, productResult, testimonialResult, settings] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(3),
    getSiteSettings()
  ]);

  const dbCategories = categoryResult.data?.length ? categoryResult.data : fallbackCategories;
  const dbProducts = productResult.data?.length ? productResult.data.map(normalizeProduct) : fallbackProducts;
  const dbTestimonials = testimonialResult.data?.length ? testimonialResult.data.map(normalizeTestimonial) : [];

  return {
    categories: dbCategories,
    products: dbProducts,
    testimonials: dbTestimonials,
    settings
  };
}

export async function getProductData(id: string): Promise<{ product: Product | null; similar: Product[]; reviews: ProductReview[] }> {
  const supabase = createServerSupabase();
  if (!supabase) {
    const product = fallbackProducts.find((item) => item.id === id) ?? null;
    return {
      product,
      similar: fallbackProducts.filter((item) => item.category_id === product?.category_id && item.id !== id).slice(0, 4),
      reviews: [
        { id: "r1", product_id: id, customer_name: "Sara", rating: 5, comment: "Produit conforme et livraison rapide.", created_at: new Date().toISOString() },
        { id: "r2", product_id: id, customer_name: "Yassine", rating: 4, comment: "Bon rapport qualité prix pour 99 DH.", created_at: new Date().toISOString() }
      ]
    };
  }

  const { data: productData } = await supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("id", id).eq("is_active", true).maybeSingle();
  const product = productData ? normalizeProduct(productData) : null;
  const [similarResult, reviewsResult] = await Promise.all([
    product ? supabase.from("products").select("*, categories(name), product_images(image_url, position)").eq("category_id", product.category_id).neq("id", id).eq("is_active", true).limit(4) : Promise.resolve({ data: [] }),
    supabase.from("product_reviews").select("*").eq("product_id", id).order("created_at", { ascending: false })
  ]);

  return {
    product,
    similar: (similarResult.data ?? []).map(normalizeProduct),
    reviews: reviewsResult.data ?? []
  };
}
