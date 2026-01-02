import React from "react";
import CreateForm from "@/components/admin/produk/create-form";
import { getAmenities } from "@/lib/data";

const Createproduk = async () => {
  const amenities = await getAmenities();
  if (!amenities) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New produk</h1>
      <CreateForm amenities={amenities} />
    </div>
  );
};

export default Createproduk;
