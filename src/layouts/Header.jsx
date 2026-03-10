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
            
            {/* Modern Cart Sidebar */}
            <div className={`modern-cart-sidebar ${isCartOpen ? "cart-open" : ""}`}>
                <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}></div>
                <div className="cart-panel">
                    {/* Modern Cart Header */}
                    <div className="cart-header-modern">
                        <div className="cart-title-section">
                            <h2 className="cart-title-modern">My Cart</h2>
                            <span className="cart-count-modern">({cartItems?.length || 0} items)</span>
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(false)} 
                            className="cart-close-modern"
                            aria-label="Close Cart"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Cart Content */}
                    <div className="cart-content-modern">
                        {cartItems && cartItems.length > 0 ? (
                            <>
                                {/* Cart Items */}
                                <div className="cart-items-modern">
                                    {cartItems.map((item) => (
                                        <div key={item._id || item.productId} className="cart-item-modern">
                                            <div className="item-image-modern">
                                                <img 
                                                    src={item.image || "/assets/img/home9/product1.png"} 
                                                    alt={item.name}
                                                />
                                            </div>
                                            
                                            <div className="item-details-modern">
                                                <h4 className="item-name-modern">{item.name}</h4>
                                                <div className="item-price-modern">₹{item.price}</div>
                                                
                                                <div className="quantity-controls-modern">
                                                    <button 
                                                        className="qty-btn-modern minus"
                                                        onClick={() => handleQuantityDecrease(item._id || item.productId, item.quantity)}
                                                        disabled={loading}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        </svg>
                                                    </button>
                                                    
                                                    <span className="qty-display-modern">{item.quantity}</span>
                                                    
                                                    <button 
                                                        className="qty-btn-modern plus"
                                                        onClick={() => handleQuantityIncrease(item._id || item.productId, item.quantity)}
                                                        disabled={loading}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                                
                                                <div className="item-total-modern">
                                                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                            
                                            <button 
                                                className="remove-item-modern"
                                                onClick={() => handleRemoveItem(item._id || item.productId)}
                                                title="Remove item"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3,6 5,6 21,6"></polyline>
                                                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Summary */}
                                <div className="cart-summary-modern">
                                    <div className="summary-row-modern">
                                        <span>Subtotal:</span>
                                        <span>₹{getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row-modern total">
                                        <span>Total:</span>
                                        <span>₹{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <div className="cart-actions-modern">
                                    <Link 
                                        to="/checkout" 
                                        className="checkout-btn-modern"
                                        onClick={() => setIsCartOpen(false)}
                                    >
                                        <span>Proceed to Checkout</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12,5 19,12 12,19"></polyline>
                                        </svg>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="empty-cart-modern">
                                <div className="empty-cart-icon">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                </div>
                                <h3>Your cart is empty</h3>
                                <p>Add some products to get started</p>
                                <button 
                                    onClick={() => setIsCartOpen(false)}
                                    className="continue-shopping-modern"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
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

            {/* Fully Responsive Header Styles + Modern Cart */}
            <style jsx>{`
                /* Modern Cart Sidebar */
                .modern-cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    visibility: hidden;
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .modern-cart-sidebar.cart-open {
                    visibility: visible;
                    opacity: 1;
                }

                .cart-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }

                .cart-panel {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 420px;
                    height: 100%;
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                }

                .cart-open .cart-panel {
                    transform: translateX(0);
                }

                .cart-header-modern {
                    padding: 25px 30px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.02);
                }

                .cart-title-section {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .cart-title-modern {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cart-count-modern {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 500;
                }

                .cart-close-modern {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: rgba(255, 255, 255, 0.8);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cart-close-modern:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: #ffffff;
                    transform: scale(1.1);
                }

                .cart-content-modern {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .cart-items-modern {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 30px;
                }

                .cart-item-modern {
                    display: flex;
                    gap: 15px;
                    padding: 20px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                }

                .item-image-modern {
                    width: 80px;
                    height: 80px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.05);
                }

                .item-image-modern img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .item-details-modern {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .item-name-modern {
                    font-size: 16px;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                    line-height: 1.3;
                }

                .item-price-modern {
                    font-size: 14px;
                    color: #7877c6;
                    font-weight: 600;
                }

                .quantity-controls-modern {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 8px 0;
                }

                .qty-btn-modern {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .qty-btn-modern:hover {
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-color: transparent;
                    transform: scale(1.1);
                }

                .qty-display-modern {
                    min-width: 40px;
                    text-align: center;
                    font-weight: 600;
                    color: #ffffff;
                    font-size: 16px;
                }

                .item-total-modern {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }

                .remove-item-modern {
                    position: absolute;
                    top: 15px;
                    right: 0;
                    background: rgba(255, 71, 87, 0.1);
                    border: none;
                    color: #ff4757;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .remove-item-modern:hover {
                    background: #ff4757;
                    color: #ffffff;
                    transform: scale(1.1);
                }

                .cart-summary-modern {
                    padding: 25px 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.02);
                }

                .summary-row-modern {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                }

                .summary-row-modern.total {
                    font-weight: 700;
                    font-size: 18px;
                    color: #ffffff;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 15px;
                    margin-top: 10px;
                }

                .cart-actions-modern {
                    padding: 25px 30px;
                }

                .checkout-btn-modern {
                    width: 100%;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border: none;
                    color: #ffffff;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .checkout-btn-modern:hover {
                    background: linear-gradient(135deg, #ff77c6, #77dbe2);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(120, 119, 198, 0.4);
                }

                .empty-cart-modern {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 30px;
                    text-align: center;
                }

                .empty-cart-icon {
                    margin-bottom: 20px;
                    opacity: 0.3;
                    color: rgba(255, 255, 255, 0.3);
                }

                .empty-cart-modern h3 {
                    font-size: 20px;
                    color: #ffffff;
                    margin: 0 0 10px 0;
                    font-weight: 600;
                }

                .empty-cart-modern p {
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0 0 25px 0;
                    font-size: 16px;
                }

                .continue-shopping-modern {
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border: none;
                    color: #ffffff;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .continue-shopping-modern:hover {
                    background: linear-gradient(135deg, #ff77c6, #77dbe2);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .cart-panel {
                        width: 100%;
                    }
                    
                    .cart-header-modern {
                        padding: 20px 20px;
                    }
                    
                    .cart-items-modern {
                        padding: 15px 20px;
                    }
                    
                    .cart-summary-modern,
                    .cart-actions-modern {
                        padding: 20px 20px;
                    }
                    
                    .cart-item-modern {
                        padding: 15px 0;
                    }
                    
                    .item-image-modern {
                        width: 70px;
                        height: 70px;
                    }
                }

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