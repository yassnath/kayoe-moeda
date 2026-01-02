import React from "react";
import { getAmenities, getprodukDetailById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditForm from "@/components/admin/room/edit-form";

const Editproduk = async ({ produkId }: { produkId: string }) => {
  const [amenities, produk] = await Promise.all([
    getAmenities(),
    getprodukDetailById(produkId),
  ]);
  if (!produk) return notFound();
  if (!amenities) return null;

  // console.log(produk);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Produk</h1>
      <EditForm amenities={amenities} produk={produk} />
    </div>
  );
};

export default Editproduk;
