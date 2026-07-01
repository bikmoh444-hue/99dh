import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";
import { fallbackSiteSettings } from "@/lib/data";

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ settings: fallbackSiteSettings });
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data ?? fallbackSiteSettings });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ settings: { ...fallbackSiteSettings, ...body, id: 1 } });

  const payload = {
    id: 1,
    shipping_fee: Number(body.shipping_fee ?? 0),
    whatsapp_number: body.whatsapp_number ?? "",
    phone_number: body.phone_number ?? "",
    contact_email: body.contact_email ?? "",
    instagram_url: body.instagram_url ?? "",
    facebook_url: body.facebook_url ?? "",
    whatsapp_message: body.whatsapp_message ?? "",
    show_testimonials: Boolean(body.show_testimonials)
  };
  const { data, error } = await supabase.from("site_settings").upsert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export const POST = PUT;
