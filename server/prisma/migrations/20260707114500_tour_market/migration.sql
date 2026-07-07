-- Add tour market: nepal (inbound) | international (outbound from Nepal)
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "market" TEXT NOT NULL DEFAULT 'nepal';
