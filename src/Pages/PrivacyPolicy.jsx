import React from 'react'
import LegalPage from './LegalPage'

const FALLBACK = `
  <p>Dream International Travel and Tours ("we", "us") respects your privacy. This policy explains what information we collect when you use our website or book a trip with us, and how we use it.</p>
  <h3>Information we collect</h3>
  <p>We collect the information you provide through inquiry and booking forms — name, email, phone number, and trip preferences — along with basic analytics about how our site is used.</p>
  <h3>How we use it</h3>
  <p>We use your information to respond to inquiries, process bookings, and send trip-related updates. We do not sell your personal information to third parties.</p>
  <h3>Contact us</h3>
  <p>If you have questions about this policy, please reach out via our <a href="/contact">Contact page</a>.</p>
`;

function PrivacyPolicy() {
    return (
        <LegalPage
            pageKey="privacy-policy"
            title="Privacy Policy"
            settingsKey="privacyPolicyContent"
            fallback={FALLBACK}
        />
    );
}

export default PrivacyPolicy
