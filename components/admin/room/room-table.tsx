import Image from "next/image";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getproduks } from "@/lib/data";
import { DeleteButton, EditButton } from "./button";

const produkTable = async () => {
  const produks = await getproduks();
  if (!produks?.length) return <p>No produk Found</p>;

  return (
    <div className="bg-white p-4 mt-5 shadow-sm">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 w-32 text-xs font-bold text-gray-700 uppercase text-left">
              Image
            </th>
            <th className="px-6 py-3 text-xs font-bold text-gray-700 uppercase text-left">
              produk Name
            </th>
            <th className="px-6 py-3 text-xs font-bold text-gray-700 uppercase text-left">
              Price
            </th>
            <th className="px-6 py-3 text-xs font-bold text-gray-700 uppercase text-left">
              Created At
            </th>
            <th className="px-6 py-3 text-xs font-bold text-gray-700 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {produks.map((produk) => (
            <tr className="hover:bg-gray-100" key={produk.id}>
              <td className="px-6 py-4">
                <div className="h-20 w-32 relative">
                  <Image
                    src={produk.image}
                    fill
                    sizes="20vw"
                    alt="produk image"
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4">{produk.name}</td>
              <td className="px-6 py-4">{formatCurrency(produk.price)}</td>
              <td className="px-6 py-4">
                {formatDate(produk.createdAt.toString())}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-center gap-1">
                  <EditButton id={produk.id} />
                  <DeleteButton id={produk.id} image={produk.image} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default produkTable;
