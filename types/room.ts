import { Prisma } from "@prisma/client";

export type produkProps = Prisma.produkGetPayload<{
  include: { produkAmenities: { select: { amenitiesId: true } } };
}>;

export type produkProps2 = Prisma.produkGetPayload<{
  include: {
    produkAmenities: {
      include: {
        Amenities: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export type DisabledDateProps = Prisma.ReservationGetPayload<{
  select: {
    starDate: true;
    endDate: true;
  };
}>;
