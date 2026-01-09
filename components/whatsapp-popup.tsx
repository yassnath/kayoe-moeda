"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IoLogoWhatsapp,
  IoClose,
  IoChatbubbleEllipses,
  IoSparkles,
} from "react-icons/io5";

const WhatsAppPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const phone = "085771753354";
  const encodedText = encodeURIComponent("Halo Kayoe Moeda, saya mau pesan.");

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-20 w-[calc(100vw-2rem)] max-w-xs sm:w-64 km-tile rounded-lg p-4 text-sm z-40">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-km-ink">Chat via WhatsApp</span>
            <button
              aria-label="Tutup popup WhatsApp"
              onClick={() => setIsOpen(false)}
              className="text-km-ink/40 hover:text-km-ink/70"
            >
              <IoClose className="size-5" />
            </button>
          </div>
          <p className="text-km-ink/70 mb-3">
            Hai! Butuh bantuan? Klik tombol di bawah untuk chat langsung.
          </p>
          <Link
            href={`https://wa.me/62${phone.slice(1)}?text=${encodedText}`}
            target="_blank"
            className="flex items-center justify-center gap-2 bg-km-sand ring-1 ring-km-line py-2 rounded-md hover:bg-km-clay"
          >
            <IoLogoWhatsapp className="size-5" />
            Mulai Chat
          </Link>
        </div>
      )}
      <Link
        href="/chat"
        aria-label="Buka Chatbot Kayoe Moeda"
        className="group fixed bottom-24 right-4 sm:right-6 bg-[#2563EB] text-white ring-1 ring-[#1D4ED8] hover:bg-[#1D4ED8] rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-[0_0_18px_rgba(37,99,235,0.5)] z-40 relative overflow-hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full ring-2 ring-white/15 group-hover:ring-white/35 transition"
        />
        <IoChatbubbleEllipses className="relative z-10 size-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
        <IoSparkles className="absolute z-10 right-3 top-3 size-3 text-white/80" />
      </Link>
      <button
        aria-label="Buka WhatsApp"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 bg-[#22C55E] text-white ring-1 ring-[#16A34A] hover:bg-[#16A34A] rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg z-40"
      >
        <IoLogoWhatsapp className="size-7" />
      </button>
    </>
  );
};

export default WhatsAppPopup;
