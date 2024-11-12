import React from 'react';
import '../styles/PageStyles.css';

const PrivacyPolicy = () => (
  <div className="page-container privacy-policy-page">
    <h2>Privacy Policy</h2>
    <p>This Privacy Policy explains how InviSure collects, uses, and protects your personal information.</p>

    <h3>Information We Collect</h3>
    <p>We collect information you provide directly to us, such as:</p>
    <ul>
      <li>Contact Information (name, email address, phone number)</li>
      <li>Policy Details (insurance policies purchased, coverage amounts)</li>
      <li>Claim Information (details regarding claims submitted)</li>
      <li>Payment Information (bank account or payment card details for premium payments)</li>
    </ul>

    <h3>How We Use Your Information</h3>
    <p>We use your information to provide and manage our services, including processing claims and improving our offerings.</p>

    <h3>Data Protection and Security</h3>
    <p>Your information is safeguarded through various security measures. However, no method of internet transmission is entirely secure.</p>

    <h3>Your Rights</h3>
    <p>For inquiries regarding data access, updates, or deletion, contact us at privacy@invisure.com.</p>

    <div className="page-footer">
      <p>If you have any questions, please contact us at privacy@invisure.com.</p>
    </div>
  </div>
);

export default PrivacyPolicy;
