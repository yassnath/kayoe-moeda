"use client";

import { usePathname } from "next/navigation";
import WhatsAppPopup from "@/components/whatsapp-popup";

export default function WhatsAppGate() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <WhatsAppPopup />;
}

