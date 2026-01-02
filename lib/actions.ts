"use server";
import { produkSchema, ReserveSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { differenceInCalendarDays } from "date-fns";

// save produk
export const saveproduk = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Image is required." };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    amenities: formData.getAll("amenities"),
  };

  const validatedFields = produkSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, capacity, amenities } =
    validatedFields.data;

  try {
    await prisma.produk.create({
      data: {
        name,
        description,
        image,
        price,
        capacity,
        produkAmenities: {
          createMany: {
            data: amenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
  redirect("/admin/produk");
};

// Update produk
export const updateproduk = async (
  image: string,
  produkId: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Image is required." };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    amenities: formData.getAll("amenities"),
  };

  const validatedFields = produkSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, capacity, amenities } =
    validatedFields.data;

  try {
    await prisma.$transaction([
      prisma.produk.update({
        where: { id: produkId },
        data: {
          name,
          description,
          image,
          price,
          capacity,
          produkAmenities: {
            deleteMany: {},
          },
        },
      }),
      // Insert new produk amenities
      prisma.produkAmenities.createMany({
        data: amenities.map((item) => ({
          produkId,
          amenitiesId: item,
        })),
      }),
    ]);
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/admin/produk");
  redirect("/admin/produk");
};

// Delete produk
export const deleteproduk = async (id: string, image: string) => {
  try {
    await del(image);
    await prisma.produk.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/admin/produk");
};

//Creare new Reserve
export const createReserve = async (
  produkId: string,
  price: number,
  startDate: Date,
  endDate: Date,
  prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    redirect(`/signin?redirect_url=produk/${produkId}`);

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
  };

  const validatedFields = ReserveSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, phone } = validatedFields.data;
  const night = differenceInCalendarDays(endDate, startDate);
  if (night <= 0) return { messageDate: "Date must be at least 1 night" };
  const total = night * price;

  let reservationId;
  try {
    await prisma.$transaction(async (tx) => {
      //update user
      await tx.user.update({
        data: {
          name,
          phone,
        },
        where: { id: session.user.id },
      });
      // insert reservation
      const reservation = await tx.reservation.create({
        data: {
          starDate: startDate,
          endDate: endDate,
          price: price,
          produkId: produkId,
          userId: session.user.id as string,
          Payment: {
            create: {
              amount: total,
            },
          },
        },
      });
      reservationId = reservation.id;
    });
  } catch (error) {
    console.log(error);
  }
  redirect(`/checkout/${reservationId}`);
};
