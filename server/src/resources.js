import { z } from "zod";
import { buildResource } from "./lib/crudFactory.js";
import { transformTourCreate, transformTourUpdate } from "./lib/tourTransforms.js";

// ---- Shared Zod helpers ----
const status = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional();
const blogStatus = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional();
const slug = z.string().regex(/^[a-z0-9-]*$/, "Use lowercase letters, numbers and dashes").optional();
const str = z.string().optional().nullable();
const strArr = z.array(z.string()).optional().nullable();
const img = z.object({ url: z.string(), alt: z.string().optional() });
const imgArr = z.array(img).optional().nullable();
const bool = z.boolean().optional();
const int = z.number().int().optional().nullable();
const seo = {
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(180).optional().nullable(),
  ogImageUrl: str,
  canonicalUrl: str,
};

const itineraryDaySchema = z.object({
  dayNumber: z.number().int().optional(),
  title: z.string().min(1),
  description: str,
  startLocation: str,
  endLocation: str,
  altitudeM: z.number().int().optional().nullable(),
  notes: str,
  order: z.number().int().optional(),
});

const tourFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().optional(),
});

// ---- Per-resource configuration ----
const TourSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug,
  market: z.enum(["nepal", "international"]).optional(),
  shortDescription: str,
  description: str,
  highlights: strArr,
  categoryId: str,
  status,
  isFeatured: bool,
  basePrice: z.number().optional().nullable(),
  durationDays: int,
  durationNights: int,
  difficulty: str,
  maxAltitude: int,
  groupSizeMin: int,
  groupSizeMax: int,
  startPoint: str,
  endPoint: str,
  priceIncludes: strArr,
  priceExcludes: strArr,
  featuredImageUrl: str,
  featuredImageAlt: str,
  cardImageUrl: str,
  cardImageAlt: str,
  galleryImages: imgArr,
  videoUrl: str,
  itineraryDays: z.array(itineraryDaySchema).optional().nullable(),
  faqs: z.array(tourFaqSchema).optional().nullable(),
  ...seo,
});

const ActivitySchema = z.object({
  title: z.string().min(1),
  slug,
  shortDescription: str,
  description: str,
  price: str,
  duration: str,
  groupSize: str,
  difficulty: str,
  location: str,
  highlights: strArr,
  priceIncludes: strArr,
  priceExcludes: strArr,
  amenities: strArr,
  imageUrl: str,
  imageAlt: str,
  cardImageUrl: str,
  cardImageAlt: str,
  galleryImages: imgArr,
  status,
  isFeatured: bool,
  order: int,
  ...seo,
});

const ServiceSchema = z.object({
  title: z.string().min(1),
  slug,
  shortDescription: str,
  description: str,
  iconUrl: str,
  imageUrl: str,
  imageAlt: str,
  features: strArr,
  status,
  isFeatured: bool,
  order: int,
  ...seo,
});

const TeamSchema = z.object({
  name: z.string().min(1),
  slug,
  role: str,
  photoUrl: str,
  bio: str,
  expertise: strArr,
  socials: z.record(z.string(), z.string()).optional().nullable(),
  status,
  isFeatured: bool,
  order: int,
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(180).optional().nullable(),
});

const ResortSchema = z.object({
  title: z.string().min(1),
  slug,
  shortDescription: str,
  description: str,
  price: str,
  location: str,
  imageUrl: str,
  imageAlt: str,
  galleryImages: imgArr,
  amenities: strArr,
  status,
  isFeatured: bool,
  order: int,
  ...seo,
});

const BlogSchema = z.object({
  title: z.string().min(1),
  slug,
  excerpt: str,
  content: str,
  coverImageUrl: str,
  coverImageAlt: str,
  tags: strArr,
  status: blogStatus,
  scheduledAt: z.string().datetime().optional().nullable(),
  ...seo,
});

const CategorySchema = z.object({
  name: z.string().min(1),
  slug,
  type: z.enum(["tour", "blog"]).optional(),
  icon: str,
  imageUrl: str,
  description: str,
  order: int,
  isVisible: bool,
});

const BrandSchema = z.object({
  name: z.string().min(1),
  logoUrl: str,
  url: str,
  order: int,
  isVisible: bool,
});

const GallerySchema = z.object({
  title: str,
  imageUrl: z.string().min(1),
  imageAlt: str,
  category: str,
  order: int,
  isVisible: bool,
});

const CounterSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  suffix: str,
  icon: str,
  order: int,
  isVisible: bool,
});

const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: str,
  order: int,
  isVisible: bool,
});

const ReviewSchema = z.object({
  reviewerName: z.string().min(1),
  reviewerCountry: str,
  reviewerPhoto: str,
  rating: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().min(1),
  source: z.enum(["TRIPADVISOR", "GOOGLE", "DIRECT"]).optional(),
  sourceUrl: str,
  isFeatured: bool,
  isVisible: bool,
});

const FlightRouteSchema = z.object({
  title: z.string().min(1),
  slug,
  ticketType: z.enum(["domestic", "international"]),
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  fromAirport: str,
  toAirport: str,
  airline: str,
  flightDuration: str,
  frequency: str,
  priceFrom: z.number().optional().nullable(),
  priceDisplay: str,
  shortDescription: str,
  description: str,
  imageUrl: str,
  imageAlt: str,
  cardImageUrl: str,
  cardImageAlt: str,
  highlights: strArr,
  baggageInfo: str,
  bookingNotes: str,
  status,
  isFeatured: bool,
  order: int,
  ...seo,
});

