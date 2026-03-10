import React, { useContext, useState, useEffect } from 'react'
import { contextData } from '../services/Context';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const { 
        handleSidebarClose, 
        sideBarOpen, 
        handleSideBarToggle,
        isCartOpen, 
        setIsCartOpen,
        handleCartToggle,
        cartItems,
        getCartTotal,
        getCartItemCount,
        updateCartItemQuantity,
        removeFromCart,
        loading
    } = useContext(contextData);

    const navigate = useNavigate();
    const cartCount = getCartItemCount();
    const [isSticky, setIsSticky] = useState(false);

    // Handle scroll event for sticky header
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            const stickyOffset = 100; // Adjust this value as needed
            
            if (offset > stickyOffset) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle quantity increment
    const handleQuantityIncrease = async (productId, currentQuantity) => {
        await updateCartItemQuantity(productId, currentQuantity + 1);
    };

    // Handle quantity decrement
    const handleQuantityDecrease = async (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            await updateCartItemQuantity(productId, currentQuantity - 1);
        } else {
            await removeFromCart(productId);
        }
    };

    // Handle remove item
    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    // Handle Shop navigation
    const handleShopClick = () => {
        // First close the sidebar
        handleSidebarClose();
        
        // Navigate to home if not already there
        if (window.location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                scrollToFeaturedProducts();
            }, 100);
        } else {
            // Already on home page, just scroll
            scrollToFeaturedProducts();
        }
    };

    // Function to scroll to featured products section
    const scrollToFeaturedProducts = () => {
        const featuredSection = document.getElementById('future-product');
        if (featuredSection) {
            featuredSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Handle Social navigation - scroll to Instagram section
    const handleSocialClick = () => {
        // Navigate to home if not already there
        if (window.location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                scrollToInstagramSection();
            }, 100);
        } else {
            // Already on home page, just scroll
            scrollToInstagramSection();
        }
    };

    // Function to scroll to Instagram section
    const scrollToInstagramSection = () => {
        const instagramSection = document.querySelector('.instagram-modern');
        if (instagramSection) {
            instagramSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div>
            {/* push menu*/}
            <div className={`pushmenu menu-home5 ${sideBarOpen ? "pushmenu-open" : ""}`}>
                <div className="menu-push">
                    <span onClick={handleSidebarClose} className="close-left js-close">
                        <i className="ion-ios-close-empty f-40" />
                    </span>
                    <div className="clearfix" />
                  
                    <ul className="nav-home5 js-menubar">
                        <li className="level1 active dropdown">
                            <Link to="/" onClick={handleSidebarClose}>Home</Link>
                        </li>
                        <li className="level1 active dropdown">
                            <Link to="/products" onClick={handleSidebarClose}>Shop</Link>
                        </li>
                        <li className="level1 active dropdown">
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSocialClick();
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                Social
                            </a>
                        </li>
                        <li className="level1">
                            <Link to="/checkout" onClick={handleSidebarClose}>Checkout</Link>
                        </li>
                        <li className="level1">
                            <Link to="/contact-us" onClick={handleSidebarClose}>Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* end push menu*/}
            
            {/* Push cart */}
            <div className={`pushmenu pushmenu-left cart-box-container ${isCartOpen ? "pushmenu-open" : ""}`}>
                <div className="cart-list">
                    <div className="cart-list-heading">
                        <h3 className="cart-title">My cart</h3>
                        <span onClick={() => setIsCartOpen(false)} className="close-left js-close">
                            <i className="ion-ios-close-empty" />
                        </span>
                    </div>
                    <div className="cart-inside">
                         {cartItems && cartItems.length > 0 ? (
                            <>
                                <ul className="list">
                                    {cartItems.map((item) => (
                                        <li key={item._id || item.productId} className="item-cart">
                                            <div className="product-img-wrap">
                                                <a href="#" title={item.name}>
                                                    <img 
                                                        src={item.image || "/assets/img/home9/product1.png"} 
                                                        alt={item.name} 
                                                        className="img-responsive" 
                                                    />
                                                </a>
                                            </div>
                                            <div className="product-details">
                                                <div className="inner-left">
                                                    <div className="product-name">
                                                        <a href="#">{item.name}</a>
                                                        {/* Remove button */}
                                                        <button 
                                                            onClick={() => handleRemoveItem(item._id || item.productId)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#dc3545',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                marginLeft: '10px'
                                                            }}
                                                            title="Remove item"
                                                        >
                                                            <i className="ion-ios-close-empty"></i>
                                                        </button>
                                                    </div>
                                                    <div className="product-price">
                                                        <span>₹{item.price}</span>
                                                        <small style={{ marginLeft: '5px', color: '#666' }}>
                                                            (₹{(item.price * item.quantity).toFixed(2)})
                                                        </small>
                                                    </div>
                                                    <div className="cart-qtt">
                                                        <button 
                                                            type="button" 
                                                            className="quantity-left-minus btn btn-number js-minus" 
                                                            onClick={() => handleQuantityDecrease(item._id || item.productId, item.quantity)}
                                                            disabled={loading}
                                                        >
                                                            <span className="minus-icon">
                                                                <i className="ion-ios-minus-empty" />
                                                            </span>
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            value={item.quantity} 
                                                            className="product_quantity_number js-number" 
                                                            readOnly
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="quantity-right-plus btn btn-number js-plus" 
                                                            onClick={() => handleQuantityIncrease(item._id || item.productId, item.quantity)}
                                                            disabled={loading}
                                                        >
                                                            <span className="plus-icon">
                                                                <i className="ion-ios-plus-empty" />
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="cart-bottom">
                                    <div className="cart-total" style={{ padding: '15px 0', borderTop: '1px solid #eee' }}>
                                        <h4>Total: ₹{getCartTotal().toFixed(2)}</h4>
                                    </div>
                                    <div className="cart-button mg-top-30">
                                        <Link 
                                            to={'/checkout'} 
                                            className="zoa-btn checkout" 
                                            title=""
                                            onClick={() => {
                                                // Close the cart sidebar (not the main sidebar)
                                                setIsCartOpen(false);
                                            }}
                                        >
                                            Check out (₹{getCartTotal().toFixed(2)})
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="empty-cart" style={{ textAlign: 'center', padding: '20px' }}>
                                <i className="ion-ios-cart" style={{ fontSize: '48px', color: '#ccc', marginBottom: '10px' }}></i>
                                <p style={{ color: '#666' }}>Your cart is empty</p>
                                <button 
                                    onClick={() => setIsCartOpen(false)}
                                    className="zoa-btn"
                                    style={{ marginTop: '10px' }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                    {/* End cart bottom */}
                </div>
            </div>
            
            {/* Search form */}
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
                                                    <p>Connect with Twitter</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-twitter"></i>
                                                </div>
                                            </a>
                                            <a href="#" className="facebook button">
                                                <div className="slide">
                                                    <p>Connect with Facebook</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-facebook"></i>
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
                                                    <p>Connect with Twitter</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-twitter"></i>
                                                </div>
                                            </a>
                                            <a href="#" className="facebook button">
                                                <div className="slide">
                                                    <p>Connect with Facebook</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-facebook"></i>
                                                </div>
                                            </a>
                                        </div>
                                        <span className="text-note">Don't have an account? <a href="#">Register!</a></span>
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
                                                    <p>Connect with Twitter</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-twitter"></i>
                                                </div>
                                            </a>
                                            <a href="#" className="facebook button">
                                                <div className="slide">
                                                    <p>Connect with Facebook</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-facebook"></i>
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
                                                    <p>Connect with Twitter</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-twitter"></i>
                                                </div>
                                            </a>
                                            <a href="#" className="facebook button">
                                                <div className="slide">
                                                    <p>Connect with Facebook</p>
                                                </div>
                                                <div className="icon">
                                                    <i className="fa fa-facebook"></i>
                                                </div>
                                            </a>
                                        </div>
                                        <span className="text-note">Don't have an account? <a href="#">Register!</a></span>
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
            
            <header id="header" className={`header-v1 modern-enhanced ${isSticky ? 'sticky-header' : ''}`}>
                <div className="header-center">
                    <div className="container container-content">
                        <div className="header-row-responsive">
                            {/* Mobile Layout */}
                            <div className="mobile-header d-md-none">
                                <div className="mobile-left">
                                    <a onClick={handleSideBarToggle} className={`icon-pushmenu js-push-menu modern-menu-btn ${sideBarOpen ? "active" : ""}`}>
                                        <svg width={24} height={14} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66 41" style={{enableBackground: 'new 0 0 66 41'}} xmlSpace="preserve">
                                            <style type="text/css" dangerouslySetInnerHTML={{__html: "\n                                                .st0 {\n                                                    fill: none;\n                                                    stroke: #000000;\n                                                    stroke-width: 3;\n                                                    stroke-linecap: round;\n                                                    stroke-miterlimit: 10;\n                                                }\n                                                " }} />
                                            <g>
                                                <line className="st0" x1="1.5" y1="1.5" x2="64.5" y2="1.5" />
                                                <line className="st0" x1="1.5" y1="20.5" x2="64.5" y2="20.5" />
                                                <line className="st0" x1="1.5" y1="39.5" x2="64.5" y2="39.5" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                                
                                <div className="mobile-center">
                                    <Link to="/" className="modern-logo-link">
                                        <img src="/assets/img/logo.jpg" alt="Aruvia Herbals" className="img-reponsive modern-logo mobile-logo" />
                                    </Link>
                                </div>
                                
                                <div className="mobile-right">
                                    <a onClick={handleCartToggle} className="zoa-icon icon-cart modern-cart-btn mobile-cart">
                                        <svg width={18} height={18} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.4 55.4" style={{enableBackground: 'new 0 0 55.4 55.4'}} xmlSpace="preserve">
                                            <g>
                                                <rect x="0.2" y="17.4" width={55} height="3.4" />
                                            </g>
                                            <g>
                                                <polygon points="7.1,55.4 3.4,27.8 3.4,24.1 7.3,24.1 7.3,27.6 10.5,51.6 44.9,51.6 48.1,27.6 48.1,24.1 52,24.1 52,27.9 48.3,55.4" />
                                            </g>
                                            <g>
                                                <path d="M14,31.4c-0.1,0-0.3,0-0.5-0.1c-1-0.2-1.6-1.3-1.4-2.3L19,1.5C19.2,0.6,20,0,20.9,0c0.1,0,0.3,0,0.4,0c0.5,0.1,0.9,0.4,1.2,0.9c0.3,0.4,0.4,1,0.3,1.5l-6.9,27.5C15.6,30.8,14.8,31.4,14,31.4z" />
                                            </g>
                                            <g>
                                                <path d="M41.5,31.4c-0.9,0-1.7-0.6-1.9-1.5L32.7,2.4c-0.1-0.5,0-1.1,0.3-1.5s0.7-0.7,1.2-0.8c0.1,0,0.3,0,0.4,0c0.9,0,1.7,0.6,1.9,1.5L43.4,29c0.1,0.5,0,1-0.2,1.5c-0.3,0.5-0.7,0.8-1.1,0.9c-0.2,0-0.3,0-0.4,0.1C41.6,31.4,41.6,31.4,41.5,31.4z" />
                                            </g>
                                        </svg>
                                        <span className="count cart-count modern-cart-badge">{cartCount}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="desktop-header d-none d-md-flex">
                                <div className="desktop-nav-container">
                                    {/* Left Navigation */}
                                    <nav className="nav-left">
                                        <Link to="/" className="nav-link-modern">
                                            <span>Home</span>
                                            <div className="nav-underline"></div>
                                        </Link>
                                        <Link to="/products" className="nav-link-modern">
                                            <span>Products</span>
                                            <div className="nav-underline"></div>
                                        </Link>
                                    </nav>
                                    
                                    {/* Center Logo */}
                                    <div className="logo-center">
                                        <Link to="/" className="modern-logo-link">
                                            <img style={{height:'75px'}} src="/assets/img/logo.jpg" alt="Aruvia Herbals" className="img-reponsive modern-logo desktop-logo" />
                                        </Link>
                                    </div>
                                    
                                    {/* Right Navigation */}
                                    <nav className="nav-right">
                                        <a 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSocialClick();
                                            }}
                                            className="nav-link-modern"
                                        >
                                            <span>Social</span>
                                            <div className="nav-underline"></div>
                                        </a>
                                       
                                        <Link to="/contact-us" className="nav-link-modern">
                                            <span>Contact</span>
                                            <div className="nav-underline"></div>
                                        </Link>
                                    </nav>
                                </div>
                                
                                {/* Desktop Cart */}
                                <div className="desktop-cart">
                                    <a onClick={handleCartToggle} className="zoa-icon icon-cart modern-cart-btn desktop-cart-btn">
                                        <svg width={20} height={20} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.4 55.4" style={{enableBackground: 'new 0 0 55.4 55.4'}} xmlSpace="preserve">
                                            <g>
                                                <rect x="0.2" y="17.4" width={55} height="3.4" />
                                            </g>
                                            <g>
                                                <polygon points="7.1,55.4 3.4,27.8 3.4,24.1 7.3,24.1 7.3,27.6 10.5,51.6 44.9,51.6 48.1,27.6 48.1,24.1 52,24.1 52,27.9 48.3,55.4" />
                                            </g>
                                            <g>
                                                <path d="M14,31.4c-0.1,0-0.3,0-0.5-0.1c-1-0.2-1.6-1.3-1.4-2.3L19,1.5C19.2,0.6,20,0,20.9,0c0.1,0,0.3,0,0.4,0c0.5,0.1,0.9,0.4,1.2,0.9c0.3,0.4,0.4,1,0.3,1.5l-6.9,27.5C15.6,30.8,14.8,31.4,14,31.4z" />
                                            </g>
                                            <g>
                                                <path d="M41.5,31.4c-0.9,0-1.7-0.6-1.9-1.5L32.7,2.4c-0.1-0.5,0-1.1,0.3-1.5s0.7-0.7,1.2-0.8c0.1,0,0.3,0,0.4,0c0.9,0,1.7,0.6,1.9,1.5L43.4,29c0.1,0.5,0,1-0.2,1.5c-0.3,0.5-0.7,0.8-1.1,0.9c-0.2,0-0.3,0-0.4,0.1C41.6,31.4,41.6,31.4,41.5,31.4z" />
                                            </g>
                                        </svg>
                                        <span className="count cart-count modern-cart-badge">{cartCount}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Fully Responsive Header Styles */}
            <style jsx>{`
                /* Base Header Styles */
                .modern-enhanced {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
                }

                .modern-enhanced.sticky-header {
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                /* Responsive Header Row */
                .header-row-responsive {
                    width: 100%;
                    padding: 0;
                }

                /* Mobile Header Layout (< 768px) */
                .mobile-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 10px 15px;
                    min-height: 60px;
                }

                .mobile-left, .mobile-right {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                }

                .mobile-center {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .mobile-logo {
                    height: 50px !important;
                    max-height: 50px;
                    width: auto;
                }

                .mobile-cart {
                    padding: 8px !important;
                    border-radius: 8px !important;
                }

                /* Desktop Header Layout (>= 768px) */
                .desktop-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 15px 20px;
                    min-height: 80px;
                }

                .desktop-nav-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                    flex: 1;
                }

                .desktop-cart {
                    flex: 0 0 auto;
                    margin-left: 20px;
                }

                /* Navigation Sections */
                .nav-left, .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                }

                .logo-center {
                    margin: 0 20px;
                    display: flex;
                    align-items: center;
                }

                .desktop-logo {
                    height: 75px !important;
                    max-height: 75px;
                    width: auto;
                }

                /* Navigation Link Styles */
                .nav-link-modern {
                    position: relative;
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    font-size: 16px;
                    padding: 8px 0;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .nav-link-modern:hover {
                    color: #007bff;
                    transform: translateY(-2px);
                }

                .nav-underline {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 2px;
                }

                .nav-link-modern:hover .nav-underline {
                    width: 100%;
                }

                /* Modern logo enhancements */
                .modern-logo-link {
                    transition: all 0.3s ease;
                    display: inline-block;
                }

                .modern-logo-link:hover {
                    transform: scale(1.05);
                }

                .modern-logo {
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    object-fit: contain;
                }

                .modern-logo:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                /* Modern menu button */
                .modern-menu-btn {
                    transition: all 0.3s ease;
                    padding: 8px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modern-menu-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                    transform: scale(1.1);
                }

                .modern-menu-btn svg {
                    transition: all 0.3s ease;
                }

                .modern-menu-btn:hover svg {
                    transform: rotate(90deg);
                }

                /* Modern cart button */
                .modern-cart-btn {
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 12px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modern-cart-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
                }

                .modern-cart-btn svg {
                    transition: all 0.3s ease;
                }

                .modern-cart-btn:hover svg {
                    transform: scale(1.1);
                }

                /* Modern cart badge */
                .modern-cart-badge {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
                    animation: modernPulse 2s infinite;
                    box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                    border-radius: 50% !important;
                    font-weight: 700 !important;
                    min-width: 18px !important;
                    height: 18px !important;
                    font-size: 11px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                @keyframes modernPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
                    }
                    50% { 
                        transform: scale(1.1); 
                        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.5);
                    }
                }

                /* Smooth animations for all interactive elements */
                .header-v1 * {
                    transition: all 0.3s ease;
                }

                /* Enhanced hover effects for navigation in sidebar */
                .nav-home5 li a {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .nav-home5 li a:hover {
                    transform: translateX(10px);
                    color: #007bff;
                }

                .nav-home5 li a::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 0;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
                    transition: width 0.3s ease;
                    z-index: -1;
                }

                .nav-home5 li a:hover::before {
                    width: 100%;
                }

                /* Modern cart sidebar enhancements */
                .cart-list {
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                .item-cart {
                    transition: all 0.3s ease;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    padding: 10px;
                }

                .item-cart:hover {
                    background: rgba(0, 0, 0, 0.02);
                    transform: translateX(5px);
                }

                /* Modern buttons */
                .zoa-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                }

                .zoa-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .zoa-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .zoa-btn:hover::before {
                    left: 100%;
                }

                /* Bootstrap Responsive Classes */
                .d-none {
                    display: none !important;
                }

                .d-md-flex {
                    display: none !important;
                }

                .d-md-none {
                    display: flex !important;
                }

                /* Responsive Breakpoints */
                
                /* Tablet and Desktop (768px and up) */
                @media (min-width: 768px) {
                    .d-md-flex {
                        display: flex !important;
                    }
                    
                    .d-md-none {
                        display: none !important;
                    }

                    .desktop-header {
                        padding: 15px 30px;
                    }

                    .desktop-nav-container {
                        gap: 50px;
                    }

                    .nav-left, .nav-right {
                        gap: 30px;
                    }
                }

                /* Large Desktop (1024px and up) */
                @media (min-width: 1024px) {
                    .desktop-header {
                        padding: 20px 40px;
                    }

                    .desktop-nav-container {
                        gap: 60px;
                    }

                    .nav-left, .nav-right {
                        gap: 35px;
                    }

                    .nav-link-modern {
                        font-size: 17px;
                    }
                }

                /* Small Mobile (480px and down) */
                @media (max-width: 480px) {
                    .mobile-header {
                        padding: 8px 12px;
                        min-height: 55px;
                    }

                    .mobile-logo {
                        height: 45px !important;
                    }

                    .modern-menu-btn {
                        padding: 6px;
                    }

                    .mobile-cart {
                        padding: 6px !important;
                    }

                    .modern-cart-badge {
                        min-width: 16px !important;
                        height: 16px !important;
                        font-size: 10px !important;
                    }
                }

                /* Extra Small Mobile (360px and down) */
                @media (max-width: 360px) {
                    .mobile-header {
                        padding: 5px 10px;
                        min-height: 50px;
                    }

                    .mobile-logo {
                        height: 40px !important;
                    }

                    .modern-menu-btn svg {
                        width: 20px;
                        height: 12px;
                    }

                    .mobile-cart svg {
                        width: 16px;
                        height: 16px;
                    }
                }

                /* Container and Row Overrides */
                .header-center .container {
                    max-width: 100%;
                    padding: 0;
                }

                .header-center .container-content {
                    padding: 0;
                }

                /* Flex utilities */
                .flex {
                    display: flex;
                }

                .align-items-center {
                    align-items: center;
                }

                .justify-content-center {
                    justify-content: center;
                }

                .justify-content-between {
                    justify-content: space-between;
                }
            `}</style>
        </div>
    )
}

export default Header