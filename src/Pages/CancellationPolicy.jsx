import React from 'react'
import LegalPage from './LegalPage'

const FALLBACK = `
  <p>We understand that plans can change. Our cancellation policy below applies to trekking packages, tours, and activities booked directly with Dream International Travel and Tours.</p>
  <h3>Cancellation timeline</h3>
  <ul>
    <li>30+ days before departure: full refund minus a processing fee.</li>
    <li>15–29 days before departure: 50% refund.</li>
    <li>Less than 15 days before departure: non-refundable.</li>
  </ul>
  <h3>Rebooking</h3>
  <p>We're happy to help you reschedule where possible instead of cancelling outright — reach out to our team as early as you can.</p>
  <p>For flight tickets, cancellation terms follow the issuing airline's policy. Contact us via our <a href="/contact">Contact page</a> for help with a specific booking.</p>
`;

function CancellationPolicy() {
    return (
        <LegalPage
            pageKey="cancellation-policy"
            title="Cancellation Policy"
            settingsKey="cancellationPolicyContent"
            fallback={FALLBACK}
        />
    );
}

export default CancellationPolicy
