import axios from 'axios';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { contextData } from '../services/Context'; 

const Home = () => {
    const [products, setProducts] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const [visibleProducts, setVisibleProducts] = useState(12); // Start with 12 products
    
    const { 
        addToCart, 
        fetchCartItems, 
        notification, 
        getCartItemCount,
        cartItems 
    } = useContext(contextData);
    const [loading, setLoading] = useState(false);

    // Memoize products to display (for performance)
    const displayProducts = useMemo(() => 
        products.slice(0, visibleProducts), 
        [products, visibleProducts]
    );

    // Get item count for a specific product
    const getProductCartCount = useCallback((productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    }, [cartItems]);

    // Image optimization function
    const optimizeImageUrl = (url, width = 400, quality = 75) => {
        if (!url) return '/assets/images/placeholder.jpg';
        
        // If using a CDN like Cloudinary, ImageKit, or similar
        // Replace with your CDN's optimization parameters
        
        // Example for Cloudinary:
        // return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
        
        // Example for ImageKit:
        // return `${url}?tr=w-${width},q-${quality}`;
        
        // For now, return original URL
        return url;
    };

    // Preload critical images
    const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Handle image load state
    const handleImageLoad = (productId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [productId]: 'loaded'
        }));
    };

    const handleImageError = (productId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [productId]: 'error'
        }));
    };

    // Improved fetch function with image preloading
    const fetchProducts = async (attempt = 1) => {
        const maxRetries = 3;
        setIsProductsLoading(true);
        setFetchError(null);
        
        try {
            console.log(`Fetching products - attempt ${attempt}/${maxRetries}`);
            
            const response = await axios.get(
                'https://aruvia-backend.onrender.com/api/products',
                {
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            console.log('API Response:', response.data);
            
            if (response.data && response.data.success === "true" && Array.isArray(response.data.data)) {
                const productsData = response.data.data;
                setProducts(productsData);
                setRetryCount(0);
                
                // Initialize image loading states
                const initialImageStates = {};
                productsData.forEach(product => {
                    initialImageStates[product._id] = 'loading';
                });
                setImageLoadingStates(initialImageStates);
                
                // Preload first few images for better perceived performance
                const firstFewProducts = productsData.slice(0, 6);
                firstFewProducts.forEach(product => {
                    if (product.image) {
                        preloadImage(optimizeImageUrl(product.image))
                            .then(() => handleImageLoad(product._id))
                            .catch(() => handleImageError(product._id));
                    }
                });
                
                console.log(`Successfully fetched ${productsData.length} products`);
            } else if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
                const productsData = response.data.data;
                setProducts(productsData);
                setRetryCount(0);
                console.log(`Successfully fetched ${productsData.length} products`);
            } else {
                throw new Error(response.data?.message || 'Invalid response format from server');
            }
            
        } catch (error) {
            console.error(`Error fetching products (attempt ${attempt}):`, error);
            
            let errorMessage = 'Failed to load products';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout - server took too long to respond';
            } else if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.message}`;
            } else if (error.request) {
                errorMessage = 'Network error - please check your internet connection';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }
            
            setFetchError(errorMessage);
            
            if (attempt < maxRetries) {
                const delay = attempt * 2000;
                console.log(`Retrying in ${delay}ms...`);
                setTimeout(() => {
                    setRetryCount(attempt);
                    fetchProducts(attempt + 1);
                }, delay);
            } else {
                console.error('Max retry attempts reached');
                setRetryCount(maxRetries);
            }
        } finally {
            setIsProductsLoading(false);
        }
    };

    // Load more products
    const loadMoreProducts = () => {
        setVisibleProducts(prev => Math.min(prev + 12, products.length));
    };

    // Manual retry function
    const handleRetry = () => {
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
        fetchCartItems();
    }, []);

    // Handle add to cart click
    const handleAddToCart = async (productId) => {
        setLoading(true);
        
        try {
            const product = products.find(p => p._id === productId);
            
            if (!product) {
                console.error("Product not found");
                setLoading(false);
                return;
            }

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

    // Optimized Product Image Component
    const ProductImage = React.memo(({ product }) => {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);
        
        const optimizedImageUrl = useMemo(() => 
            optimizeImageUrl(product.image, 400, 75), 
            [product.image]
        );
        
        return (
            <div className="product-img" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Loading placeholder */}
                {!imageLoaded && !imageError && (
                    <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid #e9ecef',
                            borderTop: '3px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    </div>
                )}
                
                {/* Error placeholder */}
                {imageError && (
                    <div 
                        style={{
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6c757d',
                            fontSize: '14px'
                        }}
                    >
                        Image not available
                    </div>
                )}
                
                {/* Actual image */}
                <img
                    src={optimizedImageUrl}
                    alt={product.name}
                    className="img-responsive"
                    loading="lazy" // Native lazy loading
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageError(true);
                        setImageLoaded(false);
                    }}
                    style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        width: '100%',
                        height: 'auto'
                    }}
                />
                
                {/* Product action buttons */}
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
        );
    });

    // Loading component
    const LoadingComponent = () => (
        <div className="text-center" style={{ padding: '50px 0' }}>
            <div style={{ fontSize: '18px', marginBottom: '20px' }}>
                Loading products...
                {retryCount > 0 && <div style={{ fontSize: '14px', color: '#666' }}>
                    Retry attempt {retryCount}/3
                </div>}
            </div>
            <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #f3f3f3', 
                borderTop: '4px solid #3498db', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
            }}></div>
        </div>
    );

    // Error component
    const ErrorComponent = () => (
        <div className="text-center" style={{ padding: '50px 0' }}>
            <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '20px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                border: '1px solid #f5c6cb'
            }}>
                <h4 style={{ marginBottom: '10px' }}>Unable to load products</h4>
                <p style={{ marginBottom: '15px' }}>{fetchError}</p>
                <button 
                    onClick={handleRetry}
                    className="zoa-btn"
                    style={{ 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-12">
                                        <div className="banner-img">
                                            <a href="#" className="effect-img3 plus-zoom">
                                                <img src="/assets/images/banner/av03.jpg" alt className="img-responsive" />
                                            </a>
                                            <div className="box-center content3">
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
                        {isProductsLoading && <LoadingComponent />}
                        
                        {!isProductsLoading && fetchError && <ErrorComponent />}
                        
                        {!isProductsLoading && !fetchError && displayProducts.length > 0 && (
                            <>
                                <div className="row">
                                    {displayProducts.map((product) => (
                                        <div
                                            className="col-xs-6 col-sm-6 col-md-4 col-lg-4 product-item"
                                            key={product._id}
                                        >
                                            <ProductImage product={product} />
                                            
                                            <div className="product-info text-center">
                                                <h3 className="product-title">
                                                    <a href="#">{product.name}</a>
                                                </h3>
                                                <div className="product-price">
                                                    <span>₹{product.price}</span>
                                                </div>
                                                
                                                {/* Mobile Button Group */}
                                                <div 
                                                    className="visible-xs product-button-group"
                                                    style={{ paddingBottom: "10px", marginTop: "10px" }}
                                                >
                                                    <a href="#" className="zoa-btn zoa-quickview">
                                                        <span className="zoa-icon-quick-view" />
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
                                
                                {/* Load More Button */}
                                {visibleProducts < products.length && (
                                    <div className="text-center">
                                        <button 
                                            onClick={loadMoreProducts}
                                            className="zoa-btn btn-loadmore"
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                padding: '10px 30px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Load More ({products.length - visibleProducts} remaining)
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {!isProductsLoading && !fetchError && products.length === 0 && (
                            <div className="text-center" style={{ padding: '50px 0' }}>
                                <h4>No products found</h4>
                                <p>Please try refreshing the page or check back later.</p>
                                <button 
                                    onClick={handleRetry}
                                    className="zoa-btn"
                                    style={{ 
                                        backgroundColor: '#007bff', 
                                        color: 'white', 
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Enhanced CSS for performance */}
                    <style jsx>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        
                        /* Image optimization */
                        .product-img img {
                            will-change: opacity;
                            backface-visibility: hidden;
                            transform: translateZ(0);
                        }
                        
                        /* Performance optimizations */
                        .product-item {
                            transform: translateZ(0);
                            backface-visibility: hidden;
                        }
                        
                        /* Lazy loading support */
                        img[loading="lazy"] {
                            opacity: 0;
                            transition: opacity 0.3s;
                        }
                        
                        img[loading="lazy"].loaded {
                            opacity: 1;
                        }
                        
                        @media (max-width: 767px) {
                            .product-item {
                                margin-bottom: 20px;
                            }
                            
                            .product-img img {
                                width: 100%;
                                height: auto;
                                max-height: 200px;
                                object-fit: cover;
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
                        
                        .zoa-btn {
                            display: inline-block;
                            text-decoration: none;
                        }
                        
                        .product-button-group {
                            display: flex;
                            justify-content: center;
                            gap: 5px;
                        }
                        
                        @media (max-width: 767px) {
                            .hidden-xs {
                                display: none !important;
                            }
                            .visible-xs {
                                display: block !important;
                            }
                        }
                        
                        @media (min-width: 768px) {
                            .visible-xs {
                                display: none !important;
                            }
                        }
                        
                        /* Optimize for mobile performance */
                        @media (max-width: 767px) {
                            .product-img {
                                contain: layout style paint;
                            }
                        }
                    `}</style>
                </div>
            </div>

            {/* Rest of the component remains the same */}
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