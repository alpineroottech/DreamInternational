import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../../public-cms/hooks";
import { buildInquiryPayload } from "../Contact/buildInquiryPayload";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  travelDates: "",
  groupSize: "",
  message: "",
};

export default function TourInquiryWidget({ tour, variant = "sidebar" }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  useEffect(() => {
    setStatus({ state: "idle", msg: "" });
  }, [tour?.slug]);

  if (!tour) return null;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      const payload = buildInquiryPayload({
        ...form,
        inquiryCategory: "tour",
        subjectSlug: tour.slug,
        subjectLabel: tour.title,
        subjectId: tour.id || "",
      });
      await publicApi.post("/public/inquiries", payload);
      setStatus({
        state: "success",
        msg: "Thanks! We'll reply with availability and a quote shortly.",
      });
      setForm({ ...EMPTY });
      requestAnimationFrame(() => {
        statusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      const m = err?.response?.data?.error || "Could not send your inquiry. Please try again.";
      setStatus({ state: "error", msg: m });
    }
  };

  const isSidebar = variant === "sidebar";

  return (
    <div className={`di-tour-inquiry${isSidebar ? " di-tour-inquiry--sidebar" : ""}`}>
      <h4 className="di-tour-inquiry__title">Quick inquiry</h4>
      <p className="di-tour-inquiry__subtitle small mb-3">
        Ask about <strong>{tour.title}</strong> — no need to leave this page.
      </p>

      <div ref={statusRef}>
        {status.state === "success" && (
          <div className="alert alert-success py-2 small mb-3" role="status">
            {status.msg}
          </div>
        )}
        {status.state === "error" && (
          <div className="alert alert-danger py-2 small mb-3" role="alert">
            {status.msg}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="di-tour-inquiry__form" noValidate>
        <div className="form-group mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Your name *"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            maxLength={120}
            autoComplete="name"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="email"
            className="form-control form-control-sm"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            maxLength={200}
            autoComplete="email"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="tel"
            className="form-control form-control-sm"
            placeholder="Phone / WhatsApp"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </div>
        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Travel dates"
              value={form.travelDates}
              onChange={(e) => setField("travelDates", e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Group size"
              value={form.groupSize}
              onChange={(e) => setField("groupSize", e.target.value)}
              min={1}
              max={99}
            />
          </div>
        </div>
        <div className="form-group mb-3">
          <textarea
            className="form-control form-control-sm"
            rows={3}
            placeholder="Questions or special requests"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            maxLength={2000}
          />
        </div>
        <button
          type="submit"
          className="th-btn th-btn-accent w-100"
          disabled={status.state === "sending"}
        >
          {status.state === "sending" ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </div>
  );
}
