import React, { useState, useRef } from "react";
import { publicApi, useSettings } from "../../public-cms/hooks";

const TOUR_TYPES = [
  "Trekking",
  "Cultural Tour",
  "Adventure",
  "Custom Trip",
  "Flight Ticketing",
  "Other",
];

const emptyForm = { name: "", email: "", tourType: "", message: "" };

const DEFAULT_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0205!2d85.3123!3d27.7154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp";

function BookATour() {
  const settings = useSettings();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const mapSrc = settings.mapEmbedUrl || settings.googleMapsEmbed || DEFAULT_MAP;

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      await publicApi.post("/public/inquiries", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: [
          form.tourType ? `Tour type: ${form.tourType}` : "",
          form.message.trim(),
        ]
          .filter(Boolean)
          .join("\n"),
      });
      setStatus({
        state: "success",
        msg: "Thank you! Your message has been sent. We'll get back to you shortly.",
      });
      setForm(emptyForm);
      requestAnimationFrame(() => {
        statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch (err) {
      const m =
        err?.response?.data?.error || "Something went wrong. Please try again.";
      setStatus({ state: "error", msg: m });
      requestAnimationFrame(() => {
        statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  };

  return (
    <section className="di-contact-form-section space-extra2-top space-extra2-bottom">
      <div className="container">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-6">
            <form onSubmit={submit} className="contact-form style2 di-contact-form-card h-100" noValidate>
              <h3 className="sec-title mb-30 text-capitalize">Book a tour</h3>

              <div ref={statusRef}>
                {status.state === "success" && (
                  <div className="alert alert-success di-form-alert" role="status">
                    <strong>Message sent.</strong> {status.msg}
                  </div>
                )}
                {status.state === "error" && (
                  <div className="alert alert-danger di-form-alert" role="alert">
                    {status.msg}
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-12 form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="contact-name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    maxLength={120}
                    autoComplete="name"
                  />
                  <img src="/assets/img/icon/user.svg" alt="" />
                </div>
                <div className="col-12 form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="contact-email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                    maxLength={200}
                    autoComplete="email"
                  />
                  <img src="/assets/img/icon/mail.svg" alt="" />
                </div>
                <div className="form-group col-12">
                  <select
                    className="form-control form-select"
                    name="tourType"
                    id="contact-tour-type"
                    value={form.tourType}
                    onChange={(e) => setField("tourType", e.target.value)}
                    aria-label="Tour type"
                  >
                    <option value="">Select Tour Type</option>
                    {TOUR_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-12">
                  <textarea
                    name="message"
                    id="contact-message"
                    cols={30}
                    rows={4}
                    className="form-control"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    maxLength={5000}
                  />
                  <img src="/assets/img/icon/chat.svg" alt="" />
                </div>
                <div className="form-btn col-12 mt-24">
                  <button
                    type="submit"
                    className="th-btn style3"
                    disabled={status.state === "sending"}
                  >
                    {status.state === "sending" ? "Sending…" : "Send message"}
                    {status.state !== "sending" && (
                      <img src="/assets/img/icon/plane.svg" alt="" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-6">
            <div className="di-contact-map-card h-100">
              <iframe
                title="Dream International office location"
                src={mapSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookATour;
