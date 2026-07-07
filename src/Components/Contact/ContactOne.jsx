import React, { useState, useRef } from "react";
import { publicApi, useSettings } from "../../public-cms/hooks";
import { EMPTY_INQUIRY_FORM } from "./inquiryFormConfig";
import { buildInquiryPayload } from "./buildInquiryPayload";
import InquiryFormFields from "./InquiryFormFields";

function ContactOne() {
  const settings = useSettings();
  const [form, setForm] = useState({ ...EMPTY_INQUIRY_FORM });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", msg: "" });
    try {
      await publicApi.post("/public/inquiries", buildInquiryPayload(form));
      setStatus({
        state: "success",
        msg: "Thank you! Your message has been sent. We'll get back to you shortly.",
      });
      setForm({ ...EMPTY_INQUIRY_FORM });
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

  const phone = settings.contactPhone || "+977-1-0000000";
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div
      className="contact-area3 bg-top-center overflow-hidden"
      style={{
        backgroundImage: "url(/assets/img/bg/contact_bg_1.jpg)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row gy-4 justify-content-between align-items-center">
          <div className="col-lg-5">
            <div className="pt-80 p-lg-0">
              <div className="title-area pe-xl-5">
                <span className="sub-title text-white">Get in touch</span>
                <h2 className="sec-title text-white">Say hello to us</h2>
                <p className="contact-text text-white">
                  We&apos;d love to hear from you. Our friendly team is always here to chat.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="contact-form-area">
              <form onSubmit={submit} className="contact-form2" noValidate>
                <div ref={statusRef}>
                  {status.state === "success" && (
                    <div className="alert alert-success di-form-alert" role="status">
                      <strong>Message sent.</strong> {status.msg}
                    </div>
                  )}
                  {status.state === "error" && (
                    <div className="alert alert-warning di-form-alert" role="alert">
                      {status.msg}
                    </div>
                  )}
                </div>

                <div className="row">
                  <InquiryFormFields form={form} setField={setField} />
                </div>
                <div className="form-btn-wrapp">
                  <div className="form-btn">
                    <button
                      className="th-btn white-btn"
                      type="submit"
                      disabled={status.state === "sending"}
                    >
                      {status.state === "sending" ? "Sending…" : "Send Message"}{" "}
                      {status.state !== "sending" && (
                        <img src="/assets/img/icon/plane3.svg" alt="" />
                      )}
                    </button>
                  </div>
                  <div className="contact-info">
                    <p className="contact-info_link">
                      <a href={telHref}>{phone}</a>
                    </p>
                    <div className="contact-info_icon">
                      <a href={telHref} aria-label="Call us">
                        <img src="/assets/img/icon/call.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactOne;
