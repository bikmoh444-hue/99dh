import { createServerSupabase } from "@/lib/supabase";
import { categories as fallbackCategories, products as fallbackProducts } from "@/lib/mock-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductListWithSearch } from "@/components/product-list-with-search";
import type { Category, Product } from "@/lib/types";

function normalizeForListing(item: any): Product {
  const images = item.images?.length ? item.images : [];
  return {
    ...item,
    image_url: images[0] ?? item.image_url ?? fallbackProducts[0].image_url,
    images: images.length ? images : [item.image_url ?? fallbackProducts[0].image_url],
    specs: Array.isArray(item.specs) ? item.specs : [],
    category: item.categories?.name ?? item.category ?? "Produit"
  };
}

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
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

    products = (productResult.data ?? []).map(normalizeForListing);
    categories = categoryResult.data?.length ? categoryResult.data : fallbackCategories;
  } else {
    products = fallbackProducts.map(normalizeForListing);
  }

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const visibleProducts = selectedCategoryId
    ? products.filter((product) => product.category_id === selectedCategoryId)
    : products;

  return (
    <main className="bg-white min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <ProductListWithSearch products={visibleProducts} categoryName={selectedCategory?.name} />
      </section>
      <SiteFooter />
    </main>
  );
}
