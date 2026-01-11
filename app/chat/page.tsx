"use client";

import { useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_REPLIES = [
  "Lihat produk",
  "Cara custom",
  "Estimasi harga",
  "Pengiriman",
];

export default function ChatPage() {
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

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
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
            content: "Maaf, ada kendala saat memproses pesan. Silakan coba lagi.",
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
          content: "Maaf, ada kendala jaringan. Silakan coba lagi beberapa saat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <section className="w-full py-12 lg:py-16">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
          <div className="rounded-3xl border border-km-line bg-white shadow-soft overflow-hidden flex flex-col min-h-[70vh]">
            <div className="border-b border-km-line px-6 py-5">
              <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
                Chatbot
              </p>
              <h1 className="mt-2 text-xl md:text-2xl font-semibold text-km-ink">
                Kayoe Moeda Assistant
              </h1>
              <p className="mt-1 text-sm text-km-ink/60 max-w-2xl">
                Jawaban otomatis untuk pertanyaan dasar dan bantuan pemesanan.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="rounded-full border border-km-line bg-km-surface-alt px-4 py-2 text-xs font-semibold
                               text-km-ink hover:bg-km-sand transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                      msg.role === "user"
                        ? "bg-km-wood text-white border-km-wood"
                        : "bg-km-surface-alt text-km-ink border-km-line"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-km-ink/50">Chatbot sedang mengetik...</div>
              )}
            </div>

            <div className="border-t border-km-line px-6 py-5 bg-white sticky bottom-0">
              {error && (
                <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  className="flex-1 rounded-2xl border border-km-line bg-white px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-km-brass/60"
                  placeholder="Tulis pertanyaan Anda..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!canSend}
                  className="rounded-2xl bg-km-wood text-white ring-1 ring-km-wood px-4 py-3 text-sm font-semibold
                             hover:opacity-90 transition disabled:opacity-60"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
