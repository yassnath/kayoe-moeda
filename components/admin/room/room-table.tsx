import Image from "next/image";
import { formatDate, formatCurrency, resolveImageSrc } from "@/lib/utils";
import { getproduks } from "@/lib/data";
import { DeleteButton, EditButton } from "./button";

const produkTable = async () => {
  const produks = await getproduks();
  if (!produks?.length) return <p>No produk Found</p>;

  return (
    <div className="bg-white p-4 mt-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 w-32 text-xs font-bold text-gray-700 uppercase text-left">
                Image
              </th>
              <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-left">
                produk Name
              </th>
              <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-left">
                Price
              </th>
              <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-left">
                Created At
              </th>
              <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {produks.map((produk) => {
              const imageSrc = resolveImageSrc(produk.image);

              return (
                <tr className="hover:bg-gray-100" key={produk.id}>
                  <td className="px-3 py-2">
                    <div className="h-20 w-32 relative">
                      <Image
                        src={imageSrc}
                        fill
                        sizes="20vw"
                        alt="produk image"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">{produk.name}</td>
                  <td className="px-3 py-2">{formatCurrency(produk.price)}</td>
                  <td className="px-3 py-2">
                    {formatDate(produk.createdAt.toString())}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <EditButton id={produk.id} />
                      <DeleteButton id={produk.id} image={produk.image} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default produkTable;
