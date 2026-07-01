import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ products: [] });
  const { data, error } = await supabase.from("products").select("*, categories(name), product_images(id, image_url, position)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    products: data?.map((item: any) => {
      const images = [...(item.product_images ?? [])].sort((a: any, b: any) => a.position - b.position).map((image: any) => image.image_url);
      return { ...item, image_url: images[0] ?? item.image_url, images, category: item.categories?.name };
    }) ?? []
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ product: { ...body, id: crypto.randomUUID() } });

  const { image_urls, ...productPayload } = body;
  productPayload.images = image_urls ?? [];
  productPayload.specs = body.specs ?? [];
  const { data, error } = await supabase.from("products").insert(productPayload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (Array.isArray(image_urls) && image_urls.length) {
    const rows = image_urls.map((image_url: string, position: number) => ({ product_id: data.id, image_url, position }));
    const { error: imageError } = await supabase.from("product_images").insert(rows);
    if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 });
  }
  return NextResponse.json({ product: { ...data, image_url: image_urls?.[0], images: image_urls ?? [] } });
}
