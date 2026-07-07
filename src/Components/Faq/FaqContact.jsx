import React, { useState, useRef } from "react";
import { publicApi } from "../../public-cms/hooks";
import { EMPTY_INQUIRY_FORM } from "../Contact/inquiryFormConfig";
import { buildInquiryPayload } from "../Contact/buildInquiryPayload";
import InquiryFormFields from "../Contact/InquiryFormFields";

function FaqContact() {
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
              <h3 className="sec-title mb-30">Send an inquiry</h3>

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
                <InquiryFormFields form={form} setField={setField} variant="compact" />
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
