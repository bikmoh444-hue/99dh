import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ category: { ...body, id } });

  const { error } = await supabase
    .from("categories")
    .update({
      name: body.name,
      slug: body.slug,
      icon: body.icon ?? "ShoppingBag"
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ ok: true });
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
