import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const contextData = createContext();

export const Context_provider = ({ children }) => {   
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState('');
    
    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSideBarToggle = () => {
        setSideBarOpen(prev => !prev);
        document.body.classList.toggle('pushmenu-push-toleft');
    };

    const handleSidebarClose = () => {
        setSideBarOpen(false);
        document.body.classList.remove('pushmenu-push-toleft');
    };

    // Show toast notification
    const show_toast = (message, isSuccess = true) => {
        setNotification({ message, isSuccess });
        setTimeout(() => setNotification(''), 3000);
    };

    // Get cart from localStorage
    const getCart = () => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(cart);
            return cart;
        } catch (error) {
            console.error("Error getting cart from localStorage:", error);
            setCartItems([]);
            return [];
        }
    };

    // Update localStorage cart
    const updateLocalStorageCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productExists = cart.some((item) => item?._id === product?._id);

        if (!productExists) {
            const cartItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                productId: product._id
            };
            cart.push(cartItem);
            localStorage.setItem("cart", JSON.stringify(cart));
            setCartItems(cart);
            show_toast("Product added to Cart", true);
            setIsCartOpen(true); // Open cart sidebar
            return { success: true, message: "Product added to cart" };
        } else {
            show_toast("Product is already in your Cart", false);
            return { success: false, message: "Product already in cart" };
        }
    };

    // Add to cart function with localStorage integration
    const addToCart = async (productId, product, quantity = 1) => {
        console.log(product, "product details");
        setLoading(true);
        
        try {
            const token = localStorage.getItem("token"); // Check for token
            
            if (!token) {
                // No token - use localStorage
                const result = updateLocalStorageCart(product);
                setLoading(false);
                return result;
            }

            // If token exists, try API call
            const response = await axios.post(`https://aruvia-backend.onrender.com/api/cart/${productId}`, {
                quantity: quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success === "true" || response.data.success === true) {
                console.log("Product added to cart successfully");
                
                // Fetch updated cart data from API
                await fetchCartItems();
                
                // Show cart after adding item
                setIsCartOpen(true);
                show_toast("Product added to cart successfully", true);
                
                return { success: true, message: "Product added to cart" };
            } else {
                show_toast("Product is already in your Cart", false);
                return { success: false, message: response.data.message || "Failed to add product" };
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            
            // If API fails, fallback to localStorage
            const result = updateLocalStorageCart(product);
            show_toast("Added to local cart (offline mode)", true);
            return result;
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart items from API (for logged-in users)
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                // No token - get from localStorage
                getCart();
                return;
            }

            const response = await axios.get(`https://aruvia-backend.onrender.com/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success === "true" || response.data.success === true) {
                setCartItems(response.data.data || response.data.cartItems || []);
            } else {
                console.error("Failed to fetch cart items:", response.data.message);
                // Fallback to localStorage
                getCart();
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            // Fallback to localStorage
            getCart();
        }
    };

    // Remove from cart
    const removeFromCart = async (productId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                // Remove from localStorage
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const updatedCart = cart.filter(item => item._id !== productId && item.productId !== productId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                setCartItems(updatedCart);
                show_toast("Item removed from cart", true);
                return { success: true, message: "Item removed from cart" };
            }

            // API call for logged-in users
            const response = await axios.delete(`https://aruvia-backend.onrender.com/api/cart/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success === "true" || response.data.success === true) {
                await fetchCartItems(); // Refresh cart items
                show_toast("Item removed from cart", true);
                return { success: true, message: "Item removed from cart" };
            } else {
                return { 
                    success: false, 
                    message: response.data.message || "Failed to remove item" 
                };
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
            
            // Fallback to localStorage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = cart.filter(item => item._id !== productId && item.productId !== productId);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            show_toast("Item removed from cart", true);
            
            return { 
                success: true, 
                message: "Item removed from cart (offline mode)" 
            };
        } finally {
            setLoading(false);
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            return await removeFromCart(productId);
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                // Update localStorage
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const updatedCart = cart.map(item => 
                    (item._id === productId || item.productId === productId) 
                        ? { ...item, quantity: quantity }
                        : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                setCartItems(updatedCart);
                show_toast("Cart updated successfully", true);
                return { success: true, message: "Cart updated successfully" };
            }

            const response = await axios.put(`https://aruvia-backend.onrender.com/api/cart/${productId}`, {
                quantity: quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success === "true" || response.data.success === true) {
                await fetchCartItems(); // Refresh cart items
                show_toast("Cart updated successfully", true);
                return { success: true, message: "Cart updated successfully" };
            } else {
                return { 
                    success: false, 
                    message: response.data.message || "Failed to update cart" 
                };
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            
            // Fallback to localStorage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = cart.map(item => 
                (item._id === productId || item.productId === productId) 
                    ? { ...item, quantity: quantity }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            show_toast("Cart updated successfully (offline mode)", true);
            
            return { 
                success: true, 
                message: "Cart updated successfully" 
            };
        } finally {
            setLoading(false);
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                // Clear localStorage
                localStorage.removeItem("cart");
                setCartItems([]);
                show_toast("Cart cleared successfully", true);
                return { success: true, message: "Cart cleared successfully" };
            }

            const response = await axios.delete(`https://aruvia-backend.onrender.com/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success === "true" || response.data.success === true) {
                setCartItems([]);
                localStorage.removeItem("cart"); // Also clear localStorage
                show_toast("Cart cleared successfully", true);
                return { success: true, message: "Cart cleared successfully" };
            } else {
                return { 
                    success: false, 
                    message: response.data.message || "Failed to clear cart" 
                };
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
            
            // Fallback to localStorage
            localStorage.removeItem("cart");
            setCartItems([]);
            show_toast("Cart cleared successfully", true);
            
            return { 
                success: true, 
                message: "Cart cleared successfully" 
            };
        } finally {
            setLoading(false);
        }
    };

    // Get cart total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    // Get cart item count
    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Load cart items on component mount
    useEffect(() => {
        getCart();
    }, []);

    return (
        <contextData.Provider value={{ 
            isCartOpen,
            setIsCartOpen,
            sideBarOpen,
            setSideBarOpen,
            cartItems,
            setCartItems,
            loading,
            notification,
            handleSideBarToggle,
            handleSidebarClose,
            handleCartToggle,
            addToCart,
            fetchCartItems,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            getCartTotal,
            getCartItemCount,
            getCart,
            show_toast,
            capitalizeFirstLetter
        }}>
            {children}
        </contextData.Provider>
    );
};