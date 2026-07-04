import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { publicApi } from "../../public-cms/hooks";

Modal.setAppElement("#root");

const TOUR_TYPES = [
  "Trekking",
  "Cultural Tour",
  "Adventure",
  "Custom Trip",
  "Flight Ticketing",
  "Other",
];

const emptyForm = { name: "", email: "", tourType: "", message: "" };

function BookATour() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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
    <div
      className="space-extra2-top space-extra2-bottom"
      style={{
        background: "url(/assets/img/bg/video_bg_1.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <div className="row flex-row-reverse justify-content-center align-items-center">
          <div className="col-lg-6">
            <div className="video-box1">
              <button
                type="button"
                className="play-btn style2 popup-video"
                onClick={() => setModalIsOpen(true)}
                aria-label="Play video"
              >
                <i className="fa-sharp fa-solid fa-play" />
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <form onSubmit={submit} className="contact-form style2" noValidate>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Video Popup"
        className="video-modal"
        overlayClassName="video-modal-overlay"
      >
        <button
          type="button"
          className="close-btn"
          onClick={() => setModalIsOpen(false)}
          aria-label="Close video"
        >
          &times;
        </button>
        <iframe
          width="100%"
          height="400px"
          src="https://www.youtube.com/embed/cQfIUPw72Dk"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Modal>
    </div>
  );
}

export default BookATour;
