// Declarative configuration for every CMS content type.
// The generic ResourceList + ResourceEditor render entirely from this.

const STATUS_OPTS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const seoTab = {
  name: "SEO",
  fields: [
    { name: "seoTitle", label: "SEO title", type: "text", max: 70, counter: 60 },
    { name: "seoDescription", label: "Meta description", type: "textarea", max: 180, counter: 160 },
    { name: "ogImageUrl", label: "Social share image", type: "image" },
  ],
};

const statusCol = {
  key: "status",
  label: "Status",
  render: (v) => `<span class="di-badge-status di-badge-${v}">${v}</span>`,
  badge: true,
};
const visibleCol = { key: "isVisible", label: "Visible", type: "bool" };
const featuredCol = { key: "isFeatured", label: "Featured", type: "bool" };

export const RESOURCE_CONFIG = {
  tours: {
    label: "Tours",
    singular: "Tour",
    apiPath: "tours",
    titleField: "title",
    icon: "solar:mountains-outline",
    hasSlug: true,
    listColumns: [{ key: "title", label: "Title" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          {
            name: "market",
            label: "Market",
            type: "select",
            options: [
              { value: "nepal", label: "Nepal experiences (inbound)" },
              { value: "international", label: "International holidays (outbound)" },
            ],
          },
          { name: "categoryId", label: "Category", type: "reference", refResource: "categories", refLabel: "name" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Details & Pricing",
        fields: [
          { name: "basePrice", label: "Base price (USD)", type: "number" },
          { name: "durationDays", label: "Duration (days)", type: "number" },
          { name: "durationNights", label: "Nights", type: "number" },
          { name: "difficulty", label: "Difficulty", type: "select", options: ["EASY", "MODERATE", "STRENUOUS", "CHALLENGING"].map((v) => ({ value: v, label: v })) },
          { name: "startPoint", label: "Start point", type: "text" },
          { name: "endPoint", label: "End point", type: "text" },
          { name: "highlights", label: "Highlights", type: "stringList" },
          { name: "priceIncludes", label: "Price includes", type: "stringList" },
          { name: "priceExcludes", label: "Price excludes", type: "stringList" },
        ],
      },
      {
        name: "Content",
        fields: [
          { name: "description", label: "Full description", type: "richtext" },
        ],
      },
      {
        name: "Itinerary",
        fields: [
          { name: "_hintItin", label: "hint", type: "_hint", hint: "Add one row per trek/tour day. Changes here replace the full itinerary when you save." },
          { name: "itineraryDays", label: "Itinerary days", type: "itineraryDays" },
        ],
      },
      {
        name: "FAQs",
        fields: [
          { name: "faqs", label: "Frequently asked questions", type: "tourFaqs" },
        ],
      },
      {
        name: "Media",
        fields: [
          { name: "_hintCard", label: "hint", type: "_hint", hint: "Upload any high-resolution image — the CMS automatically resizes card images to 424×274 and featured images to 1200×800 for you." },
          { name: "cardImageUrl", label: "Card image (listing tile)", type: "image" },
          { name: "cardImageAlt", label: "Card image alt", type: "text" },
          { name: "featuredImageUrl", label: "Featured image (detail page)", type: "image" },
          { name: "featuredImageAlt", label: "Featured image alt text", type: "text" },
          { name: "galleryImages", label: "Gallery (detail page slider)", type: "gallery" },
          { name: "videoUrl", label: "Video URL", type: "text" },
        ],
      },
      seoTab,
    ],
  },

  activities: {
    label: "Activities",
    singular: "Activity",
    apiPath: "activities",
    titleField: "title",
    icon: "solar:running-2-outline",
    hasSlug: true,
    listColumns: [{ key: "title", label: "Title" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "price", label: "Price (display text, e.g. $45 per person)", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Details",
        fields: [
          { name: "duration", label: "Duration (e.g. Full day, 8h)", type: "text" },
          { name: "groupSize", label: "Group size (e.g. 2–12 people)", type: "text" },
          { name: "difficulty", label: "Difficulty", type: "select", options: ["EASY", "MODERATE", "STRENUOUS"].map(v => ({ value: v, label: v })) },
          { name: "highlights", label: "Highlights", type: "stringList" },
          { name: "amenities", label: "What's included", type: "stringList" },
          { name: "priceIncludes", label: "Price includes", type: "stringList" },
          { name: "priceExcludes", label: "Price excludes", type: "stringList" },
        ],
      },
      { name: "Content", fields: [{ name: "description", label: "Description", type: "richtext" }] },
      {
        name: "Media",
        fields: [
          { name: "_hintCard", label: "hint", type: "_hint", hint: "Upload any size — card images are auto-cropped to 424×274 and detail images to 1200×800. Leave card blank to use the main image on listings." },
          { name: "cardImageUrl", label: "Card image (listing)", type: "image" },
          { name: "cardImageAlt", label: "Card image alt", type: "text" },
          { name: "imageUrl", label: "Main image (detail page)", type: "image" },
          { name: "imageAlt", label: "Main image alt", type: "text" },
          { name: "galleryImages", label: "Gallery (detail page)", type: "gallery" },
        ],
      },
      seoTab,
    ],
  },

  services: {
    label: "Services",
    singular: "Service",
    apiPath: "services",
    titleField: "title",
    icon: "solar:case-round-outline",
    hasSlug: true,
    listColumns: [{ key: "title", label: "Title" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Content",
        fields: [
          { name: "description", label: "Description", type: "richtext" },
          { name: "features", label: "Features", type: "stringList" },
        ],
      },
      {
        name: "Media",
        fields: [
          { name: "iconUrl", label: "Icon", type: "image" },
          { name: "imageUrl", label: "Image", type: "image" },
        ],
      },
      seoTab,
    ],
  },

  team: {
    label: "Team / Guides",
    singular: "Team member",
    apiPath: "team",
    titleField: "name",
    icon: "solar:users-group-rounded-outline",
    hasSlug: true,
    listColumns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "role", label: "Role / designation", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Content",
        fields: [
          { name: "bio", label: "Bio", type: "richtext" },
          { name: "expertise", label: "Expertise", type: "stringList" },
        ],
      },
      { name: "Media", fields: [{ name: "photoUrl", label: "Photo", type: "image" }] },
      {
        name: "Social",
        fields: [
          { name: "socials", label: "Social links", type: "socials" },
        ],
      },
    ],
  },

  resorts: {
    label: "Resorts",
    singular: "Resort",
    apiPath: "resorts",
    titleField: "title",
    icon: "solar:bedside-table-3-outline",
    hasSlug: true,
    listColumns: [{ key: "title", label: "Title" }, { key: "price", label: "Price" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "price", label: "Price (display text)", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Content",
        fields: [
          { name: "description", label: "Description", type: "richtext" },
          { name: "amenities", label: "Amenities", type: "stringList" },
        ],
      },
      {
        name: "Media",
        fields: [
          { name: "imageUrl", label: "Image", type: "image" },
          { name: "imageAlt", label: "Image alt", type: "text" },
          { name: "galleryImages", label: "Gallery", type: "gallery" },
        ],
      },
      seoTab,
    ],
  },

  blog: {
    label: "Blog",
    singular: "Blog post",
    apiPath: "blog",
    titleField: "title",
    icon: "solar:document-text-outline",
    hasSlug: true,
    listColumns: [{ key: "title", label: "Title" }, statusCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "tags", label: "Tags", type: "stringList" },
          { name: "status", label: "Status", type: "select", options: [...STATUS_OPTS, { value: "SCHEDULED", label: "Scheduled" }] },
        ],
      },
      { name: "Content", fields: [{ name: "content", label: "Body", type: "richtext" }] },
      {
        name: "Media",
        fields: [
          { name: "coverImageUrl", label: "Cover image", type: "image" },
          { name: "coverImageAlt", label: "Cover alt", type: "text" },
        ],
      },
      seoTab,
    ],
  },

  categories: {
    label: "Tour Categories",
    singular: "Category",
    apiPath: "categories",
    titleField: "name",
    icon: "solar:widget-5-outline",
    hasSlug: true,
    listColumns: [{ key: "name", label: "Name" }, { key: "type", label: "Type" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "type", label: "Type", type: "select", options: [{ value: "tour", label: "Tour" }, { value: "blog", label: "Blog" }] },
          { name: "description", label: "Description", type: "textarea" },
          { name: "imageUrl", label: "Image", type: "image" },
          { name: "icon", label: "Icon URL", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  brands: {
    label: "Partner Brands",
    singular: "Brand",
    apiPath: "brands",
    titleField: "name",
    icon: "solar:ribbon-outline",
    hasSlug: false,
    listColumns: [{ key: "name", label: "Name" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "logoUrl", label: "Logo", type: "image" },
          { name: "url", label: "Website URL", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  gallery: {
    label: "Gallery",
    singular: "Gallery image",
    apiPath: "gallery",
    titleField: "title",
    icon: "solar:gallery-wide-outline",
    hasSlug: false,
    listColumns: [{ key: "title", label: "Title" }, { key: "category", label: "Category" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "imageUrl", label: "Image", type: "image", required: true },
          { name: "title", label: "Title", type: "text" },
          { name: "imageAlt", label: "Alt text", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  counters: {
    label: "Stats / Counters",
    singular: "Counter",
    apiPath: "counters",
    titleField: "label",
    icon: "solar:chart-2-outline",
    hasSlug: false,
    listColumns: [{ key: "label", label: "Label" }, { key: "value", label: "Value" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "value", label: "Value", type: "text", required: true },
          { name: "suffix", label: "Suffix (e.g. +)", type: "text" },
          { name: "icon", label: "Icon URL", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  faqs: {
    label: "FAQs",
    singular: "FAQ",
    apiPath: "faqs",
    titleField: "question",
    icon: "solar:question-circle-outline",
    hasSlug: false,
    listColumns: [{ key: "question", label: "Question" }, { key: "category", label: "Category" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "question", label: "Question", type: "text", required: true },
          { name: "answer", label: "Answer", type: "richtext", required: true },
          { name: "category", label: "Category", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  flightRoutes: {
    label: "Flight Routes",
    singular: "Flight route",
    apiPath: "flight-routes",
    titleField: "title",
    icon: "solar:airplane-outline",
    hasSlug: true,
    listColumns: [
      { key: "title", label: "Route" },
      { key: "ticketType", label: "Type" },
      { key: "fromCity", label: "From" },
      { key: "toCity", label: "To" },
      statusCol,
      featuredCol,
    ],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          {
            name: "ticketType",
            label: "Ticket type",
            type: "select",
            required: true,
            options: [
              { value: "domestic", label: "Domestic" },
              { value: "international", label: "International" },
            ],
          },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
          { name: "order", label: "Order", type: "number" },
        ],
      },
      {
        name: "Route details",
        fields: [
          { name: "fromCity", label: "From city", type: "text", required: true },
          { name: "toCity", label: "To city", type: "text", required: true },
          { name: "fromAirport", label: "From airport (code)", type: "text" },
          { name: "toAirport", label: "To airport (code)", type: "text" },
          { name: "airline", label: "Airline(s)", type: "text" },
          { name: "flightDuration", label: "Flight duration", type: "text" },
          { name: "frequency", label: "Frequency", type: "text" },
          { name: "priceFrom", label: "Price from (USD)", type: "number" },
          { name: "priceDisplay", label: "Price display text", type: "text" },
          { name: "highlights", label: "Highlights", type: "stringList" },
          { name: "baggageInfo", label: "Baggage info", type: "textarea" },
          { name: "bookingNotes", label: "Booking notes", type: "richtext" },
        ],
      },
      { name: "Content", fields: [{ name: "description", label: "Full description", type: "richtext" }] },
      {
        name: "Media",
        fields: [
          { name: "_hintCard", label: "hint", type: "_hint", hint: "Upload any size — card images are auto-cropped to 424×274 and detail images to 1200×800." },
          { name: "cardImageUrl", label: "Card image (listing)", type: "image" },
          { name: "cardImageAlt", label: "Card image alt", type: "text" },
          { name: "imageUrl", label: "Main image (detail page)", type: "image" },
          { name: "imageAlt", label: "Image alt text", type: "text" },
        ],
      },
      seoTab,
    ],
  },

  vehicleCategories: {
    label: "Vehicle Categories",
    singular: "Vehicle category",
    apiPath: "vehicle-categories",
    titleField: "name",
    icon: "solar:car-outline",
    hasSlug: true,
    listColumns: [{ key: "name", label: "Name" }, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "icon", label: "Icon (fontawesome class, e.g. fa-light fa-car)", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },

  vehicleRentals: {
    label: "Vehicle Rentals",
    singular: "Vehicle rental",
    apiPath: "vehicle-rentals",
    titleField: "title",
    icon: "solar:wheel-outline",
    hasSlug: true,
    listColumns: [
      { key: "title", label: "Title" },
      { key: "vehicleType", label: "Type" },
      { key: "pricePerDay", label: "Price/day" },
      statusCol,
      featuredCol,
    ],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title (e.g. Toyota Corolla, 32-Seater Coach)", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "categoryId", label: "Category", type: "reference", refResource: "vehicle-categories", refLabel: "name" },
          {
            name: "vehicleType",
            label: "Vehicle type",
            type: "select",
            options: [
              { value: "car", label: "Car" },
              { value: "jeep", label: "Jeep / SUV" },
              { value: "van", label: "Van / Minibus" },
              { value: "bus", label: "Bus / Coach" },
              { value: "driver-only", label: "Driver only (no vehicle)" },
            ],
          },
          { name: "brandModel", label: "Brand / model", type: "text" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      {
        name: "Specs & Pricing",
        fields: [
          { name: "seatingCapacity", label: "Seating capacity", type: "number" },
          { name: "transmission", label: "Transmission", type: "select", options: [{ value: "manual", label: "Manual" }, { value: "automatic", label: "Automatic" }] },
          { name: "fuelType", label: "Fuel type", type: "select", options: ["petrol", "diesel", "electric", "hybrid"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
          { name: "luggageCapacity", label: "Luggage capacity (e.g. 2 large bags)", type: "text" },
          {
            name: "driverOptions",
            label: "Driver options",
            type: "select",
            options: [
              { value: "self-drive", label: "Self-drive only" },
              { value: "with-driver", label: "With driver only" },
              { value: "both", label: "Both self-drive & with driver" },
            ],
          },
          { name: "minRentalDays", label: "Minimum rental days", type: "number" },
          { name: "_hintPricing", label: "hint", type: "_hint", hint: "Turn pricing off to show \"Enquire for price\" publicly instead of these numbers — useful if you'd rather quote by phone/WhatsApp." },
          { name: "showPricing", label: "Show pricing publicly", type: "switch" },
          { name: "pricePerDay", label: "Price per day — self-drive (USD)", type: "number" },
          { name: "pricePerDayDriver", label: "Price per day — with driver (USD)", type: "number" },
          { name: "priceNote", label: "Price note (e.g. + fuel, min 2 days)", type: "text" },
          { name: "highlights", label: "Highlights", type: "stringList" },
          { name: "priceIncludes", label: "Price includes", type: "stringList" },
          { name: "priceExcludes", label: "Price excludes", type: "stringList" },
        ],
      },
      { name: "Content", fields: [{ name: "description", label: "Full description", type: "richtext" }] },
      {
        name: "Media",
        fields: [
          { name: "_hintCard", label: "hint", type: "_hint", hint: "Upload any size — card images are auto-cropped to 424×274 and featured images to 1200×800." },
          { name: "cardImageUrl", label: "Card image (listing)", type: "image" },
          { name: "cardImageAlt", label: "Card image alt", type: "text" },
          { name: "featuredImageUrl", label: "Featured image (detail page)", type: "image" },
          { name: "featuredImageAlt", label: "Featured image alt", type: "text" },
          { name: "galleryImages", label: "Gallery (detail page)", type: "gallery" },
        ],
      },
      seoTab,
    ],
  },

  reviews: {
    label: "Testimonials",
    singular: "Testimonial",
    apiPath: "reviews",
    titleField: "reviewerName",
    icon: "solar:star-outline",
    hasSlug: false,
    listColumns: [{ key: "reviewerName", label: "Reviewer" }, { key: "rating", label: "Rating" }, featuredCol, visibleCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "reviewerName", label: "Reviewer name", type: "text", required: true },
          { name: "reviewerCountry", label: "Country", type: "text" },
          { name: "reviewerPhoto", label: "Photo", type: "image" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
          { name: "reviewText", label: "Review", type: "textarea", required: true },
          { name: "source", label: "Source", type: "select", options: ["DIRECT", "GOOGLE", "TRIPADVISOR"].map((v) => ({ value: v, label: v })) },
          { name: "sourceUrl", label: "Source URL", type: "text" },
          { name: "isFeatured", label: "Featured", type: "switch" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ],
      },
    ],
  },
};

export const RESOURCE_ORDER = [
  "tours",
  "categories",
  "destinations",
  "activities",
  "vehicleRentals",
  "vehicleCategories",
  "services",
  "flightRoutes",
  "resorts",
  "team",
  "blog",
  "gallery",
  "reviews",
  "faqs",
  "counters",
  "brands",
];
