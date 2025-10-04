import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
          <footer style={{paddingTop:'25px', paddingBottom:'25px'}} className="footer pt-50 pb-50 v2 bg-black">
    <div className="container">
      <div className="f-content ">
        <div className="f-col hidden-xs hidden-sm">
          <a href="#">
          </a>
        </div>
        <div className="f-col align-items-center">
          
          <p style={{textWrap:'nowrap'}}>© 2025 <a className="red" href="/">Aruvia.</a></p>
          <ul style={{textWrap:'nowrap'}}>
            <li><Link to={'/delivery-policy'}>Delivery Policy</Link></li>
            <li><Link to={'/terms-and-conditions'}>Terms of Use</Link></li>
            <li><Link to={'/privacy-policy'}>Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="f-col">
          <div className="social">
            <a href="https://www.instagram.com/aruvia_official/?hl=en"><i className="fa fa-instagram" /></a>
            <a href="https://www.facebook.com/p/Aruvia-61575856720618/"><i className="fa fa-facebook" /></a>
         
          </div>
        </div>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer