import React from 'react';
import '../styles/PageStyles.css';

const TermsOfService = () => (
  <div className="page-container terms-of-service-page">
    <h2>Terms of Service</h2>
    <p>By using InviSure services, you agree to the following terms and conditions.</p>

    <h3>Account Registration</h3>
    <p>You must register an account to use our services. You are responsible for the confidentiality of your account information.</p>

    <h3>Insurance Policies</h3>
    <p>All insurance policies adhere to the terms outlined in the policy documents. Policyholders will be notified of any changes.</p>

    <h3>Claims Process</h3>
    <p>Claims should be submitted within the specified timeframe. We may request additional documentation as needed.</p>

    <h3>Limitation of Liability</h3>
    <p>InviSure is not liable for indirect or consequential damages resulting from service use.</p>

    <div className="page-footer">
      <p>If you have any questions, contact us at terms@invisure.com.</p>
    </div>
  </div>
);

export default TermsOfService;
