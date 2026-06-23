import React from "react";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TicketingListing from "../Components/Ticketing/TicketingListing";
import ScrollToTop from "../Components/ScrollToTop";
import { useSection, resolveAssetUrl } from "../public-cms/hooks";

function TicketingInternational() {
  const section = useSection("ticketing-international", "page");
  const bg = resolveAssetUrl(section?.heroImage) || "/assets/img/bg/breadcumb-bg.jpg";

  return (
    <>
      <HeaderOne />
      <Breadcrumb title="International Flights" bgImage={bg} />
      <TicketingListing
        ticketType="international"
        pageKey="ticketing-international"
        breadcrumbTitle="International"
        siblingLabel="Domestic Flights"
        siblingUrl="/ticketing/domestic"
      />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default TicketingInternational;
