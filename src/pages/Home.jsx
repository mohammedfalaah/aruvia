import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { contextData } from '../services/Context'; 
import WhatsappChat from '../utils/WhatsappChat';
import SEO from '../services/SEO';
import { createUniqueSlug } from '../utils/slugHelper';
import { ShoppingCart, Eye, Heart, Star, TrendingUp, Leaf, Award, Shield } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    
    const { 
        addToCart, 
        fetchCartItems, 
        notification, 
        cartItems 
    } = useContext(contextData);
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

    // Get item count for a specific product
    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    // Handle product click
    const handleProductClick = (product) => {
        const slug = createUniqueSlug(product.name, product._id);
        navigate(`/product/${slug}`, { state: { product } });
    };

    // Configure axios with timeout
    const apiClient = axios.create({
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    });

    // Fetch products
    const fetchProducts = useCallback(async (attempt = 1, maxAttempts = 3) => {
        try {
            setLoading(true);
            setError(null);
            if (attempt > 1) setIsRetrying(true);
            
            const response = await apiClient.get('https://aruvia-backend-rho.vercel.app/api/products');
            
            if (response.data && response.data.success === "true" && response.data.data) {
                setProducts(response.data.data);
                setRetryCount(0);
                setIsRetrying(false);
            } else {
                throw new Error(response.data?.message || "Invalid response structure");
            }
            
        } catch (error) {
            const shouldRetry = attempt < maxAttempts && (
                error.code === 'ECONNABORTED' ||
                error.code === 'NETWORK_ERROR' ||
                error.response?.status >= 500 ||
                !error.response
            );
            
            if (shouldRetry) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                setTimeout(() => {
                    setRetryCount(attempt);
                    fetchProducts(attempt + 1, maxAttempts);
                }, delay);
            } else {
                setError(error.response?.data?.message || error.message || 'Failed to fetch products');
                setProducts([]);
                setIsRetrying(false);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleManualRetry = () => {
        setRetryCount(0);
        fetchProducts();
    };

    useEffect(() => {
        const initializeData = async () => {
            await fetchProducts();
            if (fetchCartItems) fetchCartItems();
        };
        initializeData();
    }, []);

    // Handle add to cart
    const handleAddToCart = async (productId, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setLoading(true);
        
        try {
            const product = products.find(p => p._id === productId);
            if (!product) {
                setLoading(false);
                return;
            }
            await addToCart(productId, product, 1);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modern-home">
            <SEO 
                title="Premium Herbal Products"
                description="Discover Aruvia Herbals - Your trusted source for 100% natural, organic herbal products."
                keywords="herbal products, organic herbs, natural supplements, ayurvedic products"
                url="https://aruviaherbals.com"
                type="website"
            />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Leaf size={16} />
                            <span>100% Natural & Organic</span>
                        </div>
                        <h1 className="hero-title">
                            Discover the Power of
                            <span className="hero-highlight"> Nature</span>
                        </h1>
                        <p className="hero-description">
                            Premium herbal products crafted with care for your wellness journey
                        </p>
                        <div className="hero-buttons">
                            <button 
                                className="btn-primary"
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Shop Now
                            </button>
                            <Link to="/contact-us" className="btn-secondary">
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="/assets/images/banner/Aruvia_banner01.jpg" 
                            alt="Aruvia Herbals"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Leaf size={32} />
                            </div>
                            <h3>100% Natural</h3>
                            <p>Pure herbal ingredients</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Award size={32} />
                            </div>
                            <h3>Premium Quality</h3>
                            <p>Certified & tested products</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Safe & Effective</h3>
                            <p>Trusted by thousands</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <TrendingUp size={32} />
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Quick & secure shipping</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="products-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">Handpicked natural remedies for your wellness</p>
                    </div>

                    {loading && products.length === 0 && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>{isRetrying ? `Retrying... (${retryCount}/3)` : 'Loading products...'}</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="error-state">
                            <div className="error-icon">⚠️</div>
                            <h4>Failed to Load Products</h4>
                            <p>{error}</p>
                            <button onClick={handleManualRetry} className="btn-retry">
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h4>No Products Found</h4>
                            <button onClick={handleManualRetry} className="btn-retry">
                                Refresh Products
                            </button>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image-wrapper">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                            onClick={() => handleProductClick(product)}
                                        />
                                        <div className="product-overlay">
                                            <button
                                                className="overlay-btn"
                                                onClick={() => handleProductClick(product)}
                                                title="Quick View"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                className="overlay-btn"
                                                onClick={(e) => handleAddToCart(product._id, e)}
                                                title="Add to Cart"
                                                disabled={loading}
                                            >
                                                <ShoppingCart size={20} />
                                                {getProductCartCount(product._id) > 0 && (
                                                    <span className="cart-badge">
                                                        {getProductCartCount(product._id)}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        {product.discount && (
                                            <div className="product-badge">-{product.discount}%</div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 
                                            className="product-name"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            {product.name}
                                        </h3>
                                        <div className="product-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill="#ffc107" color="#ffc107" />
                                            ))}
                                            <span>(4.8)</span>
                                        </div>
                                        <div className="product-price">
                                            <span className="current-price">₹{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="original-price">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Instagram Section */}
            <section className="instagram-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Follow Us on Instagram</h2>
                        <p className="section-subtitle">@aruviaherbals</p>
                    </div>
                    <div className="instagram-grid">
                        {[
                            { url: "https://www.instagram.com/reel/DKkUfvYhzof/", video: "/assets/videos/instagram-reel1.mp4" },
                            { url: "https://www.instagram.com/reel/DM2Kb_nBvEX/", video: "/assets/videos/instagram-reel2.mp4" },
                            { url: "https://www.instagram.com/reel/DMcm2T2B7ig/", video: "/assets/videos/instagram-reel3.mp4" },
                            { url: "https://www.instagram.com/reel/DLAD3vbB2uJ/", video: "/assets/videos/instagram-reel4.mp4" }
                        ].map((item, index) => (
                            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="instagram-item">
                                <video 
                                    muted
                                    loop
                                    playsInline
                                    className="instagram-video"
                                >
                                    <source src={item.video} type="video/mp4" />
                                </video>
                                <div className="instagram-overlay">
                                    <span>View on Instagram</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <h2>Get in Touch</h2>
                            <p>Subscribe for latest stories and promotions</p>
                        </div>
                        <div className="newsletter-links">
                            <h3>Support</h3>
                            <ul>
                                <li><Link to="/cancellation-refund">Cancellation & Refund</Link></li>
                                <li><Link to="/delivery-policy">Shipping & Delivery</Link></li>
                                <li><Link to="/contact-us">Contact Us</Link></li>
                                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <WhatsappChat />

            <style jsx>{`
                .modern-home {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }

                /* Hero Section */
                .hero-section {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 80px 20px;
                    overflow: hidden;
                }

                .hero-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                .hero-content {
                    animation: fadeInUp 0.8s ease-out;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(76, 175, 80, 0.1);
                    color: #4caf50;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 20px;
                }

                .hero-title {
                    font-size: 56px;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #1a1a1a;
                    margin-bottom: 20px;
                }

                .hero-highlight {
                    color: #4caf50;
                    position: relative;
                }

                .hero-description {
                    font-size: 18px;
                    color: #666;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }

                .hero-buttons {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .btn-primary, .btn-secondary {
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-primary {
                    background: #4caf50;
                    color: white;
                }

                .btn-primary:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
                }

                .btn-secondary {
                    background: white;
                    color: #4caf50;
                    border: 2px solid #4caf50;
                }

                .btn-secondary:hover {
                    background: #4caf50;
                    color: white;
                }

                .hero-image {
                    position: relative;
                    animation: fadeInRight 0.8s ease-out;
                }

                .hero-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                }

                /* Features Section */
                .features-section {
                    padding: 60px 20px;
                    background: white;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .feature-card {
                    text-align: center;
                    padding: 30px 20px;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .feature-icon {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .feature-card h3 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 10px;
                }

                .feature-card p {
                    color: #666;
                    font-size: 14px;
                }

                /* Products Section */
                .products-section {
                    padding: 80px 20px;
                    background: #f8f9fa;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .section-title {
                    font-size: 42px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 10px;
                }

                .section-subtitle {
                    font-size: 18px;
                    color: #666;
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                }

                .product-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
                }

                .product-image-wrapper {
                    position: relative;
                    overflow: hidden;
                    aspect-ratio: 1;
                    background: #f5f5f5;
                }

                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .product-card:hover .product-image {
                    transform: scale(1.1);
                }

                .product-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .product-card:hover .product-overlay {
                    opacity: 1;
                }

                .overlay-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .overlay-btn:hover {
                    background: #4caf50;
                    color: white;
                    transform: scale(1.1);
                }

                .cart-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #f44336;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                .product-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #f44336;
                    color: white;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .product-info {
                    padding: 20px;
                }

                .product-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 10px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 10px;
                }

                .product-rating span {
                    font-size: 14px;
                    color: #666;
                    margin-left: 5px;
                }

                .product-price {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .current-price {
                    font-size: 24px;
                    font-weight: 700;
                    color: #4caf50;
                }

                .original-price {
                    font-size: 16px;
                    color: #999;
                    text-decoration: line-through;
                }

                /* Instagram Section */
                .instagram-section {
                    padding: 80px 20px;
                    background: white;
                }

                .instagram-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .instagram-item {
                    position: relative;
                    aspect-ratio: 9/16;
                    border-radius: 12px;
                    overflow: hidden;
                    display: block;
                }

                .instagram-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .instagram-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    color: white;
                    font-weight: 600;
                }

                .instagram-item:hover .instagram-overlay {
                    opacity: 1;
                }

                /* Newsletter Section */
                .newsletter-section {
                    padding: 60px 20px;
                    background: #1a1a1a;
                    color: white;
                }

                .newsletter-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .newsletter-text h2 {
                    font-size: 36px;
                    margin-bottom: 10px;
                }

                .newsletter-text p {
                    color: #ccc;
                }

                .newsletter-links h3 {
                    font-size: 20px;
                    margin-bottom: 20px;
                }

                .newsletter-links ul {
                    list-style: none;
                    padding: 0;
                }

                .newsletter-links li {
                    margin-bottom: 12px;
                }

                .newsletter-links a {
                    color: #ccc;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .newsletter-links a:hover {
                    color: #4caf50;
                }

                /* Loading & Error States */
                .loading-state, .error-state, .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4caf50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-icon, .empty-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }

                .btn-retry {
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: #4caf50;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-retry:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                }

                /* Animations */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .hero-container {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .hero-title {
                        font-size: 36px;
                    }

                    .hero-description {
                        font-size: 16px;
                    }

                    .section-title {
                        font-size: 32px;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }

                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                    }

                    .newsletter-content {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .instagram-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    )
}

export default Home
