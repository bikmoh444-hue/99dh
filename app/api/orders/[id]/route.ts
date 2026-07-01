import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const { id } = await params;
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ ok: true });

  const updates: Record<string, string | null> = {};
  if (body.status) updates.status = body.status;
  if ("admin_note" in body) updates.admin_note = body.admin_note;
  const { error } = await supabase.from("orders").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
