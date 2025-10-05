import React, { useContext, useState, useEffect } from 'react'
import { contextData } from '../services/Context';
import { Link, useNavigate } from 'react-router-dom';
import CheckOutPage from '../pages/CheckOutPage';

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
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleShopClick();
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                Shop
                            </a>
                        </li>
                        <li className="level1">
                            <Link to="/checkout" onClick={handleSidebarClose}>Checkout</Link>
                        </li>
                    </ul>
                    {/* <ul className="mobile-account">
                        <li><a href="#"><i className="fa fa-unlock-alt" />Login</a></li>
                        <li><a href="#"><i className="fa fa-user-plus" />Register</a></li>
                        <li><a href="#"><i className="fa fa-heart" />Wishlist</a></li>
                    </ul> */}
                    
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
            
            <header id="header" className={`header-v1 ${isSticky ? 'sticky-header' : ''}`}>
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
                                <Link to="/"><img style={{height:'75px'}} src="/assets/img/logo.jpg" alt className="img-reponsive" /></Link>
                            </div>
                            <div className="col-md-4 col flex justify-content-end">
                                <div className="topbar-left">
                                    <div className="element element-user hidden-xs hidden-sm">
                                        {/* <a href="#" className="zoa-icon js-user">
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
                                        </a> */}
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
                                            <span className="count cart-count">{cartCount}</span>
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