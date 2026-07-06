import type { Metadata } from "next";
import { Montserrat, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { WhatsappFloatButton } from "@/components/whatsapp-float-button";
import { getSiteSettings } from "@/lib/data";
import { getRequestLocale } from "@/lib/locale-server";

const geometricSans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geometric-sans"
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "199 DH Store",
    description: "Boutique marocaine a prix unique de 199 DH avec paiement a la livraison.",
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
      <body className={`${geometricSans.variable} ${naskh.variable}`}>
        <CartProvider>{children}</CartProvider>
        <WhatsappFloatButton />
      </body>
    </html>
  );
}
