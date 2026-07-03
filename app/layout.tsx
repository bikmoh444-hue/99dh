import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { WhatsappFloatButton } from "@/components/whatsapp-float-button";
import { getSiteSettings } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "99 DH Store",
    description: "Boutique marocaine a prix unique de 99 DH avec paiement a la livraison.",
    icons: settings.logo_url
      ? {
          icon: [{ url: settings.logo_url }],
          apple: [{ url: settings.logo_url }]
        }
      : undefined
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body>
        <CartProvider>{children}</CartProvider>
        <WhatsappFloatButton />
      </body>
    </html>
  );
}
