import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ product: { ...body, id } });

  const images = Array.isArray(body.images) ? body.images : [];
  const specs = Array.isArray(body.specs) ? body.specs : [];
  const { error } = await supabase
    .from("products")
    .update({
      name: body.name,
      description: body.description,
      category_id: body.category_id,
      stock: Number(body.stock ?? 0),
      is_active: Boolean(body.is_active),
      is_flash_sale: Boolean(body.is_flash_sale),
      flash_sale_end: body.flash_sale_end || null,
      images,
      specs
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("product_images").delete().eq("product_id", id);
  if (images.length) {
    const rows = images.map((image_url: string, position: number) => ({ product_id: id, image_url, position }));
    const { error: imageError } = await supabase.from("product_images").insert(rows);
    if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ ok: true });
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
