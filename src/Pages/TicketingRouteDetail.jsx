import React from "react";
import { useParams } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TicketingRouteDetailMain from "../Components/Ticketing/TicketingRouteDetailMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem, resolveAssetUrl } from "../public-cms/hooks";

function TicketingRouteDetail({ ticketType, listingLabel, listingUrl }) {
  const { slug } = useParams();
  const { data: route } = useSlugItem("/public/flight-routes", slug);
  const title = route?.title || "Flight Details";
  const bgImage = resolveAssetUrl(route?.imageUrl) || "";

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey="ticketing-route"
        bgImage={bgImage}
        parent={listingLabel && listingUrl ? { label: listingLabel, url: listingUrl } : undefined}
      />
      <TicketingRouteDetailMain
        ticketType={ticketType}
        listingLabel={listingLabel}
        listingUrl={listingUrl}
      />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export function TicketingDomesticDetail() {
  return (
    <TicketingRouteDetail
      ticketType="domestic"
      listingLabel="Domestic Flights"
      listingUrl="/ticketing/domestic"
    />
  );
}

export function TicketingInternationalDetail() {
  return (
    <TicketingRouteDetail
      ticketType="international"
      listingLabel="International Flights"
      listingUrl="/ticketing/international"
    />
  );
}

export default TicketingRouteDetail;
