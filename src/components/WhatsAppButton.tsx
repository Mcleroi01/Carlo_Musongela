import { MessageCircle } from "lucide-react";
import { useI18n } from "../i18n/context";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({
  phoneNumber = "1234567890", // Replace with your actual WhatsApp number
  message,
}: WhatsAppButtonProps) {
  const { t } = useI18n();
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message ?? t.whatsapp.message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label={t.whatsapp.label}
      title={t.whatsapp.label}
    >
      <MessageCircle size={28} />
      <span className="absolute right-16 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {t.whatsapp.tooltip}
      </span>
    </button>
  );
}
