import React from "react";
import { useSettings } from "../../public-cms/hooks";

function GetInTouch() {
  const settings = useSettings();
  const address = settings.address || "Thamel, Kathmandu, Nepal";
  const phone = settings.contactPhone || "+977-1-0000000";
  const email = settings.contactEmail || "info@dreaminternationaltours.com";
  const whatsapp = settings.whatsappNumber || phone;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <div className="space">
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title">Get In Touch</span>
          <h2 className="sec-title">Our Contact Information</h2>
        </div>
        <div className="row gy-4 justify-content-center">
          <div className="col-xl-4 col-lg-6">
            <div className="about-contact-grid style2">
              <div className="about-contact-icon">
                <img src="/assets/img/icon/location-dot2.svg" alt="" />
              </div>
              <div className="about-contact-details">
                <h6 className="box-title">Our Address</h6>
                <p className="about-contact-details-text">{address}</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="about-contact-grid">
              <div className="about-contact-icon">
                <img src="/assets/img/icon/call.svg" alt="" />
              </div>
              <div className="about-contact-details">
                <h6 className="box-title">Phone Number</h6>
                <p className="about-contact-details-text">
                  <a href={telHref}>{phone}</a>
                </p>
                {whatsapp && whatsapp !== phone && (
                  <p className="about-contact-details-text">
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      WhatsApp: {whatsapp}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="about-contact-grid">
              <div className="about-contact-icon">
                <img src="/assets/img/icon/mail.svg" alt="" />
              </div>
              <div className="about-contact-details">
                <h6 className="box-title">Email Address</h6>
                <p className="about-contact-details-text">
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetInTouch;
