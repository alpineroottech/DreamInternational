import React, { useState, useEffect, useMemo } from "react";
import { publicApi } from "../../public-cms/hooks";
import {
  DOMESTIC_CITIES,
  INTERNATIONAL_DESTINATIONS,
  INTERNATIONAL_ORIGINS,
  mergeCityLists,
} from "./ticketingCities";

const CABIN_CLASSES = ["Economy", "Business", "First"];
const ANY_AIRLINE = { value: "any", label: "Any airline / Not sure" };

const DOMESTIC_AIRLINES = [
  "Buddha Air",
  "Yeti Airlines",
  "Shree Airlines",
  "Nepal Airlines",
  "Summit Air",
  "Tara Air",
  "Saurya Airlines",
  "Simrik Airlines",
];

const INTERNATIONAL_AIRLINES = [
  "Nepal Airlines",
  "Qatar Airways",
  "Emirates",
  "Flydubai",
  "Himalaya Airlines",
  "Turkish Airlines",
  "Singapore Airlines",
  "Air India",
  "IndiGo",
  "Thai Airways",
  "Cathay Pacific",
  "Etihad Airways",
  "Malaysia Airlines",
  "Batik Air Malaysia",
  "Air Arabia",
  "Kuwait Airways",
  "SalamAir",
  "Oman Air",
  "SriLankan Airlines",
  "China Eastern",
  "China Southern",
  "Korean Air",
];

const NEPAL_CITIES = DOMESTIC_CITIES;
const INTL_ORIGIN_CITIES = INTERNATIONAL_ORIGINS;
const INTL_DESTINATION_CITIES = INTERNATIONAL_DESTINATIONS;

const emptyForm = {
  fromCity: "", toCity: "", travelDate: "", returnDate: "",
  passengers: 1, cabinClass: "Economy", preferredAirline: "any",
  name: "", email: "", phone: "", nationality: "", message: "",
};

function matchAirline(name, list) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return list.find((a) => a.toLowerCase() === lower || lower.includes(a.toLowerCase())) || null;
}

function buildInitialForm({
  ticketType,
  defaultFromCity,
  defaultToCity,
  defaultAirline,
}) {
  const airlines = ticketType === "domestic" ? DOMESTIC_AIRLINES : INTERNATIONAL_AIRLINES;
  const matched = matchAirline(defaultAirline, airlines);
  return {
    ...emptyForm,
    fromCity: defaultFromCity || "",
    toCity: defaultToCity || "",
    preferredAirline: matched || "any",
  };
}

/** Cities from the route that are not in the preset list — shown as extra options. */
function extraCityOptions(city, presetList) {
  if (!city || presetList.includes(city)) return null;
  return <option key={`extra-${city}`} value={city}>{city}</option>;
}

