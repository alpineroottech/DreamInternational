import React from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TourDetailsMain from "../Components/Tour/TourDetailsMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem } from "../public-cms/hooks";
import { tourListingLabel, tourListingPath } from "../lib/tourUrls";

function TourDetails() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const location = useLocation();
  const slug = searchParams.get("slug") || params.slug;
  const isInternationalRoute = location.pathname.startsWith("/international-holidays");
  const { data: tour } = useSlugItem("/public/tours", slug);

  const market = tour?.market || (isInternationalRoute ? "international" : "nepal");
  const title = tour?.title || (market === "international" ? "Holiday Details" : "Tour Details");

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey={market === "international" ? "international-holidays" : "tour-details"}
        parent={{ label: tourListingLabel(market), url: tourListingPath(market) }}
      />
      <TourDetailsMain market={market} />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default TourDetails;
