-- CreateEnum
CREATE TYPE "ProdukStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "room" ADD COLUMN "status" "ProdukStatus" NOT NULL DEFAULT 'ACTIVE';
