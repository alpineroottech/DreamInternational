import React, { useState } from "react";
import { publicApi } from "../../public-cms/hooks";

const CABIN_CLASSES = ["Economy", "Business", "First"];
const NEPAL_CITIES = [
  "Kathmandu", "Pokhara", "Lukla", "Biratnagar", "Bhairahawa", "Nepalgunj",
  "Dhangadhi", "Tumlingtar", "Jomsom", "Manang", "Simara", "Bharatpur",
];

const INTL_CITIES = [
  "Delhi", "Mumbai", "Dubai", "Doha", "Singapore", "Kuala Lumpur",
  "Bangkok", "London", "Frankfurt", "Hong Kong", "Tokyo", "Seoul",
  "Guangzhou", "Istanbul", "Abu Dhabi", "Riyadh", "Colombo",
];

const emptyForm = {
  fromCity: "", toCity: "", travelDate: "", returnDate: "",
  passengers: 1, cabinClass: "Economy",
  name: "", email: "", phone: "", nationality: "", message: "",
};

export default function FlightBookingForm({ ticketType = "domestic", routeTitle = "" }) {
  const [form, setForm] = useState({ ...emptyForm });
  const [tripType, setTripType] = useState("one-way");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const cities = ticketType === "domestic" ? NEPAL_CITIES : INTL_CITIES;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await publicApi.post("/public/flight-inquiries", {
        ...form,
        ticketType,
        returnDate: tripType === "return" ? form.returnDate : null,
        passengers: Number(form.passengers) || 1,
        message: [
          routeTitle ? `Route: ${routeTitle}` : "",
          form.message,
        ].filter(Boolean).join("\n"),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flight-form-success">
        <div className="flight-form-success__icon">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h3>Enquiry Received!</h3>
        <p>
          Thank you, <strong>{form.name}</strong>. We've received your flight enquiry and
          will get back to you at <strong>{form.email}</strong> within 24 hours.
        </p>
        <button
          type="button"
          className="th-btn style3 mt-3"
          onClick={() => { setSubmitted(false); setForm({ ...emptyForm }); }}
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="flight-booking-form" onSubmit={handleSubmit} noValidate>
      <h3 className="flight-booking-form__title">
        <i className="fa-light fa-paper-plane-top me-2" />
        {ticketType === "domestic" ? "Domestic Flight Enquiry" : "International Flight Enquiry"}
      </h3>

      {/* Trip type */}
      <div className="flight-booking-form__trip-toggle mb-4">
        {["one-way", "return"].map((t) => (
          <button
            key={t}
            type="button"
            className={`flight-trip-btn${tripType === t ? " active" : ""}`}
            onClick={() => setTripType(t)}
          >
            {t === "one-way" ? "One-way" : "Return"}
          </button>
        ))}
      </div>

      {/* Route */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label">
            <i className="fa-light fa-plane-departure me-1" /> From *
          </label>
          <select
            className="form-select"
            value={form.fromCity}
            onChange={e => set("fromCity", e.target.value)}
            required
          >
            <option value="">Select departure city</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="__other__">Other (specify in message)</option>
          </select>
        </div>
        <div className="col-sm-6">
          <label className="form-label">
            <i className="fa-light fa-plane-arrival me-1" /> To *
          </label>
          <select
            className="form-select"
            value={form.toCity}
            onChange={e => set("toCity", e.target.value)}
            required
          >
            <option value="">Select destination city</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="__other__">Other (specify in message)</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="row g-3 mb-3">
        <div className={tripType === "return" ? "col-sm-6" : "col-12"}>
          <label className="form-label">
            <i className="fa-light fa-calendar me-1" /> Departure date *
          </label>
          <input
            type="date"
            className="form-control"
            value={form.travelDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => set("travelDate", e.target.value)}
            required
          />
        </div>
        {tripType === "return" && (
          <div className="col-sm-6">
            <label className="form-label">
              <i className="fa-light fa-calendar-check me-1" /> Return date
            </label>
            <input
              type="date"
              className="form-control"
              value={form.returnDate}
              min={form.travelDate || new Date().toISOString().split("T")[0]}
              onChange={e => set("returnDate", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Passengers & Class */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6">
          <label className="form-label">
            <i className="fa-light fa-users me-1" /> Passengers *
          </label>
          <input
            type="number"
            className="form-control"
            min={1} max={20}
            value={form.passengers}
            onChange={e => set("passengers", e.target.value)}
            required
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">
            <i className="fa-light fa-chair-office me-1" /> Cabin class
          </label>
          <select
            className="form-select"
            value={form.cabinClass}
            onChange={e => set("cabinClass", e.target.value)}
          >
            {CABIN_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <hr className="my-4" />
      <p className="small text-muted mb-3">
        <i className="fa-light fa-circle-info me-1" />
        Your contact details — we'll send you available options and pricing.
      </p>

      {/* Contact */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label">Full name *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Your full name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            required
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="form-label">Phone number</label>
          <input
            type="tel"
            className="form-control"
            placeholder="+977 ..."
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">Nationality</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Nepali"
            value={form.nationality}
            onChange={e => set("nationality", e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label">Additional notes / special requests</label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="E.g. preferred airline, special meal, wheelchair access..."
          value={form.message}
          onChange={e => set("message", e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="fa-solid fa-circle-exclamation me-2" />{error}
        </div>
      )}

      <button
        type="submit"
        className="th-btn style3 th-icon w-100"
        disabled={loading}
      >
        {loading
          ? <><i className="fa-duotone fa-spinner fa-spin me-2" />Sending…</>
          : <><i className="fa-light fa-paper-plane me-2" />Send Enquiry</>
        }
      </button>
    </form>
  );
}
