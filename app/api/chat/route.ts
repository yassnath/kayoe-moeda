import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
};

export async function POST(req: Request) {
  try {
    const rawApiKey = process.env.CEREBRAS_API_KEY ?? "";
    const apiKey = rawApiKey.trim().replace(/^['"]|['"]$/g, "");
    if (!apiKey) {
      return NextResponse.json(
        { message: "CEREBRAS_API_KEY belum di-set." },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as ChatRequest;
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { message: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const systemPrompt: ChatMessage = {
      role: "system",
      content:
        "Kamu adalah chatbot Kayoe Moeda, perusahaan mebel yang membuat kursi, meja, lemari, rak, dan perabotan kayu lainnya. " +
        "Jawab hanya tentang produk mebel, custom order, bahan, ukuran, finishing, harga estimasi, dan proses pemesanan Kayoe Moeda. " +
        "Jika pertanyaan di luar konteks (elektronik, makanan, pakaian, dll), tolak dengan sopan dan arahkan ke produk mebel Kayoe Moeda. " +
        "Gunakan Bahasa Indonesia yang sopan dan ringkas.",
    };

    const model = (process.env.CEREBRAS_MODEL || "llama3.1-8b").trim();

    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        temperature: 0.6,
        max_tokens: 512,
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        "Gagal memproses chat.";
      console.error("CEREBRAS API ERROR:", res.status, data);
      return NextResponse.json(
        { message: errorMessage },
        { status: res.status || 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content ??
      "Maaf, saya belum bisa menjawab saat ini.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses chat." },
      { status: 500 }
    );
  }
}
