-- Add pricing fields to destinations
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "price" TEXT;
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "basePrice" DOUBLE PRECISION;
