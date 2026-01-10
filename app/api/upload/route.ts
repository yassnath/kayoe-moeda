import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export const PUT = async (request: Request) => {
  const form = await request.formData();
  const file = form.get("file") as File;

  if (file.size === 0 || file.size === undefined) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }
  if (file.size > 4000000) {
    return NextResponse.json(
      { message: "File must be less than 4MB" },
      { status: 400 }
    );
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { message: "Format file tidak didukung. Gunakan .png, .jpg, .jpeg, atau .webp." },
      { status: 400 }
    );
  }
  const blob = await put(file.name, file, {
    access: "public",
    multipart: true,
  });
  return NextResponse.json(blob);
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl") as string;
  await del(imageUrl);
  return NextResponse.json({ status: 200 });
};
