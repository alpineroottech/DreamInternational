import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import BannerOne from '../Components/Banner/BannerOne'
import Booking from '../Components/Booking/Booking'
import CategoryOne from '../Components/Category/CategoryOne'
import DestinationOne from '../Components/Destination/DestinationOne'
import AboutOne from '../Components/About/AboutOne'
import TourOne from '../Components/Tour/TourOne'
import GalleryOne from '../Components/Gallery/GalleryOne'
import CounterOne from '../Components/Counter/CounterOne'
import TourGuide from '../Components/Guide/TourGuide'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import BrandOne from '../Components/Brand/BrandOne'
import BlogOne from '../Components/Blog/BlogOne'
import FooterOne from '../Components/Footer/FooterOne'
import ScrollToTop from '../Components/ScrollToTop'
import { useHomeSections } from '../public-cms/hooks'

// Maps a CMS section key to the React component that renders it.
const SECTION_COMPONENTS = {
    hero: BannerOne,
    categories: CategoryOne,
    featuredDestination: DestinationOne,
    about: AboutOne,
    featuredTours: TourOne,
    gallery: GalleryOne,
    counters: CounterOne,
    team: TourGuide,
    testimonials: TestimonialOne,
    brands: BrandOne,
    blog: BlogOne,
};

const DEFAULT_ORDER = [
    "hero", "categories", "featuredDestination", "about", "featuredTours",
    "gallery", "counters", "testimonials", "brands", "blog",
];

function HomeOne() {
    const { byKey, order } = useHomeSections();
    const keys = order?.length ? order : DEFAULT_ORDER;

    return (
        <div>
            <HeaderOne />
            {keys.map((key) => {
                const Comp = SECTION_COMPONENTS[key];
                if (!Comp) return null;
                const el = <Comp key={key} data={byKey[key] || {}} />;
                // The booking widget always sits directly under the hero.
                if (key === "hero") {
                    return (
                        <div className="di-hero-booking-wrap" key="hero-group">
                            {el}
                            <Booking />
                        </div>
                    );
                }
                return el;
            })}
            <FooterOne />
            <ScrollToTop />
        </div>
    )
}

export default HomeOne
