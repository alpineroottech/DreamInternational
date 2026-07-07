import { getCategoryConfig } from "./inquiryFormConfig";

const CATEGORY_LABELS = {
  general: "General question",
  tour: "Tour package",
  destination: "Destination",
  activity: "Activity",
  service: "Service",
  flight: "Flight ticketing",
  "custom-trip": "Custom / multi-day trip",
};

/**
 * Maps form state to POST /api/public/inquiries body.
 */
export function buildInquiryPayload(form) {
  const category = form.inquiryCategory || "general";
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const config = getCategoryConfig(category);

  const groupSizeRaw = String(form.groupSize || "").trim();
  const groupSize = groupSizeRaw ? Number.parseInt(groupSizeRaw, 10) : null;

  const subjectParts = [];
  if (category !== "general") {
    subjectParts.push(`Inquiry about: ${categoryLabel}`);
  }
  if (form.subjectLabel) {
    subjectParts.push(`Selected: ${form.subjectLabel}`);
  }

  const messageBody = form.message.trim();
  const message = [subjectParts.join("\n"), messageBody].filter(Boolean).join("\n\n");

  const customDetails = {
    subjectCategory: category,
    subjectCategoryLabel: categoryLabel,
    subjectSlug: form.subjectSlug || null,
    subjectLabel: form.subjectLabel || null,
  };

  if (category === "flight") {
    customDetails.note = "Flight ticketing inquiry via contact form";
  }

  return {
    type: category === "custom-trip" ? "CUSTOM_TRIP" : "STANDARD",
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    travelDates: form.travelDates.trim() || null,
    groupSize: Number.isFinite(groupSize) && groupSize > 0 ? groupSize : null,
    tourId: category === "tour" && form.subjectId ? form.subjectId : null,
    customDetails,
    message: message || null,
  };
}
