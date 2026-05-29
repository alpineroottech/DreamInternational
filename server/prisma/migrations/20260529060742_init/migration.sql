-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'tour',
    "icon" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT,
    "galleryImages" JSONB,
    "bestTimeToVisit" TEXT,
    "gettingThere" TEXT,
    "tips" TEXT,
    "thingsToDo" JSONB,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "highlights" JSONB,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "basePrice" REAL,
    "pricingTiers" JSONB,
    "priceIncludes" JSONB,
    "priceExcludes" JSONB,
    "durationDays" INTEGER,
    "durationNights" INTEGER,
    "difficulty" TEXT,
    "maxAltitude" INTEGER,
    "groupSizeMin" INTEGER,
    "groupSizeMax" INTEGER,
    "minAge" INTEGER,
    "startPoint" TEXT,
    "endPoint" TEXT,
    "accommodationTypes" JSONB,
    "bestMonths" JSONB,
    "featuredImageUrl" TEXT,
    "featuredImageAlt" TEXT,
    "galleryImages" JSONB,
    "mapImageUrl" TEXT,
    "videoUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "Tour_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startLocation" TEXT,
    "endLocation" TEXT,
    "altitudeM" INTEGER,
    "accommodation" TEXT,
    "mealsIncluded" JSONB,
    "distanceKm" REAL,
    "walkTimeHrs" REAL,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ItineraryDay_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TourFAQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TourFAQ_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverImageUrl" TEXT,
    "coverImageAlt" TEXT,
    "authorId" TEXT,
    "categoryId" TEXT,
    "tags" JSONB,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" DATETIME,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'STANDARD',
    "tourId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "nationality" TEXT,
    "travelDates" TEXT,
    "groupSize" INTEGER,
    "customDetails" JSONB,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inquiry_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewerName" TEXT NOT NULL,
    "reviewerCountry" TEXT,
    "reviewerPhoto" TEXT,
    "tourId" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "reviewText" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'DIRECT',
    "sourceUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "fileName" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "tags" JSONB,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT,
    "type" TEXT NOT NULL DEFAULT 'string',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");
