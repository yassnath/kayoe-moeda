// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// handlers berisi { GET, POST } dari konfigurasi NextAuth v5 di auth.ts
// Di sini kita ekspor ulang agar Next.js bisa memanggilnya
export const { GET, POST } = handlers;
