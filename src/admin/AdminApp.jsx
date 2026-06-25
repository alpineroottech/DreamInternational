import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DestinationsList from "./pages/DestinationsList";
import DestinationEdit from "./pages/DestinationEdit";
import ResourceList from "./pages/ResourceList";
import ResourceEditor from "./pages/ResourceEditor";
import HomepageBuilder from "./pages/HomepageBuilder";
import Navigation from "./pages/Navigation";
import Inquiries from "./pages/Inquiries";
import Settings from "./pages/Settings";
import MediaLibrary from "./pages/MediaLibrary";
import TicketingPages from "./pages/TicketingPages";
import FlightInquiries from "./pages/FlightInquiries";
import { RESOURCE_CONFIG } from "./resourceConfig";
import "./admin.css";

function Protected({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="" element={<Protected><Dashboard /></Protected>} />
        <Route path="homepage" element={<Protected><HomepageBuilder /></Protected>} />
        <Route path="navigation" element={<Protected><Navigation /></Protected>} />
        <Route path="inquiries" element={<Protected><Inquiries /></Protected>} />
        <Route path="media" element={<Protected><MediaLibrary /></Protected>} />
        <Route path="settings" element={<Protected><Settings /></Protected>} />
        <Route path="ticketing-pages" element={<Protected><TicketingPages /></Protected>} />
        <Route path="flight-inquiries" element={<Protected><FlightInquiries /></Protected>} />

        {/* Destinations keeps its bespoke editor */}
        <Route path="destinations" element={<Protected><DestinationsList /></Protected>} />
        <Route path="destinations/new" element={<Protected><DestinationEdit /></Protected>} />
        <Route path="destinations/:id/edit" element={<Protected><DestinationEdit /></Protected>} />

        {/* Config-driven resources */}
        {Object.keys(RESOURCE_CONFIG).map((resource) => (
          <React.Fragment key={resource}>
            <Route path={`${resource}`} element={<Protected><ResourceListWrapper resource={resource} /></Protected>} />
            <Route path={`${resource}/new`} element={<Protected><ResourceEditorWrapper resource={resource} /></Protected>} />
            <Route path={`${resource}/:id/edit`} element={<Protected><ResourceEditorWrapper resource={resource} /></Protected>} />
          </React.Fragment>
        ))}

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// Thin wrappers inject the resource key (routes use literal path segments,
// so it isn't available via useParams).
function ResourceListWrapper({ resource }) {
  return <ResourceList resource={resource} />;
}
function ResourceEditorWrapper({ resource }) {
  return <ResourceEditor resource={resource} />;
}
