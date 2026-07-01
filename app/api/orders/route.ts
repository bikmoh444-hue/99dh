import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const items = body.items ?? [];
  if (!body.customer?.full_name || !body.customer?.phone || !body.customer?.city || !body.customer?.address || !items.length) {
    return NextResponse.json({ error: "Informations de commande incomplètes." }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const total = Number(body.total_amount);
  const subtotal = Number(body.subtotal ?? body.total_amount);
  const shippingFee = Number(body.shipping_fee ?? 0);

  if (!supabase) {
    return NextResponse.json({ id: crypto.randomUUID(), order_number: Math.floor(1000 + Math.random() * 9000) });
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert(body.customer)
    .select("id")
    .single();

  if (customerError) return NextResponse.json({ error: customerError.message }, { status: 500 });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      ...body.customer,
      total_amount: total,
      subtotal,
      shipping_fee: shippingFee,
      total,
      status: "en_attente"
    })
    .select("id, order_number")
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const rows = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(rows);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json(order);
}

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ orders: [] });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
