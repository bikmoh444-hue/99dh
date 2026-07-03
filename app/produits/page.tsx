import { createServerSupabase } from "@/lib/supabase";
import { categories as fallbackCategories, products as fallbackProducts } from "@/lib/mock-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductListWithSearch } from "@/components/product-list-with-search";
import { defaultLocale, localized, ui, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale-server";
import type { Category, Product } from "@/lib/types";

function normalizeForListing(item: any, locale: Locale = defaultLocale): Product {
  const images = item.images?.length ? item.images : [];
  return {
    ...item,
    name: localized(item.name, locale),
    description: localized(item.description, locale),
    image_url: images[0] ?? item.image_url ?? fallbackProducts[0].image_url,
    images: images.length ? images : [item.image_url ?? fallbackProducts[0].image_url],
    specs: Array.isArray(item.specs) ? item.specs : [],
    category: localized(item.categories?.name ?? item.category ?? "Produit", locale)
  };
}

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const selectedCategoryId = params?.category ?? "";
  const supabase = createServerSupabase();
  let products: Product[] = [];
  let categories: Category[] = fallbackCategories;

  if (supabase) {
    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name), product_images(image_url, position)")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("created_at", { ascending: true })
    ]);

    products = (productResult.data ?? []).map((product) => normalizeForListing(product, locale));
    categories = (categoryResult.data?.length ? categoryResult.data : fallbackCategories).map((category: Category) => ({
      ...category,
      name: localized(category.name, locale)
    }));
  } else {
    products = fallbackProducts.map((product) => normalizeForListing(product, locale));
    categories = fallbackCategories.map((category) => ({ ...category, name: localized(category.name, locale) }));
  }

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const visibleProducts = selectedCategoryId
    ? products.filter((product) => product.category_id === selectedCategoryId)
    : products;

  return (
    <main className="bg-white min-h-screen">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <ProductListWithSearch products={visibleProducts} categoryName={selectedCategory?.name} labels={ui[locale]} />
      </section>
      <SiteFooter />
    </main>
  );
}
