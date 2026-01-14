-- Add payment proof fields to order
ALTER TABLE "order"
ADD COLUMN "paymentProofUrl" TEXT,
ADD COLUMN "paymentProofUploadedAt" TIMESTAMP(3);
