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
      { name: "Content", fields: [{ name: "description", label: "Full description", type: "richtext" }] },
      {
        name: "Media",
        fields: [
          { name: "featuredImageUrl", label: "Featured image", type: "image" },
          { name: "featuredImageAlt", label: "Image alt text", type: "text" },
          { name: "galleryImages", label: "Gallery", type: "gallery" },
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
    listColumns: [{ key: "title", label: "Title" }, { key: "price", label: "Price" }, statusCol, featuredCol],
    tabs: [
      {
        name: "Basic",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug" },
          { name: "shortDescription", label: "Short description", type: "textarea" },
          { name: "price", label: "Price (display text)", type: "text" },
          { name: "order", label: "Order", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUS_OPTS },
          { name: "isFeatured", label: "Featured", type: "switch" },
        ],
      },
      { name: "Content", fields: [{ name: "description", label: "Description", type: "richtext" }] },
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
  "services",
  "resorts",
  "team",
  "blog",
  "gallery",
  "reviews",
  "faqs",
  "counters",
  "brands",
];
