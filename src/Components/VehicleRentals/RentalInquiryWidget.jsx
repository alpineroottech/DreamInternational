import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../../public-cms/hooks";
import { buildInquiryPayload } from "../Contact/buildInquiryPayload";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  travelDates: "",
  groupSize: "",
  driverChoice: "",
  message: "",
};

export default function RentalInquiryWidget({ rental }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  useEffect(() => {
    setStatus({ state: "idle", msg: "" });
    setForm((f) => ({
      ...f,
      driverChoice: rental?.driverOptions === "self-drive" ? "self-drive" : rental?.driverOptions === "with-driver" ? "with-driver" : "",
    }));
  }, [rental?.slug, rental?.driverOptions]);

  if (!rental) return null;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const showDriverChoice = rental.driverOptions === "both" && rental.vehicleType !== "driver-only";

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      const driverNote = showDriverChoice && form.driverChoice
        ? `Preferred option: ${form.driverChoice === "self-drive" ? "Self-drive" : "With driver"}`
        : "";
      const payload = buildInquiryPayload({
        ...form,
        message: [driverNote, form.message].filter(Boolean).join("\n"),
        inquiryCategory: "vehicle-rental",
        subjectSlug: rental.slug,
        subjectLabel: rental.title,
        subjectId: rental.id || "",
      });
      await publicApi.post("/public/inquiries", payload);
      setStatus({
        state: "success",
        msg: "Thanks! We'll confirm availability and pricing shortly.",
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

  return (
    <div className="di-tour-inquiry di-tour-inquiry--sidebar">
      <h4 className="di-tour-inquiry__title">Check availability</h4>
      <p className="di-tour-inquiry__subtitle small mb-3">
        Ask about <strong>{rental.title}</strong> — we'll reply with pricing and availability.
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
        {showDriverChoice && (
          <div className="form-group mb-2">
            <select
              className="form-select form-select-sm"
              value={form.driverChoice}
              onChange={(e) => setField("driverChoice", e.target.value)}
            >
              <option value="">Self-drive or with driver?</option>
              <option value="self-drive">Self-drive</option>
              <option value="with-driver">With driver</option>
            </select>
          </div>
        )}
        <div className="row g-2 mb-2">
          <div className="col-6">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Rental dates"
              value={form.travelDates}
              onChange={(e) => setField("travelDates", e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Passengers"
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
            placeholder="Pickup location, questions, or special requests"
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
