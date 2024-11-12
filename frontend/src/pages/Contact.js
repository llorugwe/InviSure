import React from 'react';
import '../styles/PageStyles.css';

const Contact = () => (
  <div className="page-container contact-page">
    <h2>Contact Us</h2>
    <p>We’re here to help! If you have any questions or need assistance, please don’t hesitate to reach out.</p>

    <h3>Customer Support</h3>
    <div className="contact-info">
      <ul>
        <li><strong>Email:</strong> support@invisure.com</li>
        <li><strong>Phone:</strong> +2765 958 3168; +2765 941 7077</li>
      </ul>
    </div>

    <h3>Business Inquiries</h3>
    <p>If you are interested in partnering with InviSure, please contact our business development team.</p>
    <div className="contact-info">
      <ul>
        <li><strong>Email:</strong> partnerships@invisure.com</li>
      </ul>
    </div>

    <h3>Office Location</h3>
    <p>Visit us at:</p>
    <p>Office 603, Arcadia Centre<br />CNR Madiba and Steve Biko Road<br />Pretoria, South Africa</p>

    <h3>Feedback</h3>
    <p>We value your feedback. Reach us at feedback@invisure.com to share your thoughts.</p>
  </div>
);

export default Contact;
