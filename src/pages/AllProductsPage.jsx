import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { contextData } from '../services/Context';
import { createUniqueSlug } from '../utils/slugHelper';
import { ShoppingCart, Eye, Star, Search, Filter, Grid, List, SlidersHorizontal, Sparkles, Leaf, TrendingUp } from 'lucide-react';

const AllProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const { addToCart, cartItems } = useContext(contextData);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        fetchProducts();
    }, []);

    const apiClient = axios.create({
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get('https://aruvia-backend-rho.vercel.app/api/products');
            
            if (response.data && response.data.success === "true" && response.data.data) {
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);
            } else {
                throw new Error(response.data?.message || "Invalid response structure");
            }
            
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to fetch products');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter and sort products
    useEffect(() => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Price filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    const handleProductClick = (product) => {
        const slug = createUniqueSlug(product.name, product._id);
        navigate(`/product/${slug}`, { state: { product } });
    };

    const handleAddToCart = async (productId, event) => {
        console.log('Add to cart clicked on products page:', productId);
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setLoading(true);
        
        try {
            const product = products.find(p => p._id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                setLoading(false);
                return;
            }
            console.log('Adding product to cart:', product.name);
            await addToCart(productId, product, 1);
            console.log('Product added to cart successfully');
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="all-products-page">
            {/* Hero Section */}
            {/* <section className="products-hero">
                <div className="hero-background">
                    <div className="gradient-mesh"></div>
                    <div className="floating-elements">
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                    </div>
                </div>
                <div className="hero-content">
                    <div className="hero-icon">
                        <Leaf size={48} />
                    </div>
                    <h1>All Products</h1>
                    <p>Discover our complete collection of premium herbal products</p>
                </div>
            </section> */}

            {/* Filters and Search */}
            <section className="products-controls">
                <div className="container">
                    <div className="controls-header">
                        <div className="search-container">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        
                        {/* <div className="control-buttons">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                            </button>
                            
                            <div className="view-toggle">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div> */}
                    </div>

                    {/* Filters Panel */}
                    {/* <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
                        <div className="filter-group">
                            <label>Category</label>
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sort By</label>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="name">Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                            <div className="price-range">
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                    className="range-slider"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="range-slider"
                                />
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>

            {/* Products Grid */}
            <section className="products-section">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>Error: {error}</p>
                            <button onClick={fetchProducts} className="retry-btn">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="products-header">
                                <h2>
                                    {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                                </h2>
                            </div>
                            
                            <div className={`products-grid ${viewMode}`}>
                                {filteredProducts.map((product, index) => (
                                    <div 
                                        key={product._id}
                                        className="product-card"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="product-image" onClick={() => handleProductClick(product)}>
                                            <img 
                                                src={product.image || "/assets/img/home9/product1.png"} 
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            <div className="product-overlay">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleAddToCart(product._id, e);
                                                    }}
                                                    className="add-to-cart-btn"
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart size={20} />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleProductClick(product);
                                                    }}
                                                    className="quick-view-btn"
                                                    title="View Product"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                            {getProductCartCount(product._id) > 0 && (
                                                <div className="cart-indicator">
                                                    <span>{getProductCartCount(product._id)}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="product-info">
                                            <h3 className="product-name">{product.name}</h3>
                                            <p className="product-description">
                                                {product.description?.substring(0, 100)}...
                                            </p>
                                            <div className="product-rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className="star" />
                                                ))}
                                                <span>(4.5)</span>
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
                        </>
                    )}
                </div>
            </section>

            <style jsx>{`
                .all-products-page {
                    min-height: 100vh;
                    background: #0f0f23;
                    padding-top: 80px;
                }

                /* Hero Section */
                .products-hero {
                    position: relative;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                }

                .gradient-mesh {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(119, 219, 226, 0.3) 0%, transparent 50%);
                }

                .floating-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }

                .floating-element {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(255, 119, 198, 0.1));
                    border-radius: 50%;
                    animation: float 6s ease-in-out infinite;
                }

                .floating-element:nth-child(1) {
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .floating-element:nth-child(2) {
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .floating-element:nth-child(3) {
                    bottom: 20%;
                    left: 50%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    color: white;
                }

                .hero-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #77dbe2, #7877c6);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: white;
                }

                .hero-content h1 {
                    font-size: 48px;
                    font-weight: 900;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #77dbe2, #7877c6, #ff77c6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-content p {
                    font-size: 18px;
                    opacity: 0.8;
                    max-width: 500px;
                    margin: 0 auto;
                }

                /* Controls Section */
                .products-controls {
                    padding: 40px 0;
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .controls-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .search-container {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-container svg {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.5);
                }

                .search-input {
                    width: 100%;
                    padding: 15px 15px 15px 50px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #7877c6;
                    box-shadow: 0 0 20px rgba(120, 119, 198, 0.3);
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .control-buttons {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .filter-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-toggle:hover,
                .filter-toggle.active {
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-color: transparent;
                }

                .view-toggle {
                    display: flex;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .view-btn {
                    padding: 12px;
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .view-btn.active {
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    color: white;
                }

                /* Filters Panel */
                .filters-panel {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    max-height: 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .filters-panel.show {
                    max-height: 200px;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-group label {
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                }

                .filter-select {
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                }

                .filter-select option {
                    background: #1a1a2e;
                    color: white;
                }

                .price-range {
                    display: flex;
                    gap: 10px;
                }

                .range-slider {
                    flex: 1;
                    -webkit-appearance: none;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    outline: none;
                }

                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border-radius: 50%;
                    cursor: pointer;
                }

                /* Products Section */
                .products-section {
                    padding: 60px 0;
                }

                .products-header {
                    margin-bottom: 40px;
                }

                .products-header h2 {
                    color: white;
                    font-size: 24px;
                    font-weight: 700;
                }

                .products-grid {
                    display: grid;
                    gap: 30px;
                }

                .products-grid.grid {
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                }

                .products-grid.list {
                    grid-template-columns: 1fr;
                }

                .products-grid.list .product-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .products-grid.list .product-image {
                    width: 200px;
                    height: 200px;
                    flex-shrink: 0;
                }

                .products-grid.list .product-info {
                    flex: 1;
                }

                .product-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: fadeInUp 0.6s ease forwards;
                    opacity: 0;
                    transform: translateY(30px);
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .product-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    border-color: rgba(120, 119, 198, 0.5);
                }

                .product-image {
                    position: relative;
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .product-card:hover .product-image img {
                    transform: scale(1.1);
                }

                .product-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .product-card:hover .product-overlay {
                    opacity: 1;
                }

                .add-to-cart-btn,
                .quick-view-btn {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    transform: translateY(20px);
                }

                .product-card:hover .add-to-cart-btn,
                .product-card:hover .quick-view-btn {
                    transform: translateY(0);
                }

                .add-to-cart-btn:hover,
                .quick-view-btn:hover {
                    transform: scale(1.1);
                }

                .cart-indicator {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: linear-gradient(135deg, #ff4757, #ff3742);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                }

                .product-info {
                    padding: 25px;
                }

                .product-name {
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-description {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    margin-bottom: 15px;
                    line-height: 1.5;
                }

                .product-rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 15px;
                }

                .star {
                    color: #ffd700;
                    fill: #ffd700;
                }

                .product-rating span {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    margin-left: 5px;
                }

                .product-price {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .current-price {
                    color: #77dbe2;
                    font-size: 24px;
                    font-weight: 900;
                }

                .original-price {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 18px;
                    text-decoration: line-through;
                }

                /* Loading and Error States */
                .loading-state,
                .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid #7877c6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-state p,
                .error-state p {
                    color: white;
                    font-size: 18px;
                    margin-bottom: 20px;
                }

                .retry-btn {
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #7877c6, #ff77c6);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .retry-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(120, 119, 198, 0.4);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .hero-content h1 {
                        font-size: 36px;
                    }

                    .controls-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-container {
                        max-width: none;
                    }

                    .control-buttons {
                        justify-content: space-between;
                    }

                    .filters-panel {
                        grid-template-columns: 1fr;
                    }

                    .products-grid.grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }

                    .products-grid.list .product-card {
                        flex-direction: column;
                    }

                    .products-grid.list .product-image {
                        width: 100%;
                        height: 250px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AllProductsPage;