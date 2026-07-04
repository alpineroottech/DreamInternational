import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import TourDetailsMain from "../Components/Tour/TourDetailsMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem, resolveAssetUrl } from "../public-cms/hooks";

function TourDetails() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const slug = searchParams.get("slug") || params.slug;
  const { data: tour } = useSlugItem("/public/tours", slug);

  const title = tour?.title || "Tour Details";
  const bgImage =
    resolveAssetUrl(tour?.featuredImageUrl) ||
    (Array.isArray(tour?.galleryImages) && tour.galleryImages[0]
      ? resolveAssetUrl(
          typeof tour.galleryImages[0] === "string"
            ? tour.galleryImages[0]
            : tour.galleryImages[0].url
        )
      : "");

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey="tour-details"
        bgImage={bgImage}
        parent={{ label: "Tours", url: "/tour" }}
      />
      <TourDetailsMain />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default TourDetails;
