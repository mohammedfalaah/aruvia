import React from 'react'

const Refund = () => {
  return (
    <div>
        <div className="container container-content">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12">
          <div className="zoa-product pad4">
            <h3 className="title text-center">Cancellation & Refund Policy</h3>
            <div className="content-text" style={{ padding: '20px', lineHeight: '1.8' }}>
              <p><strong>Effective Date:</strong> July 24, 2025</p>

              <h4><strong>1. Order Cancellation</strong></h4>
              <p>Orders can be canceled only before they are dispatched. Once shipped, cancellations are not accepted.</p>
              <p>To cancel your order, please contact our support team immediately at:</p>
              <ul className="list-style">
                <li>Email: <a href="mailto:support@aruvia.com">support@aruvia.com</a></li>
                <li>Phone: +91-98765-43210</li>
              </ul>

              <h4><strong>2. Refunds</strong></h4>
              <ul className="list-style">
                <li>Refunds are processed within 5–7 business days after approval.</li>
                <li>Prepaid refunds will be credited to the original payment method.</li>
                <li>We will notify you via email or phone once your refund is initiated.</li>
              </ul>

              <h4><strong>3. Non-Returnable Items</strong></h4>
              <p>Due to hygiene and safety concerns, the following items are not eligible for return:</p>
              <ul className="list-style">
                <li>Opened or used skin care and hair care products</li>
                <li>Items without original packaging or seals broken</li>
              </ul>

              <h4><strong>4. Damaged or Wrong Products</strong></h4>
              <p>If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photos of the package and product. We’ll investigate and offer a suitable resolution such as replacement or refund.</p>

              <h4><strong>5. Contact for Help</strong></h4>
              <p>If you have any questions or need support regarding your order:</p>
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

export default Refund