const VehicleCategorySchema = z.object({
  name: z.string().min(1),
  slug,
  icon: str,
  order: int,
  isVisible: bool,
});

const VehicleRentalSchema = z.object({
  title: z.string().min(1),
  slug,
  categoryId: str,
  vehicleType: z.enum(["car", "jeep", "van", "bus", "driver-only"]).optional(),
  brandModel: str,
  seatingCapacity: int,
  transmission: str,
  fuelType: str,
  luggageCapacity: str,
  driverOptions: z.enum(["self-drive", "with-driver", "both"]).optional(),
  showPricing: bool,
  pricePerDay: z.number().optional().nullable(),
  pricePerDayDriver: z.number().optional().nullable(),
  priceNote: str,
  minRentalDays: int,
  shortDescription: str,
  description: str,
  highlights: strArr,
  priceIncludes: strArr,
  priceExcludes: strArr,
  featuredImageUrl: str,
  featuredImageAlt: str,
  cardImageUrl: str,
  cardImageAlt: str,
  galleryImages: imgArr,
  status,
  isFeatured: bool,
  order: int,
  ...seo,
});

const byOrder = [{ order: "asc" }, { createdAt: "desc" }];

// Each entry maps an API path to its resource config.
export const RESOURCES = {
  tours: {
    modelName: "tour",
    schema: TourSchema,
    slugFrom: "title",
    htmlFields: ["description"],
    filterQueryFields: ["market"],
    publicOrderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    publicInclude: {
      category: true,
      itineraryDays: { orderBy: { dayNumber: "asc" } },
    },
    adminInclude: {
      category: true,
      itineraryDays: { orderBy: { dayNumber: "asc" } },
      faqs: { orderBy: { order: "asc" } },
    },
    transformCreate: transformTourCreate,
    transformUpdate: transformTourUpdate,
    publicShape: (t) => ({
      ...t,
      itinerary: (t.itineraryDays || []).map((d) => ({
        title: d.title,
        description: d.description,
        activities: d.notes ? d.notes.split("\n").filter(Boolean) : [],
        startLocation: d.startLocation,
        endLocation: d.endLocation,
        altitudeM: d.altitudeM,
        distanceKm: d.distanceKm,
      })),
    }),
  },
  activities: { modelName: "activity", schema: ActivitySchema, slugFrom: "title", htmlFields: ["description"], publicOrderBy: byOrder },
  services: { modelName: "service", schema: ServiceSchema, slugFrom: "title", htmlFields: ["description"], publicOrderBy: byOrder },
  team: { modelName: "teamMember", schema: TeamSchema, slugFrom: "name", htmlFields: ["bio"], publicOrderBy: byOrder },
  resorts: { modelName: "resort", schema: ResortSchema, slugFrom: "title", htmlFields: ["description"], publicOrderBy: byOrder },
  blog: { modelName: "blogPost", schema: BlogSchema, slugFrom: "title", htmlFields: ["content"], publicOrderBy: [{ publishedAt: "desc" }] },
  categories: { modelName: "category", schema: CategorySchema, slugFrom: "name", hasStatus: false, hasVisibility: true, publicOrderBy: byOrder },
  brands: { modelName: "brand", schema: BrandSchema, hasStatus: false, hasVisibility: true, hasSlug: false, publicOrderBy: byOrder },
  gallery: { modelName: "galleryImage", schema: GallerySchema, hasStatus: false, hasVisibility: true, hasSlug: false, publicOrderBy: byOrder },
  counters: { modelName: "counter", schema: CounterSchema, hasStatus: false, hasVisibility: true, hasSlug: false, publicOrderBy: byOrder },
  faqs: { modelName: "faq", schema: FaqSchema, hasStatus: false, hasVisibility: true, hasSlug: false, htmlFields: ["answer"], publicOrderBy: byOrder },
  reviews: { modelName: "review", schema: ReviewSchema, hasStatus: false, hasVisibility: true, hasSlug: false, publicOrderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }] },
  "flight-routes": {
    modelName: "flightRoute",
    schema: FlightRouteSchema,
    slugFrom: "title",
    htmlFields: ["description", "bookingNotes"],
    filterQueryFields: ["ticketType"],
    publicOrderBy: [{ isFeatured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
  },
  "vehicle-categories": {
    modelName: "vehicleCategory",
    schema: VehicleCategorySchema,
    slugFrom: "name",
    hasStatus: false,
    hasVisibility: true,
    publicOrderBy: byOrder,
  },
  "vehicle-rentals": {
    modelName: "vehicleRental",
    schema: VehicleRentalSchema,
    slugFrom: "title",
    htmlFields: ["description"],
    filterQueryFields: ["vehicleType", "categoryId"],
    publicOrderBy: [{ isFeatured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
    publicInclude: { category: true },
    adminInclude: { category: true },
  },
};

// Mounts /api/public/:name and /api/admin/:name for every resource.
export function registerResources(app) {
  for (const [name, cfg] of Object.entries(RESOURCES)) {
    const { publicRouter, adminRouter } = buildResource(cfg);
    app.use(`/api/public/${name}`, publicRouter);
    app.use(`/api/admin/${name}`, adminRouter);
  }
}
