import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { contextData } from '../services/Context';
import WhatsappChat from '../utils/WhatsappChat';
import axios from 'axios';
import SEO from '../services/SEO';
import { extractIdFromSlug, createUniqueSlug } from '../utils/slugHelper';

const ProductPage = () => {
    const { slug } = useParams(); // Changed from 'id' to 'slug'
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    const { 
        addToCart, 
        notification,
        cartItems,
        getCartItemCount 
    } = useContext(contextData);

    useEffect(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }, []);

    // Get product from location state if available, otherwise fetch from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                // If product data is passed via navigation state, use it
                if (location.state?.product) {
                    // Verify the slug matches the product
                    const expectedSlug = createUniqueSlug(location.state.product.name, location.state.product._id);
                    if (slug === expectedSlug) {
                        setProduct(location.state.product);
                        setLoading(false);
                        return;
                    }
                }

                // Extract product ID from slug
                const productId = extractIdFromSlug(slug);
                
                if (!productId) {
                    throw new Error('Invalid product URL');
                }

                // Try to fetch the specific product
                try {
                    const response = await axios.get(`https://aruvia-backend-rho.vercel.app/api/products/${productId}`);
                    
                    if (response.data && response.data.success === "true" && response.data.data) {
                        const fetchedProduct = response.data.data;
                        
                        // Verify the slug matches
                        const expectedSlug = createUniqueSlug(fetchedProduct.name, fetchedProduct._id);
                        if (slug !== expectedSlug) {
                            // Redirect to correct slug
                            navigate(`/product/${expectedSlug}`, { replace: true, state: { product: fetchedProduct } });
                            return;
                        }
                        
                        setProduct(fetchedProduct);
                    } else {
                        throw new Error('Product not found');
                    }
                } catch (singleProductError) {
                    // If single product API doesn't work, fetch all products and find the one we need
                    console.log('Trying to fetch from all products...');
                    const allProductsResponse = await axios.get('https://aruvia-backend-rho.vercel.app/api/products');
                    
                    if (allProductsResponse.data && allProductsResponse.data.success === "true" && allProductsResponse.data.data) {
                        // First try to match by ID
                        let foundProduct = allProductsResponse.data.data.find(p => p._id === productId);
                        
                        // If not found by ID, try to match by slug
                        if (!foundProduct) {
                            foundProduct = allProductsResponse.data.data.find(p => {
                                const productSlug = createUniqueSlug(p.name, p._id);
                                return productSlug === slug;
                            });
                        }
                        
                        if (foundProduct) {
                            // Verify and redirect if slug doesn't match exactly
                            const expectedSlug = createUniqueSlug(foundProduct.name, foundProduct._id);
                            if (slug !== expectedSlug) {
                                navigate(`/product/${expectedSlug}`, { replace: true, state: { product: foundProduct } });
                                return;
                            }
                            
                            setProduct(foundProduct);
                        } else {
                            throw new Error('Product not found');
                        }
                    } else {
                        throw new Error('Failed to fetch product');
                    }
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug, location.state, navigate]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Get current cart quantity for this product
    const getCurrentCartQuantity = () => {
        if (!product) return 0;
        const cartItem = cartItems.find(item => item._id === product._id || item.productId === product._id);
        return cartItem ? cartItem.quantity : 0;
    };

    // Handle quantity change
    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            const result = await addToCart(product._id, product, quantity);
            if (result.success) {
                console.log(`${product.name} added to cart successfully!`);
            } else {
                console.log("Failed to add product:", result.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle buy now (add to cart and navigate to cart)
    const handleBuyNow = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            const result = await addToCart(product._id, product, quantity);
            if (result.success) {
                console.log("success")
                //navigate('/cart');
            } else {
                console.log("Failed to add product:", result.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div style={{ 
                    display: 'inline-block', 
                    width: '50px', 
                    height: '50px', 
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #333',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>Loading product...</p>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div style={{ color: '#dc3545', fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>Product Not Found</h2>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
                    {error || 'The product you are looking for does not exist.'}
                </p>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Mock additional images (you can replace with actual product images if available)
    const productImages = [
        product.image,
    ];

    return (
        <div className="product-page">
             {product && (
        <SEO
          title={product.name}
          description={`Buy ${product.name} - ${product.description}. Premium quality herbal products at Aruvia Herbals.`}
          keywords={`${product.name}, herbal products, ${product.category}, organic herbs`}
          image={product.image}
          url={`https://aruviaherbals.com/product/${slug}`}
          type="product"
        />
      )}
            {/* Breadcrumb */}
            <div className="container" style={{ paddingTop: '20px' }}>
                <nav aria-label="breadcrumb">
                    <ol style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <li>
                            <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                                style={{ color: '#007bff', textDecoration: 'none' }}
                            >
                                Home
                            </a>
                        </li>
                        <li style={{ margin: '0 8px' }}>/</li>
                        <li style={{ color: '#333' }}>{product.name}</li>
                    </ol>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="container" style={{ padding: '20px 0 50px' }}>
                <div className="row">
                    {/* Product Images */}
                    <div className="col-md-6">
                        <div className="product-images">
                            {/* Main Image */}
                            <div className="main-image" style={{ marginBottom: '15px' }}>
                                <img 
                                    src={productImages[selectedImage]} 
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </div>
                            
                            {/* Thumbnail Images */}
                            <div className="thumbnail-images" style={{ display: 'flex', gap: '10px' }}>
                                {productImages.map((image, index) => (
                                    <img 
                                        key={index}
                                        src={image} 
                                        alt={`${product.name} ${index + 1}`}
                                        onClick={() => setSelectedImage(index)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #007bff' : '2px solid #e0e0e0',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="col-md-6">
                        <div className="product-details" style={{ paddingLeft: '30px' }}>
                            <h1 style={{ 
                                fontSize: '32px', 
                                fontWeight: '600', 
                                marginBottom: '15px',
                                color: '#333'
                            }}>
                                {product.name}
                            </h1>

                            <div className="" style={{ 
                                fontSize: '28px', 
                                fontWeight: 'bold', 
                                color: '#007bff',
                                marginBottom: '20px'
                            }}>
                                ₹{product.price}
                            </div>

                            <div className="product-meta" style={{ marginBottom: '30px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    marginBottom: '10px',
                                    fontSize: '16px'
                                }}>
                                    <span style={{ fontWeight: '600', marginRight: '10px' }}>Availability:</span>
                                    <span style={{ 
                                        color: '#28a745',
                                        fontWeight: '500'
                                    }}>
                                        ✓ In Stock
                                    </span>
                                </div>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    marginBottom: '10px',
                                    fontSize: '16px'
                                }}>
                                    <span style={{ fontWeight: '600', marginRight: '10px' }}>SKU:</span>
                                    <span style={{ color: '#666' }}>{product._id?.slice(-8)}</span>
                                </div>

                                {getCurrentCartQuantity() > 0 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '10px',
                                        fontSize: '16px'
                                    }}>
                                        <span style={{ fontWeight: '600', marginRight: '10px' }}>In Cart:</span>
                                        <span style={{ 
                                            color: '#dc3545',
                                            fontWeight: '500'
                                        }}>
                                            {getCurrentCartQuantity()} items
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="description" style={{ 
                                marginBottom: '30px',
                                padding: '20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                lineHeight: '1.6'
                            }}>
                                <h4 style={{ marginBottom: '10px', fontSize: '18px' }}>Product Description</h4>
                                <p style={{ color: '#666', margin: 0 }}>
                                    {product.description || `Discover the premium quality of ${product.name}. This carefully crafted product combines functionality with style, making it perfect for your needs. Made with high-quality materials and attention to detail.`}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="quantity-section" style={{ marginBottom: '30px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    fontSize: '16px'
                                }}>
                                    Quantity:
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div className="quantity-controls" style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '6px',
                                        overflow: 'hidden'
                                    }}>
                                        <button 
                                            onClick={() => handleQuantityChange(-1)}
                                            style={{
                                                background: '#f8f9fa',
                                                border: 'none',
                                                padding: '12px 16px',
                                                cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                                                fontSize: '18px',
                                                color: quantity > 1 ? '#333' : '#999'
                                            }}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span style={{ 
                                            padding: '12px 20px',
                                            minWidth: '60px',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            fontSize: '16px'
                                        }}>
                                            {quantity}
                                        </span>
                                        <button 
                                            onClick={() => handleQuantityChange(1)}
                                            style={{
                                                background: '#f8f9fa',
                                                border: 'none',
                                                padding: '12px 16px',
                                                cursor: quantity < 10 ? 'pointer' : 'not-allowed',
                                                fontSize: '18px',
                                                color: quantity < 10 ? '#333' : '#999'
                                            }}
                                            disabled={quantity >= 10}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span style={{ color: '#666', fontSize: '14px' }}>
                                        (Max: 10 items)
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '15px 30px',
                                        borderRadius: '6px',
                                        cursor: addingToCart ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        minWidth: '160px',
                                        opacity: addingToCart ? 0.7 : 1,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                                </button>
                                
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={addingToCart}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '15px 30px',
                                        borderRadius: '6px',
                                        cursor: addingToCart ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        minWidth: '160px',
                                        opacity: addingToCart ? 0.7 : 1,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {addingToCart ? 'Processing...' : '⚡ Buy Now'}
                                </button>
                            </div>

                            {/* Product Features */}
                            <div className="product-features" style={{ 
                                marginTop: '40px',
                                padding: '20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                backgroundColor: '#fff'
                            }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '18px' }}>Why Choose This Product?</h4>
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: 0, 
                                    margin: 0,
                                    lineHeight: '1.8'
                                }}>
                                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: '#28a745', marginRight: '10px', fontSize: '18px' }}>✓</span>
                                        Premium Quality Materials
                                    </li>
                                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: '#28a745', marginRight: '10px', fontSize: '18px' }}>✓</span>
                                        Fast & Secure Delivery
                                    </li>
                                    
                                    <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: '#28a745', marginRight: '10px', fontSize: '18px' }}>✓</span>
                                        24/7 Customer Support
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information Tabs */}
            <div className="container" style={{ paddingBottom: '50px' }}>
                <div className="product-tabs" style={{ 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <div className="tab-header" style={{ 
                        backgroundColor: '#f8f9fa',
                        padding: '15px 20px',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '18px' }}>Product Information</h4>
                    </div>
                    <div className="tab-content" style={{ padding: '20px' }}>
                        <div className="info-grid" style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            <div>
                                <h5 style={{ marginBottom: '10px', color: '#333' }}>Specifications</h5>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#666' }}>
                                    
                                    <li style={{ marginBottom: '5px' }}>
                                        <strong>Category:</strong> {product.category || 'General'}
                                    </li>
                                    <li style={{ marginBottom: '5px' }}>
                                        <strong>Brand:</strong> Aruvia
                                    </li>
                                    
                                </ul>
                            </div>
                            <div>
                                <h5 style={{ marginBottom: '10px', color: '#333' }}>Shipping & Returns</h5>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#666' }}>
                                    <li style={{ marginBottom: '5px' }}>
                                        <strong>Delivery:</strong> 3-7 Business Days
                                    </li>
                                    <li style={{ marginBottom: '5px' }}>
                                        <strong>Shipping:</strong> Free above ₹100
                                    </li>
                                   
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp Chat */}
            <WhatsappChat />

            {/* Toast Notification */}
            {notification && (
                <div 
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: notification.isSuccess ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '15px 20px',
                        borderRadius: '8px',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '16px'
                    }}
                >
                    {notification.message}
                </div>
            )}

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .product-details {
                        padding-left: 15px !important;
                        margin-top: 30px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .action-buttons button {
                        width: 100%;
                        margin-bottom: 10px;
                    }
                    
                    .thumbnail-images {
                        justify-content: center;
                    }
                    
                    .main-image img {
                        max-width: 100% !important;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .product-details h1 {
                        font-size: 24px !important;
                    }
                    
                    .price {
                        font-size: 24px !important;
                    }
                    
                    .container {
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductPage;