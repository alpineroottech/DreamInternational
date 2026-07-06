-- Separate listing-card images from detail-page hero images.
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "cardImageUrl" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "cardImageAlt" TEXT;

ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "cardImageUrl" TEXT;
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "cardImageAlt" TEXT;

ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "cardImageUrl" TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "cardImageAlt" TEXT;

ALTER TABLE "FlightRoute" ADD COLUMN IF NOT EXISTS "cardImageUrl" TEXT;
ALTER TABLE "FlightRoute" ADD COLUMN IF NOT EXISTS "cardImageAlt" TEXT;
