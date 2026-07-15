import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../../public-cms/hooks";
import { buildInquiryPayload } from "../Contact/buildInquiryPayload";

const VEHICLE_TYPE_OPTIONS = [
  { value: "", label: "Any vehicle type" },
  { value: "car", label: "Car" },
  { value: "jeep", label: "Jeep / SUV" },
  { value: "van", label: "Van / Minibus" },
  { value: "bus", label: "Bus / Coach" },
  { value: "driver-only", label: "Hire a driver" },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  rentalDate: "",
  rentalDuration: "",
  groupSize: "",
  driverChoice: "",
  vehicleTypeChoice: "",
  message: "",
};

/**
 * Rental enquiry form.
 * - Pass a `rental` prop to embed it on a vehicle's detail page (pre-scoped to that vehicle).
 * - Omit `rental` to render a general enquiry form (used on the vehicle rentals archive page),
 *   which adds a "vehicle type" picker instead of being scoped to one listing.
 */
export default function RentalInquiryWidget({ rental }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);
  const isGeneral = !rental;

  useEffect(() => {
    setStatus({ state: "idle", msg: "" });
    setForm((f) => ({
      ...f,
      driverChoice: rental?.driverOptions === "self-drive" ? "self-drive" : rental?.driverOptions === "with-driver" ? "with-driver" : "",
    }));
  }, [rental?.slug, rental?.driverOptions]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const showDriverChoice = !isGeneral && rental.driverOptions === "both" && rental.vehicleType !== "driver-only";

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      const driverNote = showDriverChoice && form.driverChoice
        ? `Preferred option: ${form.driverChoice === "self-drive" ? "Self-drive" : "With driver"}`
        : "";
      const vehicleTypeNote = isGeneral && form.vehicleTypeChoice
        ? `Vehicle type: ${VEHICLE_TYPE_OPTIONS.find((o) => o.value === form.vehicleTypeChoice)?.label || form.vehicleTypeChoice}`
        : "";
      const durationNote = form.rentalDuration ? `Rental duration: ${form.rentalDuration} day(s)` : "";
      const payload = buildInquiryPayload({
        ...form,
        travelDates: form.rentalDate,
        message: [vehicleTypeNote, driverNote, durationNote, form.message].filter(Boolean).join("\n"),
        inquiryCategory: "vehicle-rental",
        subjectSlug: isGeneral ? null : rental.slug,
        subjectLabel: isGeneral ? (form.vehicleTypeChoice ? VEHICLE_TYPE_OPTIONS.find((o) => o.value === form.vehicleTypeChoice)?.label : "General vehicle rental enquiry") : rental.title,
        subjectId: isGeneral ? "" : rental.id || "",
      });
      payload.customDetails.rentalDuration = form.rentalDuration || null;
      payload.customDetails.rentalDate = form.rentalDate || null;
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
    <div className={isGeneral ? "di-tour-inquiry di-tour-inquiry--general" : "di-tour-inquiry di-tour-inquiry--sidebar"}>
      <h4 className="di-tour-inquiry__title">
        {isGeneral ? "Can't find what you need?" : "Check availability"}
      </h4>
      <p className="di-tour-inquiry__subtitle small mb-3">
        {isGeneral
          ? "Tell us what you're looking for — car, jeep, van, bus, or a driver — and we'll get back to you with pricing and availability."
          : (<>Ask about <strong>{rental.title}</strong> — we'll reply with pricing and availability.</>)}
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
        {isGeneral && (
          <div className="form-group mb-2">
            <select
              className="form-select form-select-sm"
              value={form.vehicleTypeChoice}
              onChange={(e) => setField("vehicleTypeChoice", e.target.value)}
            >
              {VEHICLE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
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
            <label className="di-tour-inquiry__label small text-muted mb-1" htmlFor="rental-date">
              Rental start date
            </label>
            <input
              id="rental-date"
              type="date"
              className="form-control form-control-sm"
              value={form.rentalDate}
              onChange={(e) => setField("rentalDate", e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="col-6">
            <label className="di-tour-inquiry__label small text-muted mb-1" htmlFor="rental-duration">
              Duration (days)
            </label>
            <input
              id="rental-duration"
              type="number"
              className="form-control form-control-sm"
              placeholder="e.g. 5"
              value={form.rentalDuration}
              onChange={(e) => setField("rentalDuration", e.target.value)}
              min={1}
              max={365}
            />
          </div>
        </div>
        <div className="form-group mb-2">
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
