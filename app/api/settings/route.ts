import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";
import { fallbackSiteSettings } from "@/lib/data";
import { localizedValue } from "@/lib/i18n";
import type { FeatureItem } from "@/lib/types";

const defaultFeatures: FeatureItem[] = [
  { icon: "Truck", title: "Livraison rapide", subtitle: "24/48h partout" },
  { icon: "CreditCard", title: "Paiement à la livraison", subtitle: "Sécurité totale" },
  { icon: "PackageCheck", title: "Produits sélectionnés", subtitle: "Qualité premium" },
  { icon: "LockKeyhole", title: "Achat sécurisé", subtitle: "Données protégées" }
];

const translatableFields = [
  "whatsapp_message",
  "hero_badge_text",
  "hero_title",
  "hero_subtitle",
  "hero_description",
  "hero_cta_primary_text",
  "hero_cta_secondary_text"
] as const;

function normalizeSettingsResponse(settings: any) {
  const normalized = { ...settings };
  for (const field of translatableFields) {
    normalized[field] = localizedValue(normalized[field]);
  }
  normalized.features = Array.isArray(normalized.features)
    ? normalized.features.map((feature: any) => ({
        ...feature,
        title: localizedValue(feature.title),
        subtitle: localizedValue(feature.subtitle)
      }))
    : defaultFeatures;
  return normalized;
}

function toStorageValue(value: unknown) {
  if (!value || typeof value === "string") return value ?? "";
  if (typeof value === "object") return JSON.stringify(value);
  return "";
}

export async function GET() {
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ settings: normalizeSettingsResponse(fallbackSiteSettings) });
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ settings: normalizeSettingsResponse(fallbackSiteSettings) });
  return NextResponse.json({
    settings: normalizeSettingsResponse({
      ...fallbackSiteSettings,
      ...data,
      shipping_fee: Number(data.shipping_fee ?? 0),
      features: Array.isArray(data.features) ? data.features : defaultFeatures
    })
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const supabase = createAdminSupabase();
  if (!supabase) return NextResponse.json({ settings: normalizeSettingsResponse({ ...fallbackSiteSettings, ...body, id: 1 }) });

  const features = Array.isArray(body.features) ? body.features : defaultFeatures;
  const payload = {
    id: 1,
    shipping_fee: Number(body.shipping_fee ?? 0),
    whatsapp_number: body.whatsapp_number ?? "",
    phone_number: body.phone_number ?? "",
    contact_email: body.contact_email ?? "",
    instagram_url: body.instagram_url ?? "",
    facebook_url: body.facebook_url ?? "",
    whatsapp_message: toStorageValue(body.whatsapp_message),
    show_testimonials: Boolean(body.show_testimonials),
    logo_url: body.logo_url ?? "",
    hero_badge_text: toStorageValue(body.hero_badge_text),
    hero_title: toStorageValue(body.hero_title),
    hero_subtitle: toStorageValue(body.hero_subtitle),
    hero_description: toStorageValue(body.hero_description),
    hero_image_url: body.hero_image_url ?? "",
    hero_cta_primary_text: toStorageValue(body.hero_cta_primary_text),
    hero_cta_primary_link: body.hero_cta_primary_link ?? "",
    hero_cta_secondary_text: toStorageValue(body.hero_cta_secondary_text),
    hero_cta_secondary_link: body.hero_cta_secondary_link ?? "",
    features
  };
  const { data, error } = await supabase.from("site_settings").upsert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    settings: normalizeSettingsResponse({
      ...data,
      shipping_fee: Number(data.shipping_fee ?? 0),
      features: Array.isArray(data.features) ? data.features : defaultFeatures
    })
  });
}

export const POST = PUT;
