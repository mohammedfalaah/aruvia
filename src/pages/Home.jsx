import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { contextData } from '../services/Context'; 

const Home = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { 
        addToCart, 
        fetchCartItems, 
        notification, 
        getCartItemCount,
        cartItems 
    } = useContext(contextData);
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Custom smooth scroll function with faster speed
    const smoothScrollTo = (elementId, duration = 600) => {
        const target = document.getElementById(elementId);
        if (!target) return;
        
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };

    // Get item count for a specific product
    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    // Configure axios with timeout
    const apiClient = axios.create({
        timeout: 15000, // 15 seconds timeout
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const fetchProducts = async (attempt = 1, maxAttempts = 3) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log(`Fetching products... Attempt ${attempt}/${maxAttempts}`);
            
            const response = await apiClient.get('https://aruvia-backend.onrender.com/api/products');
            
            // Check if response structure is correct
            if (response.data && response.data.success === "true" && response.data.data) {
                setProducts(response.data.data);
                setRetryCount(0);
                console.log(`Successfully fetched ${response.data.data.length} products`);
            } else {
                throw new Error(response.data?.message || "Invalid response structure");
            }
            
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            
            // Determine if we should retry
            const shouldRetry = attempt < maxAttempts && (
                error.code === 'ECONNABORTED' || // Timeout
                error.code === 'NETWORK_ERROR' ||
                error.response?.status >= 500 || // Server errors
                !error.response // Network issues
            );
            
            if (shouldRetry) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff (max 10s)
                console.log(`Retrying in ${delay}ms...`);
                
                setTimeout(() => {
                    setRetryCount(attempt);
                    fetchProducts(attempt + 1, maxAttempts);
                }, delay);
            } else {
                // Final failure
                setError(error.response?.data?.message || error.message || 'Failed to fetch products');
                setProducts([]); // Set empty array as fallback
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCartItems(); // Your existing cart fetch
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
                                        <a href="#future-product" onClick={(e) => {
                                            e.preventDefault();
                                            smoothScrollTo('future-product', 600);
                                        }}>
                                            <img href="#future-product" onClick={(e) => {
                                            e.preventDefault();
                                            smoothScrollTo('future-product', 600); // Fast smooth scroll
                                        }} src="/assets/images/banner/Aruvia_banner01.jpg" alt className="img-responsive" />
                                        </a>
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
                                            <a href="#future-product" onClick={(e) => {
                                                e.preventDefault();
                                                smoothScrollTo('future-product', 600); // Fast smooth scroll
                                            }} className="effect-img3 plus-zoom">
                                                <img  src="/assets/images/banner/av02.jpg" alt className="img-responsive" />
                                            </a>
                                            <div className="box-center content3">
                                                {/* <a href="#">Womens</a> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-12">
                                        <div className="banner-img">
                                            <a href="#future-product" onClick={(e) => {
                                                e.preventDefault();
                                                smoothScrollTo('future-product', 600); // Fast smooth scroll
                                            }} className="effect-img3 plus-zoom">
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
                                        <a onClick={() => handleAddToCart(product._id)}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="img-responsive"
                                            />
                                        </a>
                                        
                                        {/* Button Group - Always visible and properly positioned */}
                                        <div className="product-button-group">
                                            <a href="#" className="zoa-btn zoa-quickview">
                                                <span className="zoa-icon-quick-view" />
                                            </a>
                                            {/* <a href="#" className="zoa-btn zoa-wishlist">
                                                <span className="zoa-icon-heart" />
                                            </a> */}
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
                    
                    {/* Fixed CSS for mobile responsiveness */}
                    <style jsx>{`
                        /* Override existing styles to ensure buttons are always visible */
                        .product-item .product-button-group {
                            display: flex !important;
                            opacity: 1 !important;
                            visibility: visible !important;
                            position: absolute !important;
                            bottom: 10px !important;
                            left: 50% !important;
                            transform: translateX(-50%) !important;
                            width: auto !important;
                            height: auto !important;
                            justify-content: center !important;
                            align-items: center !important;
                            gap: 5px !important;
                            z-index: 10 !important;
                        }

                        .product-item .product-button-group .zoa-btn {
                            opacity: 1 !important;
                            visibility: visible !important;
                            transform: translateY(0px) !important;
                            width: 40px !important;
                            height: 40px !important;
                            border-radius: 50% !important;
                            background-color: rgba(0, 0, 0, 0.8) !important;
                            color: white !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            margin: 0 3px !important;
                            transition: all 0.3s ease !important;
                        }

                        .product-item .product-button-group .zoa-btn:hover {
                            background-color: #333 !important;
                            transform: scale(1.1) !important;
                        }

                        /* Mobile specific styles */
                        @media (max-width: 767px) {
                            .product-item {
                                margin-bottom: 30px !important;
                                position: relative !important;
                            }
                            
                            .product-item .product-img {
                                position: relative !important;
                                overflow: hidden !important;
                            }

                            .product-item .product-button-group {
                                bottom: 5px !important;
                            }

                            .product-item .product-button-group .zoa-btn {
                                width: 35px !important;
                                height: 35px !important;
                                margin: 0 2px !important;
                            }
                            
                            .product-img img {
                                width: 100% !important;
                                height: auto !important;
                            }
                            
                            .product-title {
                                font-size: 14px !important;
                                margin: 8px 0 5px 0 !important;
                            }
                            
                            .product-price {
                                font-size: 16px !important;
                                font-weight: bold !important;
                                margin-bottom: 8px !important;
                            }
                        }

                        /* Tablet styles */
                        @media (min-width: 768px) and (max-width: 1024px) {
                            .product-item .product-button-group {
                                bottom: 8px !important;
                            }

                            .product-item .product-button-group .zoa-btn {
                                width: 38px !important;
                                height: 38px !important;
                            }
                        }

                        /* Desktop styles - maintain hover effects */
                        @media (min-width: 1025px) {
                            .product-item .product-button-group {
                                opacity: 0 !important;
                                visibility: hidden !important;
                                transition: all 0.3s ease !important;
                            }

                            .product-item:hover .product-button-group {
                                opacity: 1 !important;
                                visibility: visible !important;
                            }

                            .product-item:hover .product-button-group .zoa-btn {
                                transform: translateY(-10px) !important;
                            }
                        }

                        /* Ensure product container has proper positioning */
                        .product-item {
                            position: relative !important;
                        }

                        .product-img {
                            position: relative !important;
                            overflow: hidden !important;
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