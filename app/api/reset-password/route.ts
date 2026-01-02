// app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body as {
      token?: string;
      password?: string;
    };

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Cari token di tabel PasswordResetToken
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Token reset password tidak valid." },
        { status: 400 }
      );
    }

    // Cek expired (field: expires)
    if (tokenRecord.expires < new Date()) {
      // Hapus token yang kadaluarsa
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { message: "Token reset password sudah kadaluarsa." },
        { status: 400 }
      );
    }

    // Hash password baru
    const hashed = await bcrypt.hash(password, 10);

    // Update password user
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashed },
    });

    // Hapus semua token milik user ini (supaya tidak bisa dipakai lagi)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: tokenRecord.userId },
    });

    return NextResponse.json(
      { message: "Password berhasil direset. Silakan login kembali." },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
