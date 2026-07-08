import React from 'react'
import LegalPage from './LegalPage'

const FALLBACK = `
  <p>These Terms &amp; Conditions govern your use of the Dream International Travel and Tours website and the services we provide, including trekking, tours, activities, and ticketing.</p>
  <h3>Bookings</h3>
  <p>A booking is confirmed once we receive the required deposit and a written confirmation from our team. Prices are subject to change until a booking is confirmed.</p>
  <h3>Traveler responsibilities</h3>
  <p>Travelers are responsible for ensuring they meet the fitness, visa, and insurance requirements for their chosen trip.</p>
  <h3>Liability</h3>
  <p>Dream International Travel and Tours acts as an agent for transport, accommodation, and other service providers, and is not liable for circumstances beyond our reasonable control.</p>
  <p>For questions, please contact us via our <a href="/contact">Contact page</a>.</p>
`;

function TermsAndConditions() {
    return (
        <LegalPage
            pageKey="terms-and-conditions"
            title="Terms & Conditions"
            settingsKey="termsContent"
            fallback={FALLBACK}
        />
    );
}

export default TermsAndConditions
