import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { publicApi, useSettings } from "../../public-cms/hooks";
import { EMPTY_INQUIRY_FORM } from "./inquiryFormConfig";
import { buildInquiryPayload } from "./buildInquiryPayload";
import InquiryFormFields from "./InquiryFormFields";
import { useInquirySubjectOptions } from "./useInquirySubjectOptions";

const DEFAULT_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0205!2d85.3123!3d27.7154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp";

function BookATour() {
  const settings = useSettings();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ ...EMPTY_INQUIRY_FORM });
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const statusRef = useRef(null);
  const prefilledRef = useRef(false);

  const urlCategory = searchParams.get("category") || searchParams.get("about") || "";
  const urlItem = searchParams.get("item") || searchParams.get("slug") || "";

  const { options } = useInquirySubjectOptions(
    urlCategory && !prefilledRef.current ? urlCategory : form.inquiryCategory
  );

  useEffect(() => {
    if (prefilledRef.current || !urlCategory) return;
    setForm((f) => ({ ...f, inquiryCategory: urlCategory }));
  }, [urlCategory]);

  useEffect(() => {
    if (prefilledRef.current || !urlCategory || !urlItem || !options.length) return;
    const match = options.find((o) => o.slug === urlItem);
    if (match) {
      setForm((f) => ({
        ...f,
        inquiryCategory: urlCategory,
        subjectSlug: match.slug,
        subjectLabel: match.label,
        subjectId: match.id || "",
      }));
      prefilledRef.current = true;
    }
  }, [urlCategory, urlItem, options]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const mapSrc = settings.mapEmbedUrl || settings.googleMapsEmbed || DEFAULT_MAP;

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
      prefilledRef.current = false;
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
              <h3 className="sec-title mb-30 text-capitalize">Send us an inquiry</h3>
              <p className="text-muted small mb-3">
                Tours, destinations, activities, services, flights, or a custom trip — tell us what you need.
              </p>

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
                <InquiryFormFields form={form} setField={setField} />
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
