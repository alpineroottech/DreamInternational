import React from "react";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TourInner from "../Components/Tour/TourInner";
import ScrollToTop from "../Components/ScrollToTop";

function InternationalHolidays() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb pageKey="international-holidays" title="International Holidays" />
      <TourInner market="international" />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default InternationalHolidays;