export default function FlightBookingForm({
  ticketType = "domestic",
  routeTitle = "",
  variant = "default",
  defaultFromCity = "",
  defaultToCity = "",
  defaultAirline = "",
}) {
  const isDetail = variant === "detail";
  const initial = useMemo(
    () => buildInitialForm({ ticketType, defaultFromCity, defaultToCity, defaultAirline }),
    [ticketType, defaultFromCity, defaultToCity, defaultAirline]
  );

  const [form, setForm] = useState(initial);
  const [tripType, setTripType] = useState("one-way");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    let active = true;
    publicApi
      .get("/public/flight-routes", { params: { ticketType } })
      .then(({ data }) => {
        if (!active) return;
        setRoutes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setRoutes([]);
      });
    return () => {
      active = false;
    };
  }, [ticketType]);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const fromCities = useMemo(() => {
    const dynamic = routes.map((r) => r.fromCity).filter(Boolean);
    const base = ticketType === "domestic" ? NEPAL_CITIES : INTL_ORIGIN_CITIES;
    return mergeCityLists(base, dynamic);
  }, [ticketType, routes]);

  const toCities = useMemo(() => {
    const dynamic = routes.map((r) => r.toCity).filter(Boolean);
    const base = ticketType === "domestic" ? NEPAL_CITIES : INTL_DESTINATION_CITIES;
    return mergeCityLists(base, dynamic);
  }, [ticketType, routes]);

  const airlines = useMemo(() => {
    const base = ticketType === "domestic" ? DOMESTIC_AIRLINES : INTERNATIONAL_AIRLINES;
    const dynamic = routes
      .flatMap((r) => String(r.airline || "").split("/").map((x) => x.trim()))
      .filter(Boolean);
    return Array.from(new Set([...base, ...dynamic])).sort((a, b) => a.localeCompare(b));
  }, [ticketType, routes]);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const preferredAirline = form.preferredAirline === "any" ? null : form.preferredAirline;
      await publicApi.post("/public/flight-inquiries", {
        ...form,
        ticketType,
        preferredAirline,
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

  const routeCol = isDetail ? "col-12 col-md-6" : "col-sm-6";
  const metaCol = isDetail ? "col-12 col-md-6" : "col-sm-4";
  const airlineCol = isDetail ? "col-12" : "col-sm-4";

  if (submitted) {
    return (
      <div className={`flight-form-success${isDetail ? " flight-form-success--detail" : ""}`}>
        <div className="flight-form-success__icon">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h3>Enquiry Received!</h3>
        <p>
          Thank you, <strong>{form.name}</strong>. We&apos;ve received your flight enquiry and
          will get back to you at <strong>{form.email}</strong> within 24 hours.
        </p>
        <button
          type="button"
          className="th-btn style3 mt-3"
          onClick={() => { setSubmitted(false); setForm({ ...initial }); }}
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className={`flight-booking-form${isDetail ? " flight-booking-form--detail" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="flight-booking-form__title">
        <i className="fa-light fa-paper-plane-top me-2" />
        {ticketType === "domestic" ? "Domestic Flight Enquiry" : "International Flight Enquiry"}
      </h3>

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

      <div className="row g-3 mb-3">
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-from">
            <i className="fa-light fa-plane-departure me-1" /> From *
          </label>
          <select
            id="flight-from"
            className="form-select"
            value={form.fromCity}
            onChange={(e) => set("fromCity", e.target.value)}
            required
          >
            <option value="">Select departure city</option>
            {extraCityOptions(form.fromCity, fromCities)}
            {fromCities.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="__other__">Other (specify in message)</option>
          </select>
        </div>
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-to">
            <i className="fa-light fa-plane-arrival me-1" /> To *
          </label>
          <select
            id="flight-to"
            className="form-select"
            value={form.toCity}
            onChange={(e) => set("toCity", e.target.value)}
            required
          >
            <option value="">Select destination city</option>
            {extraCityOptions(form.toCity, toCities)}
            {toCities.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="__other__">Other (specify in message)</option>
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className={tripType === "return" ? routeCol : "col-12"}>
          <label className="form-label" htmlFor="flight-depart">
            <i className="fa-light fa-calendar me-1" /> Departure date *
          </label>
          <input
            id="flight-depart"
            type="date"
            className="form-control"
            value={form.travelDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => set("travelDate", e.target.value)}
            required
          />
        </div>
        {tripType === "return" && (
          <div className={routeCol}>
            <label className="form-label" htmlFor="flight-return">
              <i className="fa-light fa-calendar-check me-1" /> Return date
            </label>
            <input
              id="flight-return"
              type="date"
              className="form-control"
              value={form.returnDate}
              min={form.travelDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => set("returnDate", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className={metaCol}>
          <label className="form-label" htmlFor="flight-passengers">
            <i className="fa-light fa-users me-1" /> Passengers *
          </label>
          <input
            id="flight-passengers"
            type="number"
            className="form-control"
            min={1}
            max={20}
            value={form.passengers}
            onChange={(e) => set("passengers", e.target.value)}
            required
          />
        </div>
        <div className={metaCol}>
          <label className="form-label" htmlFor="flight-cabin">
            <i className="fa-light fa-chair-office me-1" /> Cabin class
          </label>
          <select
            id="flight-cabin"
            className="form-select"
            value={form.cabinClass}
            onChange={(e) => set("cabinClass", e.target.value)}
          >
            {CABIN_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={airlineCol}>
          <label className="form-label" htmlFor="flight-airline">
            <i className="fa-light fa-plane me-1" /> Preferred airline
          </label>
          <select
            id="flight-airline"
            className="form-select"
            value={form.preferredAirline}
            onChange={(e) => set("preferredAirline", e.target.value)}
          >
            <option value={ANY_AIRLINE.value}>{ANY_AIRLINE.label}</option>
            {airlines.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="my-4" />
      <p className="small text-muted mb-3">
        <i className="fa-light fa-circle-info me-1" />
        Your contact details — we&apos;ll send you available options and pricing.
      </p>

      <div className="row g-3 mb-3">
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-name">Full name *</label>
          <input
            id="flight-name"
            type="text"
            className="form-control"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-email">Email *</label>
          <input
            id="flight-email"
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-phone">Phone number</label>
          <input
            id="flight-phone"
            type="tel"
            className="form-control"
            placeholder="+977 ..."
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className={routeCol}>
          <label className="form-label" htmlFor="flight-nationality">Nationality</label>
          <input
            id="flight-nationality"
            type="text"
            className="form-control"
            placeholder="e.g. Nepali"
            value={form.nationality}
            onChange={(e) => set("nationality", e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="flight-notes">Additional notes / special requests</label>
        <textarea
          id="flight-notes"
          className="form-control"
          rows={3}
          placeholder="E.g. special meal, wheelchair access, flexible dates..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="fa-solid fa-circle-exclamation me-2" />{error}
        </div>
      )}

      <button
        type="submit"
        className="th-btn th-btn-accent w-100"
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
