import React from "react";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TicketingListing from "../Components/Ticketing/TicketingListing";
import ScrollToTop from "../Components/ScrollToTop";
import { useSection, resolveAssetUrl } from "../public-cms/hooks";

function TicketingDomestic() {
  const section = useSection("ticketing-domestic", "page");
  const bg = resolveAssetUrl(section?.heroImage) || "/assets/img/hero/Hero2.jpg";

  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Domestic Flights" bgImage={bg} />
      <TicketingListing
        ticketType="domestic"
        pageKey="ticketing-domestic"
        breadcrumbTitle="Domestic"
        siblingLabel="International Flights"
        siblingUrl="/ticketing/international"
      />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default TicketingDomestic;
