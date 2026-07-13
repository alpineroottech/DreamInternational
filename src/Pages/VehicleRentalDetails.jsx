import React from "react";
import { useParams } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import VehicleRentalDetailsMain from "../Components/VehicleRentals/VehicleRentalDetailsMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem } from "../public-cms/hooks";

function VehicleRentalDetails() {
  const params = useParams();
  const { data: rental } = useSlugItem("/public/vehicle-rentals", params.slug);
  const title = rental?.title || "Vehicle Rental Details";

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey="vehicle-rental-details"
        parent={{ label: "Vehicle Rentals", url: "/vehicle-rentals" }}
      />
      <VehicleRentalDetailsMain />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default VehicleRentalDetails;
