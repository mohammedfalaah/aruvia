import React, { useEffect } from 'react'

const Delivery = () => {

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
            <h3 className="title text-center">Shipping & Delivery Policy</h3>
            <div className="content-text" style={{ padding: '20px', lineHeight: '1.8' }}>
              <p><strong>Effective Date:</strong> July 24, 2025</p>

              <h4><strong>1. Shipping Time</strong></h4>
              <ul className="list-style">
                <li>All orders are processed within 1–2 business days (excluding Sundays and holidays).</li>
                <li>Orders placed after 4:00 PM will be processed the next business day.</li>
              </ul>

              <h4><strong>2. Delivery Time</strong></h4>
              <ul className="list-style">
                <li>Metro Cities: 2–4 working days</li>
                <li>Other Cities: 3–7 working days</li>
                <li>Remote Areas: Up to 10 working days</li>
              </ul>

              <h4><strong>3. Shipping Charges</strong></h4>
              <ul className="list-style">
                <li>Free shipping on orders above ₹499.</li>
                <li>Orders below ₹499 will incur a flat shipping fee of ₹49.</li>
              </ul>

              <h4><strong>4. Order Tracking</strong></h4>
              <p>Once your order is shipped, you will receive an SMS/email with the tracking number and a link to track your shipment in real time.</p>

              <h4><strong>5. Delivery Address</strong></h4>
              <p>Please ensure the shipping address and contact details are correct. We are not responsible for delays or failed deliveries due to incorrect or incomplete address information.</p>

              <h4><strong>6. Delayed or Lost Deliveries</strong></h4>
              <p>If your package is significantly delayed or lost in transit, please reach out to our support team for assistance and we will help resolve the issue.</p>

              <h4><strong>7. Shipping Locations</strong></h4>
              <p>We currently ship only within India.</p>

              <h4><strong>8. Contact Us</strong></h4>
              <p>
                Email: <a href="mailto:support@aruvia.com">support@aruvia.com</a><br />
                Phone: +91-98765-43210
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Delivery