import { MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export async function WhatsappFloatButton() {
  const settings = await getSiteSettings();
  if (!settings.whatsapp_number) return null;
  const phone = settings.whatsapp_number.replace(/[^\d]/g, "");
  const message = encodeURIComponent(settings.whatsapp_message || "");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white shadow-soft"
      aria-label="WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
