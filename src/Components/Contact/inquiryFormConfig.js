/** Shared inquiry form categories and CMS list mappings. */
export const INQUIRY_CATEGORIES = [
  { value: "general", label: "General question" },
  {
    value: "tour",
    label: "Tour package",
    apiPath: "/public/tours",
    labelKey: "title",
    slugKey: "slug",
    idKey: "id",
  },
  {
    value: "destination",
    label: "Destination",
    apiPath: "/public/destinations",
    labelKey: "name",
    slugKey: "slug",
  },
  {
    value: "activity",
    label: "Activity",
    apiPath: "/public/activities",
    labelKey: "title",
    slugKey: "slug",
  },
  {
    value: "service",
    label: "Service",
    apiPath: "/public/services",
    labelKey: "title",
    slugKey: "slug",
  },
  {
    value: "flight",
    label: "Flight ticketing",
    hint: "Prefer our flight enquiry form for routes and dates — or describe your needs below.",
    ticketingPath: "/ticketing/domestic",
  },
  {
    value: "vehicle-rental",
    label: "Vehicle rental",
    apiPath: "/public/vehicle-rentals",
    labelKey: "title",
    slugKey: "slug",
    hint: "Cars, jeeps/SUVs, vans, buses, self-drive or with-driver — or hire a driver for your own vehicle.",
  },
  { value: "custom-trip", label: "Custom / multi-day trip" },
];

export const EMPTY_INQUIRY_FORM = {
  name: "",
  email: "",
  phone: "",
  inquiryCategory: "general",
  subjectSlug: "",
  subjectLabel: "",
  subjectId: "",
  travelDates: "",
  groupSize: "",
  message: "",
};

export function getCategoryConfig(value) {
  return INQUIRY_CATEGORIES.find((c) => c.value === value) || INQUIRY_CATEGORIES[0];
}
