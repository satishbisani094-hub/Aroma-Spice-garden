import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingActions = () => {
  const phoneNumber = '+919573145154';
  const whatsappNumber = '919573145154';
  const whatsappMessage = encodeURIComponent("Hello Aroma Spices! I'd like to ask about the menu / book a table.");

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
      {/* Call Now Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center h-12 w-12 rounded-full bg-primary border border-accent/40 text-white shadow-xl hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Call Restaurant Now"
      >
        <Phone className="h-5 w-5 text-accent group-hover:animate-pulse" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 fill-current group-hover:scale-105" />
      </a>
    </div>
  );
};

export default FloatingActions;
