import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ categories: [] });
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ category: { ...body, id: crypto.randomUUID() } });

  const { data, error } = await supabase.from("categories").insert({
    name: body.name,
    slug: body.slug,
    icon: body.icon ?? "ShoppingBag"
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}
