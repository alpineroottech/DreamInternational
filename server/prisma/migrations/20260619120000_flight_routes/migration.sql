-- Flight ticketing routes (domestic & international)
CREATE TABLE "FlightRoute" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "fromAirport" TEXT,
    "toAirport" TEXT,
    "airline" TEXT,
    "flightDuration" TEXT,
    "frequency" TEXT,
    "priceFrom" DOUBLE PRECISION,
    "priceDisplay" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "highlights" JSONB,
    "baggageInfo" TEXT,
    "bookingNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "FlightRoute_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FlightRoute_slug_key" ON "FlightRoute"("slug");
