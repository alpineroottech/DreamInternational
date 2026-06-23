import React from "react";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import TicketingListing from "../Components/Ticketing/TicketingListing";
import ScrollToTop from "../Components/ScrollToTop";

function TicketingDomestic() {
  return (
    <>
      <HeaderOne />
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
