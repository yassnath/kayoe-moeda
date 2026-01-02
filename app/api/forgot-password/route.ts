// app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi." },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Jangan bocorkan bahwa email tidak terdaftar
      return NextResponse.json(
        {
          message:
            "Jika email terdaftar, link reset password akan dikirim ke email tersebut.",
        },
        { status: 200 }
      );
    }

    // Hapus token lama milik user ini (kalau ada)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate token baru
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 menit

    // Simpan token ke tabel PasswordResetToken
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires, // <-- field di schema
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Konfigurasi transporter Nodemailer
    const port = Number(process.env.EMAIL_SERVER_PORT || "465");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const from =
      process.env.EMAIL_FROM || 'Kaluna Living <no-reply@example.com>';

    await transporter.sendMail({
      from,
      to: email,
      subject: "Reset Password - Kaluna Living",
      html: `
        <p>Halo ${user.name || ""},</p>
        <p>Kami menerima permintaan reset password untuk akun Kaluna Living Anda.</p>
        <p>Silakan klik link berikut untuk mengatur password baru (berlaku 30 menit):</p>
        <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <p>Terima kasih,<br/>Kaluna Living</p>
      `,
    });

    return NextResponse.json(
      {
        message:
          "Jika email terdaftar, link reset password sudah dikirim ke email Anda.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
