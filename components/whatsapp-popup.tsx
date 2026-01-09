"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoLogoWhatsapp,
  IoChatbubbleEllipses,
  IoSparkles,
} from "react-icons/io5";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const WhatsAppPopup = () => {
  const phone = "085771753354";
  const encodedText = encodeURIComponent("Halo Kayoe Moeda, saya mau pesan.");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya chatbot Kayoe Moeda. Silakan tanya seputar produk, custom order, atau proses pemesanan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isChatOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Gagal memproses chat.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Maaf, ada kendala saat memproses pesan. Silakan coba lagi.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Baik, saya bantu." },
      ]);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menghubungi chatbot.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, ada kendala jaringan. Silakan coba lagi beberapa saat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isChatOpen && (
        <div className="km-fab-right bottom-40 w-[calc(100vw-3.5rem)] max-w-[320px] km-chat-shell ring-1 ring-km-line rounded-2xl p-0 text-sm z-40 overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 bg-white/5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                Chatbot
              </p>
              <p className="text-sm font-semibold text-white">
                Kayoe Moeda Assistant
              </p>
              <p className="text-xs text-white/70">
                Tanyakan produk &amp; pemesanan.
              </p>
            </div>
            <button
              aria-label="Tutup chatbot"
              onClick={() => setIsChatOpen(false)}
              className="text-white/60 hover:text-white transition"
            >
              <IoClose className="size-5" />
            </button>
          </div>

          <div className="px-4 py-3 space-y-3 max-h-[38vh] overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed text-km-ink ${
                    msg.role === "user"
                      ? "bg-km-sand ring-1 ring-km-line"
                      : "bg-km-paper ring-1 ring-km-line"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-km-line px-4 py-3">
            {error && (
              <div className="mb-2 rounded-2xl bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-xs">
                {error}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-2xl border border-km-line bg-km-paper px-3 py-2 text-xs text-km-ink placeholder:text-km-ink/60 focus:outline-none focus:ring-2 focus:ring-km-caramel/70"
                placeholder="Tulis pertanyaan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="rounded-2xl bg-km-wood text-km-cream ring-1 ring-km-wood px-3 py-2 text-xs font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "..." : "Kirim"}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-white/60">
              Untuk respon cepat, gunakan WhatsApp.
            </p>
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label="Buka Chatbot Kayoe Moeda"
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="km-fab-right group bottom-24 bg-[#2563EB] text-white ring-1 ring-[#1D4ED8] hover:bg-[#1D4ED8] rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_18px_rgba(37,99,235,0.5)] z-40 relative overflow-hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full ring-2 ring-white/15 group-hover:ring-white/35 transition"
        />
        <IoChatbubbleEllipses className="relative z-10 size-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
        <IoSparkles className="absolute z-10 right-3 top-3 size-3 text-white/80" />
      </button>
      <Link
        href={`https://wa.me/62${phone.slice(1)}?text=${encodedText}`}
        aria-label="Buka WhatsApp"
        target="_blank"
        className="km-fab-right bottom-6 bg-[#22C55E] text-white ring-1 ring-[#16A34A] hover:bg-[#16A34A] rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-40"
      >
        <IoLogoWhatsapp className="size-7" />
      </Link>
    </>
  );
};

export default WhatsAppPopup;
