import React, { useEffect } from 'react'

const Contact = () => {

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
            <h3 className="title text-center">Contact Us</h3>
            <div className="content-text" style={{ padding: '20px', lineHeight: '1.8' }}>
              <p>We’re here to help! If you have any questions, feedback, or need assistance with your order, feel free to reach out to us using the contact details below.</p>

              <h4><strong>Customer Support</strong></h4>
              <ul className="list-style">
                <li><strong>Email:</strong> <a href="mailto:support@aruvia.com">support@aruvia.com</a></li>
                <li><strong>Phone:</strong> +91-98765-43210</li>
                <li><strong>WhatsApp:</strong> +91-98765-43210</li>
              </ul>

              <h4><strong>Office Address</strong></h4>
              <p>
                Aruvia Health Care Pvt. Ltd.<br />
                1st Floor, Wellness Plaza,<br />
                MG Road, Kochi - 682001,<br />
                Kerala, India
              </p>

              <h4><strong>Working Hours</strong></h4>
              <ul className="list-style">
                <li>Monday to Saturday: 10:00 AM – 6:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>

              <h4><strong>Social Media</strong></h4>
              <ul className="list-style">
                <li><a href="https://instagram.com/aruvia" target="_blank" rel="noreferrer">Instagram</a></li>
                <li><a href="https://facebook.com/aruvia" target="_blank" rel="noreferrer">Facebook</a></li>
              </ul>

              <p className="mt-4">We aim to respond to all queries within 24–48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact