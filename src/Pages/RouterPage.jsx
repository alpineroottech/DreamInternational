import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import HomeOne from './HomeOne'
import LoadTop from '../Components/LoadTop'

const HomeTwo = lazy(() => import('./HomeTwo'))
const HomeThree = lazy(() => import('./HomeThree'))
const HomeFour = lazy(() => import('./HomeFour'))
const About = lazy(() => import('./About'))
const Service = lazy(() => import('./Service'))
const ServiceDetails = lazy(() => import('./ServiceDetails'))
const Activities = lazy(() => import('./Activities'))
const ActivitiesDetails = lazy(() => import('./ActivitiesDetails'))
const VehicleRentals = lazy(() => import('./VehicleRentals'))
const VehicleRentalDetails = lazy(() => import('./VehicleRentalDetails'))
const Shop = lazy(() => import('./Shop'))
const ShopDetails = lazy(() => import('./ShopDetails'))
const Cart = lazy(() => import('./Cart'))
const Checkout = lazy(() => import('./Checkout'))
const Wishlist = lazy(() => import('./Wishlist'))
const Gallery = lazy(() => import('./Gallery'))
const Tour = lazy(() => import('./Tour'))
const TourDetails = lazy(() => import('./TourDetails'))
const InternationalHolidays = lazy(() => import('./InternationalHolidays'))
const Resort = lazy(() => import('./Resort'))
const ResortDetails = lazy(() => import('./ResortDetails'))
const TourGuide = lazy(() => import('./TourGuide'))
const TourGuiderDetails = lazy(() => import('./TourGuiderDetails'))
const Faq = lazy(() => import('./Faq'))
const Pricing = lazy(() => import('./Pricing'))
const Error = lazy(() => import('./Error'))
const Blog = lazy(() => import('./Blog'))
const BlogDetails = lazy(() => import('./BlogDetails'))
const Contact = lazy(() => import('./Contact'))
const AdminApp = lazy(() => import('../admin/AdminApp'))
const TicketingDomestic = lazy(() => import('./TicketingDomestic'))
const TicketingInternational = lazy(() => import('./TicketingInternational'))
const TicketingDomesticDetail = lazy(() =>
  import('./TicketingRouteDetail').then((m) => ({ default: m.TicketingDomesticDetail }))
)
const TicketingInternationalDetail = lazy(() =>
  import('./TicketingRouteDetail').then((m) => ({ default: m.TicketingInternationalDetail }))
)
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./TermsAndConditions'))
const CancellationPolicy = lazy(() => import('./CancellationPolicy'))

function RouteFallback() {
  return (
    <div className="di-route-loading" role="status" aria-live="polite">
      Loading…
    </div>
  )
}

function RedirectLegacyDestinationDetail() {
  const { id } = useParams();
  return <Navigate to={`/international-holidays/${id}`} replace />;
}

function RouterPage() {
  return (
    <div>
      <Router>
        <LoadTop />
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/vehicle-rentals" element={<VehicleRentals />}></Route>
            <Route path="/vehicle-rentals/:slug" element={<VehicleRentalDetails />}></Route>
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
        </Suspense>
      </Router>
    </div>
  )
}

export default RouterPage
