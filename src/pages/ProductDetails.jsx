import React, { useState, useContext } from 'react';
import { contextData } from '../services/Context';
import { Link } from 'react-router-dom';

const ProductDetails = ({ product, isOpen, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const { 
        addToCart, 
        notification,
        getCartItemCount,
        cartItems 
    } = useContext(contextData);

    // Get item count for this product
    const getProductCartCount = (productId) => {
        const item = cartItems.find(item => item._id === productId || item.productId === productId);
        return item ? item.quantity : 0;
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        
        if (!product) return;
        
        setLoading(true);
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
            setLoading(false);
        }
    };

    // Handle quantity change
    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    // Mock additional images - you can replace with actual product images array
    const productImages = [
        product.image,
       
    ];

    return (
        <div className="product-modal-backdrop" onClick={handleBackdropClick}>
            <div className="product-modal-container">
                <div className="product-modal-content">
                    {/* Close Button */}
                    <button 
                        className="product-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>

                    <div className="product-modal-body">
                        {/* Left Side - Images */}
                        <div className="product-images-section">
                            <div className="main-image">
                                <img 
                                    src={productImages[selectedImage]} 
                                    alt={product.name}
                                    className="main-product-image"
                                />
                                {getProductCartCount(product._id) > 0 && (
                                    <div className="cart-badge">
                                        {getProductCartCount(product._id)} in cart
                                    </div>
                                )}
                            </div>
                            
                            <div className="thumbnail-images">
                                {productImages.map((image, index) => (
                                    <img 
                                        key={index}
                                        src={image} 
                                        alt={`${product.name} view ${index + 1}`}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Product Info */}
                        <div className="product-info-section">
                            <div className="product-header">
                                <h1 className="product-name">{product.name}</h1>
                                <div className="product-price">
                                    <span className="current-price">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="original-price">₹{product.originalPrice}</span>
                                    )}
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className="product-description">
                                <p>{product.description || "Premium quality product crafted with care. Experience the perfect blend of style and functionality."}</p>
                            </div>

                            {/* Product Features */}
                            <div className="product-features">
                                <h4>Features:</h4>
                                <ul>
                                    <li>High-quality materials</li>
                                    <li>Durable construction</li>
                                    <li>Modern design</li>
                                    <li>Easy to use</li>
                                </ul>
                            </div>

                            {/* Quantity Selector */}
                            <div className="quantity-section">
                                <label htmlFor="quantity">Quantity:</label>
                                <div className="quantity-controls">
                                    <button 
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1) setQuantity(value);
                                        }}
                                        min="1"
                                        className="quantity-input"
                                    />
                                    <button 
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="product-actions">
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : `Add to Cart (₹${product.price * quantity})`}
                                </button>
                                
                                <button className="buy-now-btn">
                                   <Link className='buy-now-btn' to="/checkout">Buy Now</Link>
                            
                                </button>
                                
                            </div>

                            {/* Product Info */}
                            <div className="product-meta">
                                <div className="meta-item">
                                    <strong>SKU:</strong> {product._id.slice(-6).toUpperCase()}
                                </div>
                                <div className="meta-item">
                                    <strong>Category:</strong> {product.category || 'General'}
                                </div>
                                <div className="meta-item">
                                    <strong>Availability:</strong> 
                                    <span className="stock-status">In Stock</span>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="shipping-info">
                                <div className="shipping-item">
                                    🚚 Free shipping on orders 
                                </div>
                                <div className="shipping-item">
                                    📦 2-3 business days delivery
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
                .product-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    padding: 20px;
                    overflow-y: auto;
                }

                .product-modal-container {
                    width: 100%;
                    max-width: 1200px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }

                .product-modal-content {
                    background: white;
                    border-radius: 12px;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                }

                .product-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 30px;
                    cursor: pointer;
                    z-index: 10;
                    color: #666;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .product-modal-close:hover {
                    background-color: #f5f5f5;
                    color: #333;
                }

                .product-modal-body {
                    display: flex;
                    gap: 40px;
                    padding: 30px;
                }

                .product-images-section {
                    flex: 1;
                    min-width: 0;
                }

                .main-image {
                    position: relative;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .main-product-image {
                    width: 100%;
                    height: 400px;
                    object-fit: cover;
                    display: block;
                }

                .cart-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background-color: #28a745;
                    color: white;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .thumbnail-images {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .thumbnail {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 6px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                }

                .thumbnail:hover,
                .thumbnail.active {
                    opacity: 1;
                    border-color: #007bff;
                }

                .product-info-section {
                    flex: 1;
                    min-width: 0;
                }

                .product-header {
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 20px;
                }

                .product-name {
                    font-size: 28px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 15px 0;
                    line-height: 1.3;
                }

                .product-price {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .current-price {
                    font-size: 24px;
                    font-weight: 700;
                    color: #007bff;
                }

                .original-price {
                    font-size: 18px;
                    color: #999;
                    text-decoration: line-through;
                }

                .product-description {
                    margin-bottom: 25px;
                    color: #666;
                    line-height: 1.6;
                    font-size: 16px;
                }

                .product-features {
                    margin-bottom: 25px;
                }

                .product-features h4 {
                    color: #333;
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }

                .product-features ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .product-features li {
                    padding: 5px 0;
                    color: #666;
                    position: relative;
                    padding-left: 20px;
                }

                .product-features li::before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #28a745;
                    font-weight: bold;
                }

                .quantity-section {
                    margin-bottom: 30px;
                }

                .quantity-section label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: 600;
                    color: #333;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    width: fit-content;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .quantity-btn {
                    background-color: #f8f9fa;
                    border: none;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    transition: background-color 0.2s ease;
                }

                .quantity-btn:hover:not(:disabled) {
                    background-color: #e9ecef;
                }

                .quantity-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .quantity-input {
                    border: none;
                    width: 60px;
                    height: 40px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 600;
                    background-color: white;
                    border-left: 1px solid #e0e0e0;
                    border-right: 1px solid #e0e0e0;
                }

                .quantity-input:focus {
                    outline: none;
                }

                .product-actions {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .add-to-cart-btn,
                .buy-now-btn {
                    flex: 1;
                    min-width: 150px;
                    padding: 15px 25px;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .add-to-cart-btn {
                    background-color: #007bff;
                    color: white;
                }

                .add-to-cart-btn:hover:not(:disabled) {
                    background-color: #0056b3;
                    transform: translateY(-1px);
                }

                .add-to-cart-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .buy-now-btn {
                    background-color: #28a745;
                    color: white;
                }

                .buy-now-btn:hover {
                    background-color: #218838;
                    transform: translateY(-1px);
                }

                .product-meta {
                    margin-bottom: 25px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                }

                .meta-item {
                    margin-bottom: 8px;
                    color: #666;
                }

                .meta-item:last-child {
                    margin-bottom: 0;
                }

                .stock-status {
                    color: #28a745;
                    font-weight: 600;
                    margin-left: 5px;
                }

                .shipping-info {
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }

                .shipping-item {
                    margin-bottom: 10px;
                    color: #666;
                    font-size: 14px;
                }

                .shipping-item:last-child {
                    margin-bottom: 0;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .product-modal-backdrop {
                        padding: 10px;
                        align-items: flex-start;
                    }
                    
                    .product-modal-container {
                        max-height: 95vh;
                        margin-top: 20px;
                    }

                    .product-modal-body {
                        flex-direction: column;
                        gap: 25px;
                        padding: 20px;
                    }

                    .main-product-image {
                        height: 300px;
                    }

                    .product-name {
                        font-size: 24px;
                    }

                    .current-price {
                        font-size: 20px;
                    }

                    .product-actions {
                        flex-direction: column;
                    }

                    .add-to-cart-btn,
                    .buy-now-btn {
                        min-width: unset;
                        width: 100%;
                    }

                    .quantity-controls {
                        width: 100%;
                        max-width: 200px;
                    }

                    .quantity-input {
                        flex: 1;
                        width: auto;
                    }
                }

                @media (max-width: 480px) {
                    .product-modal-close {
                        top: 10px;
                        right: 15px;
                        font-size: 24px;
                        width: 35px;
                        height: 35px;
                    }

                    .product-modal-body {
                        padding: 15px;
                    }

                    .product-name {
                        font-size: 20px;
                    }

                    .current-price {
                        font-size: 18px;
                    }

                    .thumbnail {
                        width: 60px;
                        height: 60px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;