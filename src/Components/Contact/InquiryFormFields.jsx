import React from "react";
import { Link } from "react-router-dom";
import { INQUIRY_CATEGORIES, getCategoryConfig } from "./inquiryFormConfig";
import { useInquirySubjectOptions } from "./useInquirySubjectOptions";

/**
 * Shared inquiry fields — contact page, FAQ, and legacy home sections.
 */
export default function InquiryFormFields({
  form,
  setField,
  onCategoryChange,
  onSubjectChange,
  variant = "default",
}) {
  const { options, loading, hasPicker } = useInquirySubjectOptions(form.inquiryCategory);
  const categoryConfig = getCategoryConfig(form.inquiryCategory);
  const isCompact = variant === "compact";

  const handleCategoryChange = (e) => {
    const next = e.target.value;
    onCategoryChange?.(next);
    setField("inquiryCategory", next);
    setField("subjectSlug", "");
    setField("subjectLabel", "");
    setField("subjectId", "");
  };

  const handleSubjectChange = (e) => {
    const slug = e.target.value;
    if (!slug) {
      setField("subjectSlug", "");
      setField("subjectLabel", "");
      setField("subjectId", "");
      onSubjectChange?.(null);
      return;
    }
    const match = options.find((o) => o.slug === slug);
    setField("subjectSlug", slug);
    setField("subjectLabel", match?.label || "");
    setField("subjectId", match?.id || "");
    onSubjectChange?.(match || null);
  };

  const rowClass = isCompact ? "col-md-6 form-group" : "form-group col-12";
  const fieldClass = isCompact ? "col-12 form-group" : "form-group col-12";

  return (
    <>
      <div className={fieldClass}>
        <label htmlFor="inquiry-category" className="form-label visually-hidden">
          What is your inquiry about?
        </label>
        <select
          id="inquiry-category"
          name="inquiryCategory"
          className="form-control form-select"
          value={form.inquiryCategory}
          onChange={handleCategoryChange}
          aria-label="What is your inquiry about?"
        >
          {INQUIRY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {hasPicker && (
        <div className={fieldClass}>
          <label htmlFor="inquiry-subject" className="form-label visually-hidden">
            Select {categoryConfig.label?.toLowerCase()}
          </label>
          <select
            id="inquiry-subject"
            name="subjectSlug"
            className="form-control form-select"
            value={form.subjectSlug}
            onChange={handleSubjectChange}
            disabled={loading}
            aria-label={`Select ${categoryConfig.label?.toLowerCase() || "item"}`}
          >
            <option value="">
              {loading
                ? "Loading options…"
                : `Select ${categoryConfig.label?.toLowerCase() || "item"} (optional)`}
            </option>
            {options.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {categoryConfig.hint && (
        <div className={fieldClass}>
          <p className="small text-muted mb-0">
            {categoryConfig.hint}{" "}
            {categoryConfig.ticketingPath && (
              <Link to={categoryConfig.ticketingPath}>Go to flight enquiry</Link>
            )}
          </p>
        </div>
      )}

      <div className={rowClass}>
        <label htmlFor="inquiry-name" className="form-label visually-hidden">
          Your name
        </label>
        <input
          type="text"
          id="inquiry-name"
          className="form-control"
          name="name"
          placeholder="Your Name *"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          required
          maxLength={120}
          autoComplete="name"
        />
        <img src="/assets/img/icon/user.svg" alt="" />
      </div>

      <div className={rowClass}>
        <label htmlFor="inquiry-email" className="form-label visually-hidden">
          Your email
        </label>
        <input
          type="email"
          id="inquiry-email"
          className="form-control"
          name="email"
          placeholder="Your Email *"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          required
          maxLength={200}
          autoComplete="email"
        />
        <img src="/assets/img/icon/mail.svg" alt="" />
      </div>

      <div className={isCompact ? "col-md-6 form-group" : "form-group col-sm-6"}>
        <label htmlFor="inquiry-phone" className="form-label visually-hidden">
          Phone number
        </label>
        <input
          type="tel"
          id="inquiry-phone"
          className="form-control"
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          maxLength={40}
          autoComplete="tel"
        />
      </div>

      <div className={isCompact ? "col-md-6 form-group" : "form-group col-sm-6"}>
        <label htmlFor="inquiry-travel-dates" className="form-label visually-hidden">
          Preferred travel dates
        </label>
        <input
          type="text"
          id="inquiry-travel-dates"
          className="form-control"
          name="travelDates"
          placeholder="Travel dates (optional)"
          value={form.travelDates}
          onChange={(e) => setField("travelDates", e.target.value)}
          maxLength={120}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="inquiry-group-size" className="form-label visually-hidden">
          Group size
        </label>
        <input
          type="number"
          id="inquiry-group-size"
          className="form-control"
          name="groupSize"
          placeholder="Group size (optional)"
          min={1}
          max={1000}
          value={form.groupSize}
          onChange={(e) => setField("groupSize", e.target.value)}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="inquiry-message" className="form-label visually-hidden">
          Your message
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          cols={30}
          rows={isCompact ? 3 : 4}
          className="form-control"
          placeholder="Tell us what you need — questions, preferences, or special requests *"
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          required
          maxLength={5000}
        />
        <img src="/assets/img/icon/chat.svg" alt="" />
      </div>
    </>
  );
}
