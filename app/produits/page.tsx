import { createServerSupabase } from "@/lib/supabase";
import { products as fallbackProducts } from "@/lib/mock-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductListWithSearch } from "@/components/product-list-with-search";
import type { Product } from "@/lib/types";

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

export default async function ProductsPage() {
  const supabase = createServerSupabase();
  let products: Product[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name), product_images(image_url, position)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    products = (data ?? []).map(normalizeForListing);
  } else {
    products = fallbackProducts.map(normalizeForListing);
  }

  return (
    <main className="bg-white min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <ProductListWithSearch products={products} />
      </section>
      <SiteFooter />
    </main>
  );
}
