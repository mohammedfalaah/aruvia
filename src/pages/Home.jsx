import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { contextData } from '../services/Context'; 

const Home = () => {
    const [products, setProducts] = useState([]);
    const { 
        addToCart, 
        fetchCartItems, 
        notification, 
        getCartItemCount,
        cartItems 
    } = useContext(contextData);
    const [loading, setLoading] = useState(false);

    // Get item count for a specific product
    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://aruvia-backend.onrender.com/api/products`);
                if (response.data.success === "true") {
                    setProducts(response.data.data);
                } else {
                    console.error("API error: ", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchData();
        // Fetch cart items on component mount
        fetchCartItems();
    }, []);

    // Handle add to cart click - simplified to use context function
    const handleAddToCart = async (productId) => {
        setLoading(true);
        
        try {
            // Find the product from the products array
            const product = products.find(p => p._id === productId);
            
            if (!product) {
                console.error("Product not found");
                setLoading(false);
                return;
            }

            // Use the context addToCart function which handles localStorage
            const result = await addToCart(productId, product, 1);
            
            if (result.success) {
                console.log(`${product.name} added to cart successfully!`);
            } else {
                console.log("Failed to add product:", result.message);
            }
            
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="wrappage">
                <div className="container container-content">
                    <div className="collection-slide">
                        <div className="row first">
                            <div className="col-md-9 col-sm-12 col-xs-12">
                                <div className="js-slider-v2">
                                    <div className="slide-img">
                                        <a href="#"><img src="/assets/images/banner/Aruvia_banner01.jpg" alt className="img-responsive" /></a>
                                        <div className="box-center slide-content">
                                            {/* <h3>Tank top<br /> hot collection</h3> */}
                                            {/* <a href="#">Shop now</a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-12 col-xs-12">
                                <div className="row banner">
                                    <div className="col-xs-12 col-sm-6 col-md-12">
                                        <div className="banner-img">
                                            <a href="#" className="effect-img3 plus-zoom">
                                                <img src="/assets/images/banner/av02.jpg" alt className="img-responsive" />
                                            </a>
                                            <div className="box-center content3">
                                                {/* <a href="#">Womens</a> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-12">
                                        <div className="banner-img">
                                            <a href="#" className="effect-img3 plus-zoom">
                                                <img src="/assets/images/banner/av03.jpg" alt className="img-responsive" />
                                            </a>
                                            <div className="box-center content3">
                                                {/* <a href="#">Kid's</a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
<div id='future-product' className="zoa-product pad4">
    <h3 className="title text-center">Featured Products</h3>
    <div className="container">
        <div className="row">
            {products.map((product) => (
                <div
                    className="col-xs-6 col-sm-6 col-md-4 col-lg-4 product-item"
                    key={product._id}
                >
                    <div className="product-img">
                        <a href="#">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="img-responsive"
                            />
                        </a>
                        
                        {/* Desktop/Tablet Button Group - Hidden on mobile */}
                        <div
                            className="product-button-group hidden-xs"
                            style={{ paddingBottom: "10px" }}
                        >
                            <a href="#" className="zoa-btn zoa-quickview">
                                <span className="zoa-icon-quick-view" />
                            </a>
                            <a href="#" className="zoa-btn zoa-wishlist">
                                <span className="zoa-icon-heart" />
                            </a>
                            <a 
                                className="zoa-btn zoa-addcart" 
                                onClick={() => handleAddToCart(product._id)}
                                style={{ 
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    position: 'relative'
                                }}
                            >
                                <span className="zoa-icon-cart" />
                                {loading && <span style={{ marginLeft: '5px' }}>...</span>}
                                
                                {/* Show cart count badge if item is in cart */}
                                {getProductCartCount(product._id) > 0 && (
                                    <span 
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {getProductCartCount(product._id)}
                                    </span>
                                )}
                            </a>
                        </div>
                    </div>
                    
                    <div className="product-info text-center">
                        <h3 className="product-title">
                            <a href="#">{product.name}</a>
                        </h3>
                        <div className="product-price">
                            <span>₹{product.price}</span>
                        </div>
                        
                        {/* Mobile Button Group - Exact same style as desktop */}
                        <div 
                            className="visible-xs product-button-group"
                            style={{ paddingBottom: "10px", marginTop: "10px" }}
                        >
                            <a href="#" className="zoa-btn zoa-quickview">
                                <span className="zoa-icon-quick-view" />
                            </a>
                            <a href="#" className="zoa-btn zoa-wishlist">
                                <span className="zoa-icon-heart" />
                            </a>
                            <a 
                                className="zoa-btn zoa-addcart" 
                                onClick={() => handleAddToCart(product._id)}
                                style={{ 
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    position: 'relative'
                                }}
                            >
                                <span className="zoa-icon-cart" />
                                {loading && <span style={{ marginLeft: '5px' }}>...</span>}
                                
                                {/* Mobile cart count badge - same as desktop */}
                                {getProductCartCount(product._id) > 0 && (
                                    <span 
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {getProductCartCount(product._id)}
                                    </span>
                                )}
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center">
            <a href="#" className="zoa-btn btn-loadmore">
                Load more
            </a>
        </div>
    </div>
    
    {/* CSS for mobile responsiveness - using exact same styles */}
    <style jsx>{`
        @media (max-width: 767px) {
            .product-item {
                margin-bottom: 20px;
            }
            
            .product-img img {
                width: 100%;
                height: auto;
            }
            
            .product-title {
                font-size: 14px;
                margin: 8px 0 5px 0;
            }
            
            .product-price {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 8px;
            }
        }
        
        /* Ensure buttons are properly sized on all screens */
        .zoa-btn {
            display: inline-block;
            text-decoration: none;
        }
        
        .product-button-group {
            display: flex;
            justify-content: center;
            gap: 5px;
        }
        
        /* Hide desktop buttons on mobile, show mobile buttons */
        @media (max-width: 767px) {
            .hidden-xs {
                display: none !important;
            }
            .visible-xs {
                display: block !important;
            }
        }
        
        /* Hide mobile buttons on desktop */
        @media (min-width: 768px) {
            .visible-xs {
                display: none !important;
            }
        }
    `}</style>
</div>
            </div>

            <div className="container container-content">
                <div className="zoa-instagram">
                    <div className="insta-title2 text-center">
                        <h3>INSTAGRAM</h3>
                    </div>
                    <div className="row insta-content">
                        <div className="col-md-3 col-sm-5 col-xs-7">
                            <a href="https://www.instagram.com/p/DHlLcSfhI3g/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer">
                                <img src="/assets/img/aruvia-insta.jpg" alt="Instagram Post Preview" className="img-responsive" />
                            </a>        
                        </div>
                        <div className="col-md-3 col-sm-5 col-xs-7">
                            <a href="https://www.instagram.com/p/DHvi99gBiBF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="><img src="/assets/img/instagram1.jpg" alt className="img-responsive" /></a>
                        </div>
                        <div className="col-md-3 col-sm-5 col-xs-7">
                            <a href="https://www.instagram.com/p/DKUUoOGhrig/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="><img src="/assets/img/instagram5.jpg" alt className="img-responsive" /></a>
                        </div>
                        <div className="col-md-3 col-sm-5 col-xs-7">
                            <a href="#"><img src="/assets/img/instagram6.jpg" alt className="img-responsive" /></a>
                        </div>
                        <div className="col-md-3 col-sm-5 col-xs-7">
                            <a href="#"><img style={{height:'25rem'}} src="/assets/img/instagram10.jpg" alt className="img-responsive" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="newsletter v3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="newsletter-heading">
                                <h3>get in touch</h3>
                                <p>Subscribe for latest stories and promotions (35% sale)</p>
                            </div>
                            <form className="form_newsletter" action="#" method="post">
                                <input type="email" defaultValue placeholder="Enter your emaill" name="EMAIL" id="mail" className="newsletter-input form-control" />
                                <button id="subscribe" className="button_mini zoa-btn" type="submit">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="newsletter-flex">
                                <div className="newsletter-flex">
                                    <div className="newsletter-element">
                                        <h3>Support</h3>
                                        <ul>
                                            <li><Link to="/cancellation-refund">Cancellation and Refund</Link></li>
                                            <li><Link to="/shipping-delivery">Shipping and Delivery</Link></li>
                                            <li><Link to="/contact-us">Contact Us</Link></li>
                                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                            <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {notification && (
                <div 
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: notification.isSuccess ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        zIndex: 1000,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    {notification.message}
                </div>
            )}
        </div>
    )
}

export default Home