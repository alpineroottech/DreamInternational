import React, { useState, useRef } from "react";
import { publicApi } from "../../public-cms/hooks";

const emptyForm = { name: "", email: "", subject: "", message: "" };

function FaqContact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      await publicApi.post("/public/inquiries", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: [
          form.subject ? `Subject: ${form.subject}` : "",
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
    <div
      className="bg-top-center space overflow-hidden"
      style={{
        background: "url(/assets/img/bg/tour_bg_3.jpg)",
        backgroundRepeat: "no-repeat",
        position: "relative",
        zIndex: "1",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div className="title-area text-center mb-30">
              <span className="sub-title style1">Meet with Our Guide</span>
              <h2 className="sec-title">Do You Have Any&nbsp;More Questions?</h2>
            </div>
            <form onSubmit={submit} className="contact-form" noValidate>
              <h3 className="sec-title mb-30">Book a tour</h3>

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
                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    maxLength={120}
                    autoComplete="name"
                  />
                  <img src="/assets/img/icon/user.svg" alt="" />
                </div>
                <div className="col-md-6 form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Your Mail"
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
                    name="subject"
                    className="form-select form-control"
                    value={form.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    aria-label="Tour destination"
                  >
                    <option value="">Select Tour Destination</option>
                    <option value="Trekking">Trekking</option>
                    <option value="Cultural Tour">Cultural Tour</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Custom Trip">Custom Trip</option>
                  </select>
                </div>
                <div className="form-group col-12">
                  <textarea
                    name="message"
                    cols={30}
                    rows={3}
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
        </div>
      </div>
    </div>
  );
}

export default FaqContact;
