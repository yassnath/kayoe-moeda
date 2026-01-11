import Image from "next/image";
import Link from "next/link";
import { IoPeopleOutline } from "react-icons/io5";
import type { Produk } from "@prisma/client";
import { formatCurrency, resolveImageSrc } from "@/lib/utils";

const Card = ({ produk }: { produk: Produk }) => {
  const imageSrc = resolveImageSrc(produk.image);

  return (
    <div className="km-tile rounded-3xl transition duration-150">
      {/* image waraper */}
      <div className="h-[260px] w-auto rounded-t-3xl relative">
        <Image
          src={imageSrc}
          width={384}
          height={256}
          alt="blog 1"
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </div>
      {/* Icons Wraper */}
      <div className="p-8">
        <h4 className="text-2xl font-semibold text-km-ink">
          <Link
            href={`/produk/${produk.id}`}
            className="hover:opacity-80 transition duration-150"
          >
            {produk.name}
          </Link>
        </h4>
        <h4 className="text-xl mb-7">
          <span className="font-semibold text-km-ink">
            {formatCurrency(produk.price)}
          </span>
          <span className="text-km-ink/55 text-sm">/Night</span>
        </h4>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-km-ink/70">
            <IoPeopleOutline />
            <span>
              {produk.capacity} {produk.capacity === 1 ? "person" : "people"}
            </span>
          </div>
          <Link
            href={`/produk/${produk.id}`}
            className="rounded-full bg-km-wood px-6 py-2.5 md:px-10 md:py-3 text-sm font-semibold text-white
                       ring-1 ring-km-wood hover:opacity-90 transition duration-150"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
