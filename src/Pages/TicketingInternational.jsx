import React from "react";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import TicketingListing from "../Components/Ticketing/TicketingListing";
import ScrollToTop from "../Components/ScrollToTop";

function TicketingInternational() {
  return (
    <>
      <HeaderOne />
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
