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

function getIdFromRequest(req: NextRequest): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 2] || "";
}

export async function PATCH(req: NextRequest) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json(
      { message: "Tidak memiliki akses" },
      { status: 403 }
    );
  }

  const id = getIdFromRequest(req);
  if (!id) {
    return NextResponse.json(
      { message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { password?: string }
    | null;

  const password = body?.password ?? "";
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password minimal 8 karakter." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Admin tidak ditemukan." },
      { status: 404 }
    );
  }

  if (user.role === "OWNER") {
    return NextResponse.json(
      { message: "Owner tidak boleh direset password lewat fitur ini." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
