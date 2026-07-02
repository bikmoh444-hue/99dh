import { NextResponse } from "next/server";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { full_name, email, message } = body;

  if (!full_name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    console.error("[contact] createServerSupabase returned null — check env vars");
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase.from("contact_messages").insert({
    full_name: full_name.trim(),
    email: email.trim(),
    message: message.trim()
  });

  if (error) {
    console.error("[contact] insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, is_read } = body;
  if (!id) return NextResponse.json({ error: "ID requis." }, { status: 400 });

  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ ok: true });
  const { error } = await supabase.from("contact_messages").update({ is_read: Boolean(is_read) }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ messages: [] });
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}
