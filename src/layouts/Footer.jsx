import React from 'react'

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
          
          <p>© 2025 <a className="red" href="#">Aruvia.</a></p>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>
        <div className="f-col">
          <div className="social">
            <a href="#"><i className="fa fa-instagram" /></a>
            <a href="#"><i className="fa fa-facebook" /></a>
            <a href="#"><i className="fa fa-linkedin" /></a>
         
          </div>
        </div>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer