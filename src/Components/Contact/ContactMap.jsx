import React from "react";
import { useSettings } from "../../public-cms/hooks";

const DEFAULT_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0205!2d85.3123!3d27.7154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp";

function ContactMap() {
  const settings = useSettings();
  const mapSrc = settings.mapEmbedUrl || settings.googleMapsEmbed || DEFAULT_MAP;

  return (
    <div className="">
      <div className="container-fluid">
        <div className="contact-map style2">
          <iframe
            title="Dream International office location"
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="contact-icon">
            <img src="/assets/img/icon/location-dot3.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactMap;
