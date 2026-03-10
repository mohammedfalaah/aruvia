import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { contextData } from '../services/Context'; 
import WhatsappChat from '../utils/WhatsappChat';
import SEO from '../services/SEO';
import { createUniqueSlug } from '../utils/slugHelper';
import { ShoppingCart, Eye, Star, Sparkles, Shield, Award, TrendingUp, Leaf, ArrowRight, Crown, Zap, Play, ChevronRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    
    const { 
        addToCart, 
        fetchCartItems, 
        cartItems 
    } = useContext(contextData);
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    const handleProductClick = (product) => {
        const slug = createUniqueSlug(product.name, product._id);
        navigate(`/product/${slug}`, { state: { product } });
    };

    const apiClient = axios.create({
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    });

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
        <div className="modern-trendy-home">
            <SEO 
                title="Premium Herbal Products - Aruvia Herbals"
                description="Discover Aruvia Herbals - Your trusted source for 100% natural, organic herbal products."
                keywords="herbal products, organic herbs, natural supplements, ayurvedic products"
                url="https://aruviaherbals.com"
                type="website"
            />

            {/* Ultra Modern Hero Section */}
            <section className="ultra-hero">
                <div className="hero-bg-mesh"></div>
                <div className="floating-elements">
                    <div className="float-element element-1"></div>
                    <div className="float-element element-2"></div>
                    <div className="float-element element-3"></div>
                </div>
                
                <div className="hero-container-modern">
                    <div className="hero-content-modern">
                        <div className="trending-badge">
                            <Sparkles size={16} />
                            <span>TRENDING NOW</span>
                            <div className="badge-glow"></div>
                        </div>
                        
                        <h1 className="hero-title-modern">
                            <span className="title-line">Wellness</span>
                            <span className="title-line gradient-text">Redefined</span>
                            <span className="title-line">for You</span>
                        </h1>
                        
                        <p className="hero-desc-modern">
                            Experience the future of natural wellness with our premium collection 
                            of scientifically-backed herbal products
                        </p>
                        
                        <div className="hero-stats-modern">
                            <div className="stat-modern">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat-divider-modern"></div>
                            <div className="stat-modern">
                                <div className="stat-number">100%</div>
                                <div className="stat-label">Natural</div>
                            </div>
                            <div className="stat-divider-modern"></div>
                            <div className="stat-modern">
                                <div className="stat-number">5★</div>
                                <div className="stat-label">Rated</div>
                            </div>
                        </div>
                        
                        <div className="hero-actions-modern">
                            <button 
                                className="btn-modern-primary"
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Play size={20} />
                                <span>Explore Collection</span>
                                <div className="btn-shine"></div>
                            </button>
                            
                            <Link to="/products" className="btn-modern-ghost">
                                <span>Shop Now</span>
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hero-visual-modern">
                        <div className="product-showcase">
                            <div className="showcase-card card-1">
                                <img src="/assets/images/banner/Aruvia_banner01.jpg" alt="Premium Product" />
                                <div className="card-glow"></div>
                            </div>
                            <div className="showcase-card card-2">
                                <img src="/assets/images/banner/av02.jpg" alt="Natural Ingredients" />
                                <div className="card-glow"></div>
                            </div>
                            <div className="showcase-card card-3">
                                <img src="/assets/images/banner/av03.jpg" alt="Wellness Products" />
                                <div className="card-glow"></div>
                            </div>
                        </div>
                        
                        <div className="floating-info">
                            <div className="info-bubble bubble-1">
                                <Crown size={24} />
                                <div>
                                    <h4>Premium</h4>
                                    <p>Quality</p>
                                </div>
                            </div>
                            <div className="info-bubble bubble-2">
                                <Leaf size={24} />
                                <div>
                                    <h4>100%</h4>
                                    <p>Organic</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Features Grid */}
            <section className="features-modern">
                <div className="features-container-modern">
                    <div className="feature-card-modern">
                        <div className="feature-icon-modern">
                            <Leaf size={28} />
                        </div>
                        <h3>100% Natural</h3>
                        <p>Pure organic ingredients</p>
                        <div className="feature-bg-glow"></div>
                    </div>
                    
                    <div className="feature-card-modern">
                        <div className="feature-icon-modern">
                            <Shield size={28} />
                        </div>
                        <h3>Lab Tested</h3>
                        <p>Scientifically verified</p>
                        <div className="feature-bg-glow"></div>
                    </div>
                    
                    <div className="feature-card-modern">
                        <div className="feature-icon-modern">
                            <Award size={28} />
                        </div>
                        <h3>Premium Grade</h3>
                        <p>Finest quality assured</p>
                        <div className="feature-bg-glow"></div>
                    </div>
                    
                    <div className="feature-card-modern">
                        <div className="feature-icon-modern">
                            <Zap size={28} />
                        </div>
                        <h3>Fast Delivery</h3>
                        <p>Express shipping</p>
                        <div className="feature-bg-glow"></div>
                    </div>
                </div>
            </section>

            {/* Ultra Modern Products Section */}
            <section id="products" className="products-modern">
                <div className="products-container-modern">
                    <div className="section-header-modern">
                        <div className="section-badge-modern">
                            <Sparkles size={16} />
                            <span>BESTSELLERS</span>
                        </div>
                        <h2 className="section-title-modern">
                            Trending Products
                        </h2>
                        <p className="section-subtitle-modern">
                            Discover what everyone's talking about
                        </p>
                    </div>

                    {loading && products.length === 0 && (
                        <div className="loading-modern">
                            <div className="modern-spinner"></div>
                            <p>Loading amazing products...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="error-modern">
                            <div className="error-icon">⚠️</div>
                            <h4>Oops! Something went wrong</h4>
                            <p>{error}</p>
                            <button onClick={handleManualRetry} className="btn-modern-primary">
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="empty-modern">
                            <div className="empty-icon">📦</div>
                            <h4>No Products Available</h4>
                            <button onClick={handleManualRetry} className="btn-modern-primary">
                                Refresh
                            </button>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="products-grid-modern">
                            {products.map((product, index) => (
                                <div 
                                    key={product._id} 
                                    className="product-card-modern"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="product-image-modern">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            onClick={() => handleProductClick(product)}
                                        />
                                        <div className="product-overlay-modern">
                                            <button
                                                className="overlay-btn-modern view-btn"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                className="overlay-btn-modern cart-btn"
                                                onClick={(e) => handleAddToCart(product._id, e)}
                                                disabled={loading}
                                            >
                                                <ShoppingCart size={20} />
                                                {getProductCartCount(product._id) > 0 && (
                                                    <span className="cart-badge-modern">
                                                        {getProductCartCount(product._id)}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        <div className="product-glow-modern"></div>
                                        {product.discount && (
                                            <div className="discount-badge-modern">-{product.discount}%</div>
                                        )}
                                        <div className="trending-tag-modern">
                                            <TrendingUp size={12} />
                                            TRENDING
                                        </div>
                                    </div>
                                    
                                    <div className="product-info-modern">
                                        <span className="product-category-modern">Premium</span>
                                        <h3 
                                            className="product-name-modern"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            {product.name}
                                        </h3>
                                        <div className="product-rating-modern">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                                            ))}
                                            <span>(4.9)</span>
                                        </div>
                                        <div className="product-footer-modern">
                                            <div className="price-modern">
                                                <span className="current-price-modern">₹{product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="original-price-modern">₹{product.originalPrice}</span>
                                                )}
                                            </div>
                                            <button 
                                                className="add-btn-modern"
                                                onClick={(e) => handleAddToCart(product._id, e)}
                                            >
                                                <ShoppingCart size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modern Instagram Section */}
            <section className="instagram-modern">
                <div className="instagram-container-modern">
                    <div className="section-header-modern">
                        <div className="section-badge-modern">
                            <Sparkles size={16} />
                            <span>SOCIAL</span>
                        </div>
                        <h2 className="section-title-modern">
                            Follow Our Journey
                        </h2>
                        <p className="section-subtitle-modern">
                            @aruviaherbals
                        </p>
                    </div>
                    
                    <div className="instagram-grid-modern">
                        {[
                            { url: "https://www.instagram.com/reel/DKkUfvYhzof/", video: "/assets/videos/instagram-reel1.mp4" },
                            { url: "https://www.instagram.com/reel/DM2Kb_nBvEX/", video: "/assets/videos/instagram-reel2.mp4" },
                            { url: "https://www.instagram.com/reel/DMcm2T2B7ig/", video: "/assets/videos/instagram-reel3.mp4" },
                            { url: "https://www.instagram.com/reel/DLAD3vbB2uJ/", video: "/assets/videos/instagram-reel4.mp4" }
                        ].map((item, index) => (
                            <a 
                                key={index} 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="instagram-item-modern"
                            >
                                <video 
                                    muted
                                    loop
                                    playsInline
                                    className="instagram-video-modern"
                                >
                                    <source src={item.video} type="video/mp4" />
                                </video>
                                <div className="instagram-overlay-modern">
                                    <Play size={32} />
                                    <span>Watch on Instagram</span>
                                </div>
                                <div className="video-glow"></div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Footer CTA */}
            <section className="footer-cta-modern">
                <div className="cta-container-modern">
                    <div className="cta-content-modern">
                        <div className="cta-left-modern">
                            <Sparkles size={40} className="cta-icon-modern" />
                            <div>
                                <h2>Stay Updated</h2>
                                <p>Get exclusive offers and wellness tips</p>
                            </div>
                        </div>
                        <div className="cta-right-modern">
                            <h3>Quick Links</h3>
                            <div className="footer-links-modern">
                                <Link to="/cancellation-refund">Refund Policy</Link>
                                <Link to="/delivery-policy">Delivery Info</Link>
                                <Link to="/contact-us">Contact</Link>
                                <Link to="/privacy-policy">Privacy</Link>
                                <Link to="/terms-and-conditions">Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <WhatsappChat />

            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .modern-trendy-home {
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                    color: #ffffff;
                    overflow-x: hidden;
                    position: relative;
                }

                /* Ultra Modern Hero */
                .ultra-hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 0 20px;
                    overflow: hidden;
                }

                .hero-bg-mesh {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.3) 0%, transparent 50%);
                    animation: meshMove 20s ease-in-out infinite;
                }

                @keyframes meshMove {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(180deg); }
                }

                .floating-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .float-element {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    backdrop-filter: blur(10px);
                    animation: float 15s ease-in-out infinite;
                }

                .element-1 {
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .element-2 {
                    top: 60%;
                    right: 10%;
                    animation-delay: 5s;
                }

                .element-3 {
                    bottom: 20%;
                    left: 50%;
                    animation-delay: 10s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-30px) rotate(120deg); }
                    66% { transform: translateY(15px) rotate(240deg); }
                }

                .hero-container-modern {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                }

                .hero-content-modern {
                    animation: slideInLeft 1s ease-out;
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .trending-badge {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #7877c6;
                    margin-bottom: 30px;
                    overflow: hidden;
                }

                .badge-glow {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    animation: badgeShine 3s ease-in-out infinite;
                }

                @keyframes badgeShine {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: 100%; }
                }

                .hero-title-modern {
                    font-size: 80px;
                    font-weight: 900;
                    line-height: 0.9;
                    margin-bottom: 30px;
                    letter-spacing: -3px;
                }

                .title-line {
                    display: block;
                    animation: titleReveal 1s ease-out forwards;
                    opacity: 0;
                    transform: translateY(50px);
                }

                .title-line:nth-child(1) { animation-delay: 0.2s; }
                .title-line:nth-child(2) { animation-delay: 0.4s; }
                .title-line:nth-child(3) { animation-delay: 0.6s; }

                @keyframes titleReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .gradient-text {
                    background: linear-gradient(135deg, #7877c6 0%, #ff77c6 50%, #77dbe2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease-in-out infinite;
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .hero-desc-modern {
                    font-size: 20px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 40px;
                    max-width: 500px;
                }

                .hero-stats-modern {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    margin-bottom: 50px;
                    padding: 25px 30px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }

                .stat-modern {
                    text-align: center;
                }

                .stat-number {
                    font-size: 32px;
                    font-weight: 900;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-label {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }

                .stat-divider-modern {
                    width: 1px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                }

                .hero-actions-modern {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .btn-modern-primary {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 18px 40px;
                    background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(120, 119, 198, 0.4);
                }

                .btn-modern-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 60px rgba(120, 119, 198, 0.6);
                }

                .btn-shine {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.5s ease;
                }

                .btn-modern-primary:hover .btn-shine {
                    left: 100%;
                }

                .btn-modern-ghost {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 18px 30px;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.8);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .btn-modern-ghost:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.4);
                    color: white;
                }

                .hero-visual-modern {
                    position: relative;
                    animation: slideInRight 1s ease-out;
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .product-showcase {
                    position: relative;
                    width: 100%;
                    height: 500px;
                }

                .showcase-card {
                    position: absolute;
                    width: 200px;
                    height: 250px;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(20px);
                    transition: all 0.3s ease;
                }

                .showcase-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .card-1 {
                    top: 0;
                    left: 0;
                    z-index: 3;
                    animation: cardFloat1 6s ease-in-out infinite;
                }

                .card-2 {
                    top: 50px;
                    right: 50px;
                    z-index: 2;
                    animation: cardFloat2 6s ease-in-out infinite;
                }

                .card-3 {
                    bottom: 0;
                    left: 100px;
                    z-index: 1;
                    animation: cardFloat3 6s ease-in-out infinite;
                }

                @keyframes cardFloat1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }

                @keyframes cardFloat2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(15px) rotate(-2deg); }
                }

                @keyframes cardFloat3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(1deg); }
                }

                .showcase-card:hover {
                    transform: scale(1.05) !important;
                    z-index: 10 !important;
                }

                .card-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.3), rgba(255, 119, 198, 0.3));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .showcase-card:hover .card-glow {
                    opacity: 1;
                }

                .floating-info {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .info-bubble {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50px;
                    color: white;
                    animation: bubbleFloat 4s ease-in-out infinite;
                }

                .bubble-1 {
                    top: 20%;
                    right: -20px;
                    animation-delay: 0s;
                }

                .bubble-2 {
                    bottom: 30%;
                    left: -30px;
                    animation-delay: 2s;
                }

                @keyframes bubbleFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }

                .info-bubble h4 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                }

                .info-bubble p {
                    font-size: 12px;
                    margin: 0;
                    opacity: 0.8;
                }
                /* Modern Features */
                .features-modern {
                    padding: 100px 20px;
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                }

                .features-container-modern {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                }

                .feature-card-modern {
                    position: relative;
                    padding: 40px 30px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .feature-card-modern:hover {
                    transform: translateY(-10px);
                    border-color: rgba(120, 119, 198, 0.5);
                    box-shadow: 0 20px 60px rgba(120, 119, 198, 0.2);
                }

                .feature-icon-modern {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 20px;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.3s ease;
                }

                .feature-card-modern:hover .feature-icon-modern {
                    transform: scale(1.1) rotate(10deg);
                }

                .feature-card-modern h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: white;
                }

                .feature-card-modern p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                }

                .feature-bg-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(255, 119, 198, 0.1));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .feature-card-modern:hover .feature-bg-glow {
                    opacity: 1;
                }

                /* Ultra Modern Products */
                .products-modern {
                    padding: 120px 20px;
                    background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%);
                }

                .products-container-modern {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .section-header-modern {
                    text-align: center;
                    margin-bottom: 80px;
                }

                .section-badge-modern {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(255, 119, 198, 0.2));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #7877c6;
                    margin-bottom: 20px;
                }

                .section-title-modern {
                    font-size: 64px;
                    font-weight: 900;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #ffffff 0%, #7877c6 50%, #ff77c6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -2px;
                }

                .section-subtitle-modern {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                }

                .products-grid-modern {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 40px;
                }

                .product-card-modern {
                    position: relative;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    animation: productReveal 0.6s ease-out forwards;
                    opacity: 0;
                    transform: translateY(50px);
                }

                @keyframes productReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .product-card-modern:hover {
                    transform: translateY(-15px) scale(1.02);
                    border-color: rgba(120, 119, 198, 0.5);
                    box-shadow: 0 30px 80px rgba(120, 119, 198, 0.3);
                }

                .product-image-modern {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(255, 119, 198, 0.1));
                }

                .product-image-modern img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                    cursor: pointer;
                }

                .product-card-modern:hover .product-image-modern img {
                    transform: scale(1.15);
                }

                .product-overlay-modern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 15, 35, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .product-card-modern:hover .product-overlay-modern {
                    opacity: 1;
                }

                .overlay-btn-modern {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .overlay-btn-modern:hover {
                    transform: scale(1.2);
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-color: transparent;
                }

                .overlay-btn-modern.cart-btn {
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-color: transparent;
                }

                .cart-badge-modern {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4757;
                    color: white;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .product-glow-modern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(255, 119, 198, 0.2));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .product-card-modern:hover .product-glow-modern {
                    opacity: 1;
                }

                .discount-badge-modern {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: linear-gradient(135deg, #ff4757, #ff3742);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    z-index: 2;
                }

                .trending-tag-modern {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    z-index: 2;
                }

                .product-info-modern {
                    padding: 25px;
                }

                .product-category-modern {
                    color: #7877c6;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    display: block;
                }

                .product-name-modern {
                    font-size: 20px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 48px;
                }

                .product-name-modern:hover {
                    color: #7877c6;
                }

                .product-rating-modern {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 15px;
                }

                .product-rating-modern span {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-left: 5px;
                }

                .product-footer-modern {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .price-modern {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .current-price-modern {
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .original-price-modern {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.5);
                    text-decoration: line-through;
                }

                .add-btn-modern {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .add-btn-modern:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 30px rgba(120, 119, 198, 0.5);
                }

                /* Modern Instagram */
                .instagram-modern {
                    padding: 120px 20px;
                    background: rgba(255, 255, 255, 0.02);
                }

                .instagram-container-modern {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .instagram-grid-modern {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                }

                .instagram-item-modern {
                    position: relative;
                    aspect-ratio: 9/16;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    display: block;
                }

                .instagram-item-modern:hover {
                    transform: translateY(-10px);
                    border-color: rgba(120, 119, 198, 0.5);
                    box-shadow: 0 20px 60px rgba(120, 119, 198, 0.3);
                }

                .instagram-video-modern {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .instagram-overlay-modern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.8), rgba(255, 119, 198, 0.8));
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    color: white;
                    font-weight: 700;
                }

                .instagram-item-modern:hover .instagram-overlay-modern {
                    opacity: 1;
                }

                .video-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(255, 119, 198, 0.2));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .instagram-item-modern:hover .video-glow {
                    opacity: 1;
                }

                /* Modern Footer CTA */
                .footer-cta-modern {
                    padding: 80px 20px;
                    background: linear-gradient(135deg, rgba(15, 15, 35, 0.9), rgba(26, 26, 46, 0.9));
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .cta-container-modern {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .cta-content-modern {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 80px;
                    align-items: start;
                }

                .cta-left-modern {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                }

                .cta-icon-modern {
                    color: #7877c6;
                    flex-shrink: 0;
                }

                .cta-left-modern h2 {
                    font-size: 42px;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 15px;
                    letter-spacing: -1px;
                }

                .cta-left-modern p {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                }

                .cta-right-modern h3 {
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 25px;
                }

                .footer-links-modern {
                    display: grid;
                    gap: 15px;
                }

                .footer-links-modern a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    padding: 8px 0;
                }

                .footer-links-modern a:hover {
                    color: #7877c6;
                    padding-left: 10px;
                }

                /* Loading & Error States */
                .loading-modern, .error-modern, .empty-modern {
                    text-align: center;
                    padding: 80px 20px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }

                .modern-spinner {
                    width: 60px;
                    height: 60px;
                    border: 5px solid rgba(255, 255, 255, 0.1);
                    border-top: 5px solid #7877c6;
                    border-radius: 50%;
                    animation: modernSpin 1s linear infinite;
                    margin: 0 auto 25px;
                }

                @keyframes modernSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-modern p, .error-modern p, .empty-modern p {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-top: 15px;
                }

                .error-icon, .empty-icon {
                    font-size: 80px;
                    margin-bottom: 25px;
                }

                .error-modern h4, .empty-modern h4 {
                    font-size: 28px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 15px;
                }
                /* Responsive Design */
                @media (max-width: 1200px) {
                    .hero-title-modern {
                        font-size: 60px;
                    }

                    .section-title-modern {
                        font-size: 48px;
                    }
                }

                @media (max-width: 968px) {
                    .hero-container-modern {
                        grid-template-columns: 1fr;
                        gap: 50px;
                        text-align: center;
                    }

                    .hero-title-modern {
                        font-size: 48px;
                    }

                    .hero-stats-modern {
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .stat-divider-modern {
                        display: none;
                    }

                    .product-showcase {
                        height: 400px;
                    }

                    .showcase-card {
                        width: 150px;
                        height: 200px;
                    }

                    .cta-content-modern {
                        grid-template-columns: 1fr;
                        gap: 50px;
                    }

                    .features-container-modern {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .ultra-hero {
                        padding: 80px 20px 60px;
                        min-height: auto;
                    }

                    .hero-title-modern {
                        font-size: 36px;
                    }

                    .hero-desc-modern {
                        font-size: 16px;
                    }

                    .hero-stats-modern {
                        flex-direction: column;
                        gap: 20px;
                        padding: 20px;
                    }

                    .hero-actions-modern {
                        flex-direction: column;
                        width: 100%;
                    }

                    .btn-modern-primary, .btn-modern-ghost {
                        width: 100%;
                        justify-content: center;
                    }

                    .section-title-modern {
                        font-size: 32px;
                    }

                    .products-grid-modern {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 25px;
                    }

                    .features-container-modern {
                        grid-template-columns: 1fr;
                    }

                    .instagram-grid-modern {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }

                    .cta-left-modern {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }

                    .cta-left-modern h2 {
                        font-size: 28px;
                    }

                    .floating-info {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .hero-title-modern {
                        font-size: 28px;
                    }

                    .section-title-modern {
                        font-size: 24px;
                    }

                    .products-grid-modern {
                        grid-template-columns: 1fr;
                    }

                    .instagram-grid-modern {
                        grid-template-columns: 1fr;
                    }

                    .product-showcase {
                        height: 300px;
                    }

                    .showcase-card {
                        width: 120px;
                        height: 150px;
                    }

                    .floating-elements {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}

export default Home