-- Add detailed fields to Activity model
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "duration"      TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "groupSize"     TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "difficulty"    TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "location"      TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "highlights"    JSONB;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "priceIncludes" JSONB;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "priceExcludes" JSONB;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "amenities"     JSONB;
