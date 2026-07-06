import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HeaderOne from "../Components/Header/HeaderOne";
import FooterOne from "../Components/Footer/FooterOne";
import Breadcrumb from "../Components/BreadCrumb/Breadcrumb";
import ActivitiesDetailsMain from "../Components/Activities/ActivitiesDetailsMain";
import ScrollToTop from "../Components/ScrollToTop";
import { useSlugItem } from "../public-cms/hooks";

function ActivitiesDetails() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const slug = searchParams.get("slug") || params.slug;
  const { data: activity } = useSlugItem("/public/activities", slug);
  const title = activity?.title || "Activity Details";

  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title={title}
        pageKey="activity-details"
        parent={{ label: "Activities", url: "/activities" }}
      />
      <ActivitiesDetailsMain />
      <FooterOne />
      <ScrollToTop />
    </>
  );
}

export default ActivitiesDetails;
