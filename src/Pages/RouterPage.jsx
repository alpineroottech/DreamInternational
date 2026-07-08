import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import HomeOne from './HomeOne'
import HomeTwo from './HomeTwo'
import HomeThree from './HomeThree'
import HomeFour from './HomeFour'
import About from './About'
import LoadTop from '../Components/LoadTop'
import Service from './Service'
import ServiceDetails from './ServiceDetails';
import Activities from './Activities'
import ActivitiesDetails from './ActivitiesDetails'
import Shop from './Shop'
import ShopDetails from './ShopDetails'
import Cart from './Cart'
import Checkout from './Checkout'
import Wishlist from './Wishlist'
import Gallery from './Gallery'
import Tour from './Tour'
import TourDetails from './TourDetails'
import InternationalHolidays from './InternationalHolidays'
import Resort from './Resort'
import ResortDetails from './ResortDetails'
import TourGuide from './TourGuide'
import TourGuiderDetails from './TourGuiderDetails'
import Faq from './Faq'
import Pricing from './Pricing'
import Error from './Error'
import Blog from './Blog'
import BlogDetails from './BlogDetails'
import Contact from './Contact'
import AdminApp from '../admin/AdminApp'
import TicketingDomestic from './TicketingDomestic'
import TicketingInternational from './TicketingInternational'
import { TicketingDomesticDetail, TicketingInternationalDetail } from './TicketingRouteDetail'
import PrivacyPolicy from './PrivacyPolicy'
import TermsAndConditions from './TermsAndConditions'
import CancellationPolicy from './CancellationPolicy'

function RedirectLegacyDestinationDetail() {
  const { id } = useParams();
  return <Navigate to={`/international-holidays/${id}`} replace />;
}

function RouterPage() {
  return (
    <div>
      <Router>
        <LoadTop />
        <Routes>
          <Route path="/" element={<HomeOne />}></Route>
          <Route path="/home-tour" element={<HomeTwo />}></Route>
          <Route path="/home-agency" element={<HomeThree />}></Route>
          <Route path="/home-yacht" element={<HomeFour />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/destination" element={<Navigate to="/international-holidays" replace />} />
          <Route path="/destination/:id" element={<RedirectLegacyDestinationDetail />} />
          <Route path="/service" element={<Service />}></Route>
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/activities" element={<Activities />}></Route>
          <Route path="/activities-details" element={<ActivitiesDetails />}></Route>
          <Route path="/activities/:slug" element={<ActivitiesDetails />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/shop/:id" element={<ShopDetails />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/gallery" element={<Gallery />}></Route>
          <Route path="/tour" element={<Tour />}></Route>
          <Route path="/tour-details" element={<TourDetails />}></Route>
          <Route path="/international-holidays" element={<InternationalHolidays />}></Route>
          <Route path="/international-holidays/:slug" element={<TourDetails />}></Route>
          <Route path="/resort" element={<Resort />}></Route>
          <Route path="/resort/:id" element={<ResortDetails />}></Route>
          <Route path="/tour-guide" element={<TourGuide />}></Route>
          <Route path="/tour-guide/:id" element={<TourGuiderDetails />}></Route>
          <Route path="/faq" element={<Faq />}></Route>
          <Route path="/price" element={<Pricing />}></Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogDetails />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
          <Route path="/terms-and-conditions" element={<TermsAndConditions />}></Route>
          <Route path="/cancellation-policy" element={<CancellationPolicy />}></Route>
          <Route path="/ticketing/domestic" element={<TicketingDomestic />}></Route>
          <Route path="/ticketing/international" element={<TicketingInternational />}></Route>
          <Route path="/ticketing/domestic/:slug" element={<TicketingDomesticDetail />}></Route>
          <Route path="/ticketing/international/:slug" element={<TicketingInternationalDetail />}></Route>
          <Route path="/admin/*" element={<AdminApp />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default RouterPage