import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ testimonials: [] });
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ testimonial: { ...body, id: crypto.randomUUID() } });
  const { data, error } = await supabase.from("testimonials").insert(body).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...payload } = body;
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ testimonial: body });
  const { data, error } = await supabase.from("testimonials").update(payload).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  const supabase = createAdminSupabase();
  if (!supabase || !id) return NextResponse.json({ ok: true });
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
