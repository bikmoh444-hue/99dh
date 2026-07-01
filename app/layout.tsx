import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { WhatsappFloatButton } from "@/components/whatsapp-float-button";

export const metadata: Metadata = {
  title: "99 DH Store",
  description: "Boutique marocaine à prix unique de 99 DH avec paiement à la livraison."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>{children}</CartProvider>
        <WhatsappFloatButton />
      </body>
    </html>
  );
}
