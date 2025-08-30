import React, { useEffect } from 'react'

const TermsCondition = () => {

  useEffect(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, []);

  return (
    <div>
        <div className="container container-content">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12">
          <div className="zoa-product pad4">
            <h3 className="title text-center">Terms and Conditions</h3>
            <div className="content-text" style={{ padding: '20px', lineHeight: '1.8' }}>
              <p><strong>Effective Date:</strong> July 24, 2025</p>

              <h4><strong>1. Introduction</strong></h4>
              <p>Welcome to Aruvia. These Terms and Conditions govern your use of our website and purchase of our Ayurvedic health care products.</p>

              <h4><strong>2. Products & Usage</strong></h4>
              <p>All products sold are for external use only unless otherwise specified. Please perform a patch test before full application and consult a medical professional if unsure.</p>

              <h4><strong>3. Order Process</strong></h4>
              <p>Once you place an order, you’ll receive an email confirmation. Orders cannot be modified once processed. We reserve the right to cancel any order due to stock issues or payment problems.</p>

              <h4><strong>4. Pricing & Payment</strong></h4>
              <p>All prices are displayed in INR and include applicable taxes. We reserve the right to change prices at any time without notice.</p>

              <h4><strong>5. Returns & Refunds</strong></h4>
              <p>Our return/refund policy is outlined <a href="/cancellation-refund">here</a>. Please review it before making a purchase.</p>

              <h4><strong>6. Intellectual Property</strong></h4>
              <p>All content on this site (images, text, logos, etc.) is the property of Aruvia and may not be used without permission.</p>

              <h4><strong>7. Limitation of Liability</strong></h4>
              <p>We are not liable for allergic reactions, misuse of products, or inaccurate application of product information.</p>

              <h4><strong>8. Governing Law</strong></h4>
              <p>These Terms are governed by and interpreted in accordance with the laws of India. Any disputes will be handled in the jurisdiction of Kochi, Kerala.</p>

              <h4><strong>9. Contact Us</strong></h4>
              <p>For any queries about these terms, please reach out to us:</p>
              <p>Email: <a href="mailto:support@aruvia.com">support@aruvia.com</a><br />Phone: +91-98765-43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TermsCondition