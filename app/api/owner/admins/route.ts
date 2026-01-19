import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

async function requireOwner() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "OWNER") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json(
      { message: "Tidak memiliki akses" },
      { status: 403 }
    );
  }

  const users = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "OWNER"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json(
      { message: "Tidak memiliki akses" },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        username?: string;
        password?: string;
        role?: string;
        isActive?: boolean;
      }
    | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const username = body?.username?.trim();
  const password = body?.password ?? "";

  if (!name || !email || !username) {
    return NextResponse.json(
      { message: "Nama, email, dan username wajib diisi." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password minimal 8 karakter." },
      { status: 400 }
    );
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashed,
        role: "ADMIN",
        isActive: body?.isActive ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Email atau username sudah digunakan." },
        { status: 400 }
      );
    }
    console.error("POST /api/owner/admins error:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan admin." },
      { status: 500 }
    );
  }
}
