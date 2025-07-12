import React, { useState } from 'react'

const Header = () => {

     const [isCartOpen, setIsCartOpen] = useState(false);
     const [sideBarOpen, setsideBarOpen] = useState(false);

     const handleSideBarToggle = () => {
       setsideBarOpen(prev => !prev);
       document.body.classList.toggle('pushmenu-push-toleft');
     };
     
     const handleSidebarClose = () => {
  setsideBarOpen(false);
  document.body.classList.remove('pushmenu-push-toleft');
};
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };
    
  return (
    <div>
          {/* push menu*/}
  <div className={`pushmenu menu-home5 ${sideBarOpen ? "pushmenu-open" : ""}`}>
    <div className="menu-push">
      <span onClick={handleSidebarClose} className="close-left js-close"><i className="ion-ios-close-empty f-40" /></span>
      <div className="clearfix" />
      <form role="search" method="get" id="searchform" className="searchform" action="https://landing.engotheme.com/search">
        <div>
          <label className="screen-reader-text" htmlFor="q" />
          <input type="text" placeholder="Search for products" defaultValue name="q" id="q" autoComplete="off" />
          <input type="hidden" name="type" defaultValue="product" />
          <button type="submit" id="searchsubmit"><i className="ion-ios-search-strong" /></button>
        </div>
      </form>
      <ul className="nav-home5 js-menubar">
        <li className="level1 active dropdown">
          <a href="#">Home</a>
          <span className="icon-sub-menu" />
          <ul className="menu-level1 js-open-menu">
            <li className="level2"><a href="01-Home-v1.html" title="home1">Demo 1</a></li>
            <li className="level2"><a href="01-Home-v2.html" title="home2">Demo 2</a></li>
            <li className="level2"><a href="01-Home-v3.html" title="home3">Demo 3</a></li>
            <li className="level2"><a href="01-Home-v4.html" title="home4">Demo 4</a></li>
            <li className="level2"><a href="01-Home-v5.html" title="home5">Demo 5</a></li>
            <li className="level2"><a href="01-Home-v6.html" title>Demo 6</a></li>
            <li className="level2"><a href="01-Home-v7.html" title>Demo 7</a></li>
            <li className="level2"><a href="01-Home-v8.html" title>Demo 8</a></li>
            <li className="level2"><a href="01-Home-v9.html" title>Demo 9</a></li>
            <li className="level2"><a href="01-Home-v10.html" title>Demo 10</a></li>
            <li className="level2"><a href="01-Home-v11.html" title>Demo 11</a></li>
          </ul>
        </li>
        <li className="level1 active dropdown"><a href="#">Shop</a>
          <span className="icon-sub-menu" />
          <div className="menu-level1 js-open-menu">
            <ul className="level1">
              <li className="level2">
                <a href="#">Shop Layout</a>
                <ul className="menu-level-2">
                  <li className="level3"><a href="02-Shop_v1.html" title>Shop Page v1</a></li>
                  <li className="level3"><a href="s02-Shop_v2.html" title>Shop Page v1</a></li>
                  <li className="level3"><a href="02-Shop_v3.html" title>Shop Page v3</a></li>
                  <li className="level3"><a href="02-Shop_v4.html" title>Shop Page v4</a></li>
                </ul>
              </li>
              <li className="level2">
                <a href="#">Single Product</a>
                <ul className="menu-level-2">
                  <li className="level3"><a href="03-Single_product_v1.html" title>Single product v1</a></li>
                  <li className="level3"><a href="03-Single_product_v2.html" title>Single product v2</a></li>
                  <li className="level3"><a href="03-Single_product_v3.html" title>Single product v3</a></li>
                  <li className="level3"><a href="03-Single_product_v4.html" title>Single product v1</a></li>
                </ul>
              </li>
              <li className="level2">
                <a href="#">Other Pages</a>
                <ul className="menu-level-2">
                  <li className="level3"><a href="02-Shop_v4.html" title>Shop</a></li>
                  <li className="level3"><a href="13-Cart.html" title>Cart</a></li>
                  <li className="level3"><a href="09-Check-out.html" title>Checkout</a></li>
                  <li className="level3"><a href="08-My-Account.html" title>My Account</a></li>
                </ul>
              </li>
            </ul>
            <div className="clearfix" />
          </div>
        </li>
        <li className="level1">
          <a href="#">Pages</a>
          <span className="icon-sub-menu" />
          <ul className="menu-level1 js-open-menu">
            <li className="level2"><a href="04-About.html" title="About Us ">About Us </a></li>
            <li className="level2"><a href="05-Contact.html" title="Contact">Contact</a></li>
            <li className="level2"><a href="11-FAQS.html" title="FAQs">FAQs</a></li>
            <li className="level2"><a href="10-404.html" title={404}>404</a></li>
            <li className="level2"><a href="12-Coming-Soon.html" title="Coming Soon">Coming Soon</a></li>
          </ul>
        </li>
        <li className="level1">
          <a href="#">Blog</a>
          <span className="icon-sub-menu" />
          <ul className="menu-level1 js-open-menu">
            <li className="level2"><a href="06-Blog.html" title="Blog Standar">Blog Standar</a></li>
            <li className="level2"><a href="07-Blog_single.html" title="Blog Gird">Blog Single</a></li>
          </ul>
        </li>
      </ul>
      <ul className="mobile-account">
        <li><a href="#"><i className="fa fa-unlock-alt" />Login</a></li>
        <li><a href="#"><i className="fa fa-user-plus" />Register</a></li>
        <li><a href="#"><i className="fa fa-heart" />Wishlist</a></li>
      </ul>
      <h4 className="mb-title">connect and follow</h4>
      <div className="mobile-social mg-bottom-30">
        <a href="#"><i className="fa fa-facebook" /></a>
        <a href="#"><i className="fa fa-twitter" /></a>
        <a href="#"><i className="fa fa-google-plus" /></a>
      </div>
    </div>
  </div>
  {/* end push menu*/}
  {/* Push cart */}
  <div className={`pushmenu pushmenu-left cart-box-container ${isCartOpen ? "pushmenu-open" : ""}`}>
    <div className="cart-list">
      <div className="cart-list-heading">
        <h3 className="cart-title">My cart</h3>
        <span onClick={() => setIsCartOpen(false)}
          className="close-left js-close"><i   className="ion-ios-close-empty" /></span>
      </div>
      <div className="cart-inside">
        <ul className="list">
          <li className="item-cart">
            <div className="product-img-wrap">
              <a href="#" title="Product"><img src="./assets/img/home9/product1.png" alt="Product" className="img-responsive" /></a>
            </div>
            <div className="product-details">
              <div className="inner-left">
                <div className="product-name"><a href="#">Aruvia Rosemary </a></div>
                <div className="product-price"><span>₹20.9</span></div>
                <div className="cart-qtt">
                  <button type="button" className="quantity-left-minus btn btn-number js-minus" data-type="minus" data-field>
                    <span className="minus-icon"><i className="ion-ios-minus-empty" /></span>
                  </button>
                  <input type="text" name="number" defaultValue={1} className="product_quantity_number js-number" />
                  <button type="button" className="quantity-right-plus btn btn-number js-plus" data-type="plus" data-field>
                    <span className="plus-icon"><i className="ion-ios-plus-empty" /></span>
                  </button>
                </div>
              </div>
            </div>
          </li>
          <li className="item-cart">
            <div className="product-img-wrap">
              <a href="#" title="Product"><img src="/assets/img/home9/product1.png" alt="Product" className="img-responsive" /></a>
            </div>
            <div className="product-details">
              <div className="inner-left">
                <div className="product-name"><a href="#">Aruvia Rosemary </a></div>
                <div className="product-price"><span>₹20.9</span></div>
                <div className="cart-qtt">
                  <button type="button" className="quantity-left-minus btn btn-number js-minus" data-type="minus" data-field>
                    <span className="minus-icon"><i className="ion-ios-minus-empty" /></span>
                  </button>
                  <input type="text" name="number" defaultValue={1} className="product_quantity_number js-number" />
                  <button type="button" className="quantity-right-plus btn btn-number js-plus" data-type="plus" data-field>
                    <span className="plus-icon"><i className="ion-ios-plus-empty" /></span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div className="cart-bottom">
          <div className="cart-form">
            <div className="cart-note-form">
              <label htmlFor="CartSpecialInstructions" className="cart-note cart-note_text_label small--text-center">Special Offer:</label>
              <textarea rows={6} name="note" id="CartSpecialInstructions" className="cart-note__input form-control note--input" defaultValue={""} />
            </div>
          </div>
          <div className="cart-button mg-top-30">
            <a className="zoa-btn checkout" href="#" title>Check out</a>
          </div>
        </div>
      </div>
      {/* End cart bottom */}
    </div>
  </div>
  {/* End pushcart */}
  {/* Search form */}
  <div className="search-form-wrapper header-search-form">
    <div className="container">
      <div className="search-results-wrapper">
        <div className="btn-search-close">
          <i className="ion-ios-close-empty" />
        </div>
      </div>
      <ul className="zoa-category text-center">
        <li><a href="#">All Categories</a></li>
        <li><a href="#">Woman</a></li>
        <li><a href="#">Man</a></li>
        <li><a href="#">Accessories</a></li>
        <li><a href="#">Kid</a></li>
        <li><a href="#">Others</a></li>
      </ul>
      <form method="get" action="https://landing.engotheme.com/search" role="search" className="search-form  has-categories-select">
        <input name="q" className="search-input" type="text" defaultValue placeholder="Enter your keywords..." autoComplete="off" />
        <input type="hidden" name="post_type" defaultValue="product" />
        <button type="submit" id="search-btn"><i className="ion-ios-search-strong" /></button>
      </form>
    </div>
  </div>
  {/* End search form */}
  {/* Account */}
  <div className="account-form-wrapper">
    <div className="container">
      <div className="search-results-wrapper">
        <div className="btn-search-close">
          <i className="ion-ios-close-empty black" />
        </div>
      </div>
      <div className="account-wrapper">
        <ul className="account-tab text-center">
          <li className="active"><a data-toggle="tab" href="#login">Login</a></li>
          <li><a data-toggle="tab" href="#register">Register</a></li>
        </ul>
        <div className="tab-content">
          <div id="login" className="tab-pane fade in active">
            <div className="row">
              <div className="col-md-4">
                <form method="post" className="form-customer form-login">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">E-mail *</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail1" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zoaname">Name</label>
                    <input type="text" className="form-control form-account" id="zoaname" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password *</label>
                    <input type="password" className="form-control form-account" id="exampleInputPassword1" />
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Sign Up</button>
                  </div>
                </form>
                <div className="social-group-button">
                  <a href="#" className="twitter button">
                    <div className="slide">
                      <p>
                        Connect with Twitter
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-twitter">
                      </i>
                    </div>
                  </a>
                  <a href="#" className="facebook button">
                    <div className="slide">
                      <p>
                        Connect with Facebook
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-facebook">
                      </i>
                    </div>
                  </a>
                </div>
                <span className="text-note">Already have an account? <a href="#">Sign In!</a></span>
              </div>
              <div className="col-md-4">
                <form method="post" className="form-customer form-register">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail2">E-mail</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail2" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword3">Password</label>
                    <input type="password" className="form-control form-account" id="exampleInputPassword3" />
                  </div>
                  <div className="flex justify-content-between mg-30">
                    <div className="checkbox">
                      <input data-val="true" data-val-required="The Remember me? field is required." id="RememberMe" name="RememberMe" type="checkbox" defaultValue="true" />
                      <input name="RememberMe" type="hidden" defaultValue="false" />
                      <label htmlFor="RememberMe">Remember me</label>
                    </div>
                    <a href="#" className="text-note no-mg">Forgot Password?</a>
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Sign In</button>
                  </div>
                </form>
                <div className="social-group-button">
                  <a href="#" className="twitter button">
                    <div className="slide">
                      <p>
                        Connect with Twitter
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-twitter">
                      </i>
                    </div>
                  </a>
                  <a href="#" className="facebook button">
                    <div className="slide">
                      <p>
                        Connect with Facebook
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-facebook">
                      </i>
                    </div>
                  </a>
                </div>
                <span className="text-note">Don’t have an account? <a href="#">Register!</a></span>
              </div>
              <div className="col-md-4">
                <form method="post" className="form-customer form-reset">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail5">E-mail *</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail5" />
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Reset Password</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div id="register" className="tab-pane fade">
            <div className="row">
              <div className="col-md-4">
                <form method="post" className="form-customer form-login">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail7">E-mail *</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail7" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zoaname2">Name</label>
                    <input type="text" className="form-control form-account" id="zoaname2" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword2">Password *</label>
                    <input type="password" className="form-control form-account" id="exampleInputPassword2" />
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Sign Up</button>
                  </div>
                </form>
                <div className="social-group-button">
                  <a href="#" className="twitter button">
                    <div className="slide">
                      <p>
                        Connect with Twitter
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-twitter">
                      </i>
                    </div>
                  </a>
                  <a href="#" className="facebook button">
                    <div className="slide">
                      <p>
                        Connect with Facebook
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-facebook">
                      </i>
                    </div>
                  </a>
                </div>
                <span className="text-note">Already have an account? <a href="#">Sign In!</a></span>
              </div>
              <div className="col-md-4">
                <form method="post" className="form-customer form-register">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail6">E-mail</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail6" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword4">Password</label>
                    <input type="password" className="form-control form-account" id="exampleInputPassword4" />
                  </div>
                  <div className="flex justify-content-between mg-30">
                    <div className="checkbox">
                      <input data-val="true" data-val-required="The Remember me? field is required." id="RememberMe2" name="RememberMe" type="checkbox" defaultValue="true" />
                      <input name="RememberMe" type="hidden" defaultValue="false" />
                      <label htmlFor="RememberMe2">Remember me</label>
                    </div>
                    <a href="#" className="text-note no-mg">Forgot Password?</a>
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Sign In</button>
                  </div>
                </form>
                <div className="social-group-button">
                  <a href="#" className="twitter button">
                    <div className="slide">
                      <p>
                        Connect with Twitter
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-twitter">
                      </i>
                    </div>
                  </a>
                  <a href="#" className="facebook button">
                    <div className="slide">
                      <p>
                        Connect with Facebook
                      </p>
                    </div>
                    <div className="icon">
                      <i className="fa fa-facebook">
                      </i>
                    </div>
                  </a>
                </div>
                <span className="text-note">Don’t have an account? <a href="#">Register!</a></span>
              </div>
              <div className="col-md-4">
                <form method="post" className="form-customer form-reset">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail4">E-mail *</label>
                    <input type="email" className="form-control form-account" id="exampleInputEmail4" />
                  </div>
                  <div className="btn-button-group mg-top-30 mg-bottom-15">
                    <button type="submit" className="zoa-btn btn-login hover-white">Reset Password</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* End Account */}
  </div>
          <header id="header" className="header-v1">
      <div className="header-center">
        <div className="container container-content ">
          <div className="row flex align-items-center justify-content-between">
            <div className="col-md-4 col">
              <div className="topbar-right">
                <div className="element">
                  <a onClick={handleSideBarToggle} className={`icon-pushmenu js-push-menu ${sideBarOpen ? "active" : ""}`}>
                    <svg width={26} height={16} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 41" style={{enableBackground: 'new 0 0 66 41'}} xmlSpace="preserve">
                      <style type="text/css" dangerouslySetInnerHTML={{__html: "\n                                                .st0 {\n                                                    fill: none;\n                                                    stroke: #000000;\n                                                    stroke-width: 3;\n                                                    stroke-linecap: round;\n                                                    stroke-miterlimit: 10;\n                                                }\n                                                " }} />
                      <g>
                        <line className="st0" x1="1.5" y1="1.5" x2="64.5" y2="1.5" />
                        <line className="st0" x1="1.5" y1="20.5" x2="64.5" y2="20.5" />
                        <line className="st0" x1="1.5" y1="39.5" x2="64.5" y2="39.5" />
                      </g>
                    </svg>
                  </a>
                </div>
                
              </div>
            </div>
            <div className="col-md-4 col flex justify-content-center">
              <a href="#"><img style={{height:'75px'}} src="/assets/img/logo.jpg" alt className="img-reponsive" /></a>
            </div>
            <div className="col-md-4 col flex justify-content-end">
              <div className="topbar-left">
                <div className="element element-search hidden-xs hidden-sm">
                  <a href="#" className="zoa-icon search-toggle">
                    <svg width={20} height={20} version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 90 90" style={{enableBackground: 'new 0 0 90 90'}} xmlSpace="preserve">
                      <g>
                        <path d="M0,39.4C0,50,4.1,59.9,11.6,67.3c7.4,7.5,17.3,11.6,27.8,11.6c9.5,0,18.5-3.4,25.7-9.5l19.8,19.7c1.2,1.2,3.1,1.2,4.2,0
  c0.6-0.6,0.9-1.3,0.9-2.1s-0.3-1.5-0.9-2.1L69.3,65.1c6.2-7.1,9.5-16.2,9.5-25.7c0-10.5-4.1-20.4-11.6-27.9C59.9,4.1,50,0,39.4,0
  C28.8,0,19,4.1,11.6,11.6S0,28.9,0,39.4z M63.1,15.8c6.3,6.3,9.8,14.7,9.8,23.6S69.4,56.7,63.1,63s-14.7,9.8-23.6,9.8
  S22.2,69.3,15.9,63C9.5,56.8,6,48.4,6,39.4s3.5-17.3,9.8-23.6S30.5,6,39.4,6S56.8,9.5,63.1,15.8z" />
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="element element-user hidden-xs hidden-sm">
                  <a href="#" className="zoa-icon js-user">
                    <svg width={19} height={20} version="1.1" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 102.8" style={{enableBackground: 'new 0 0 100 102.8'}} xmlSpace="preserve">
                      <g>
                        <path d="M75.7,52.4c-2.1,2.3-4.4,4.3-7,6C82.2,58.8,93,69.9,93,83.5v12.3H7V83.5c0-13.6,10.8-24.7,24.3-25.1c-2.6-1.7-5-3.7-7-6
  C10.3,55.9,0,68.5,0,83.5v15.8c0,1.9,1.6,3.5,3.5,3.5h93c1.9,0,3.5-1.6,3.5-3.5V83.5C100,68.5,89.7,55.9,75.7,52.4z" />
                        <g>
                          <path d="M50,58.9c-16.2,0-29.5-13.2-29.5-29.5S33.8,0,50,0s29.5,13.2,29.5,29.5S66.2,58.9,50,58.9z M50,7
      C37.6,7,27.5,17.1,27.5,29.5S37.6,51.9,50,51.9s22.5-10.1,22.5-22.5S62.4,7,50,7z" />
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="element element-cart">
                  <a onClick={handleCartToggle} className="zoa-icon icon-cart">
                    <svg width={20} height={20} version="1.1" id="Layer_4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.4 55.4" style={{enableBackground: 'new 0 0 55.4 55.4'}} xmlSpace="preserve">
                      <g>
                        <rect x="0.2" y="17.4" width={55} height="3.4" />
                      </g>
                      <g>
                        <polygon points="7.1,55.4 3.4,27.8 3.4,24.1 7.3,24.1 7.3,27.6 10.5,51.6 44.9,51.6 48.1,27.6 48.1,24.1 52,24.1 52,27.9 
  48.3,55.4   " />
                      </g>
                      <g>
                        <path d="M14,31.4c-0.1,0-0.3,0-0.5-0.1c-1-0.2-1.6-1.3-1.4-2.3L19,1.5C19.2,0.6,20,0,20.9,0c0.1,0,0.3,0,0.4,0
  c0.5,0.1,0.9,0.4,1.2,0.9c0.3,0.4,0.4,1,0.3,1.5l-6.9,27.5C15.6,30.8,14.8,31.4,14,31.4z" />
                      </g>
                      <g>
                        <path d="M41.5,31.4c-0.9,0-1.7-0.6-1.9-1.5L32.7,2.4c-0.1-0.5,0-1.1,0.3-1.5s0.7-0.7,1.2-0.8c0.1,0,0.3,0,0.4,0
  c0.9,0,1.7,0.6,1.9,1.5L43.4,29c0.1,0.5,0,1-0.2,1.5c-0.3,0.5-0.7,0.8-1.1,0.9c-0.2,0-0.3,0-0.4,0.1C41.6,31.4,41.6,31.4,41.5,31.4
  z" />
                      </g>
                    </svg>
                    <span className="count cart-count">0</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </div>
  )
}

export default Header