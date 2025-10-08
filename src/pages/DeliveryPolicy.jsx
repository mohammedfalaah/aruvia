import React, { useEffect } from 'react'
import SEO from '../services/SEO';

const DeliveryPolicy = () => {

  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, []);

  return (
   <div className="container container-content">
    <SEO
  title="Delivery Policy"
  description="Fast and reliable delivery of herbal products across India. Learn about our delivery process."
  url="https://aruviaherbals.com/delivery-policy"
/>
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12">
          <div className="zoa-product pad4">
            <h3 className="title text-center">Privacy Policy</h3>
            <div className="content-text" style={{ padding: '20px', lineHeight: '1.8' }}>
              <p><strong>Effective Date:</strong> July 24, 2025</p>

              <h4><strong>1. Information We Collect</strong></h4>
              <ul className="list-style">
                <li>Personal Information: Name, Email, Phone Number, Address</li>
                <li>Payment Information: Processed securely via third-party payment gateways</li>
                <li>Technical Info: Browser type, IP address, visited pages, etc.</li>
              </ul>

              <h4><strong>2. How We Use Your Information</strong></h4>
              <ul className="list-style">
                <li>To process and deliver your orders</li>
                <li>To provide customer support</li>
                <li>To send you updates and promotional offers</li>
                <li>To improve website functionality and user experience</li>
              </ul>

              <h4><strong>3. Sharing of Information</strong></h4>
              <p>We do not sell your data. Your data is only shared with delivery services, secure payment gateways, and analytics tools, where necessary.</p>

              <h4><strong>4. Data Security</strong></h4>
              <p>We use HTTPS encryption, firewalls, and regular audits to keep your data safe.</p>

              <h4><strong>5. Your Rights</strong></h4>
              <ul className="list-style">
                <li>Request a copy of your data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out from marketing emails</li>
              </ul>

              <h4><strong>6. Contact Us</strong></h4>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p>Email: <a href="mailto:support@aruvia.com">support@aruvia.com</a><br />Phone: +91-98765-43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPolicy