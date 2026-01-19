import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  return parts[parts.length - 1] || "";
}

export async function GET(req: NextRequest) {
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

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Admin tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
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
    | {
        name?: string;
        isActive?: boolean;
      }
    | null;

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

  if (user.role === "OWNER" && body?.isActive === false) {
    return NextResponse.json(
      { message: "Owner tidak boleh dinonaktifkan." },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(typeof body?.name === "string" ? { name: body?.name } : {}),
      ...(typeof body?.isActive === "boolean" ? { isActive: body.isActive } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  return NextResponse.json(updated, { status: 200 });
}
