import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { contextData } from '../services/Context';
import { show_toast } from '../utils/Toast';
import { useNavigate } from 'react-router-dom';
import SEO from '../services/SEO';
import { ShoppingBag, CreditCard, Truck, Shield, CheckCircle, AlertCircle, Lock, Sparkles, Crown, Star } from 'lucide-react';

const CheckOutPage = () => {
    const navigate = useNavigate();
  const { 
    cartItems, 
    getCartTotal, 
    getCartItemCount,
    updateCartItemQuantity,
    removeFromCart,
    clearCart 
  } = useContext(contextData);

  // Form state for checkout
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India', // Default to India for Indian e-commerce
    postcode: '',
    landmark: '',
    orderNote: ''
  });

  const [shippingOption, setShippingOption] = useState('flat'); // flat, free, local
  const [paymentMethod, setPaymentMethod] = useState('bank'); // bank, check, cod
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (Indian format)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Validate postal code (Indian format)
  const validatePostcode = (postcode) => {
    const postcodeRegex = /^[1-9][0-9]{5}$/;
    return postcodeRegex.test(postcode);
  };

  // Handle form input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for specific fields
    if (name === 'email' && value && !validateEmail(value)) {
      setFormErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    }

    if (name === 'phone' && value && !validatePhone(value)) {
      setFormErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid 10-digit phone number'
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'country','landmark'];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Specific validations
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.postcode && formData.postcode.trim() && !validatePostcode(formData.postcode)) {
      errors.postcode = 'Please enter a valid 6-digit postal code';
    }

    return errors;
  };

  // Calculate shipping cost
  const getShippingCost = () => {
    switch (shippingOption) {
     
      default: return 50;
    }
  };

  // Calculate final total
  const getFinalTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  // Fixed handleRazorpayPayment function
// Updated handleRazorpayPayment function for webhook-based verification

const handleRazorpayPayment = async (orderData, razorpayOrderId) => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    show_toast('Razorpay SDK failed to load. Please check your internet connection.', false);
    setOrderLoading(false);
    return;
  }

  const options = {
    key: 'rzp_live_iFvbsicduHI4Lb',
    amount: Math.round(getFinalTotal() * 100),
    currency: 'INR',
    name: 'Aruvia',
    description: 'Order Payment',
    order_id: razorpayOrderId,
    handler: async function (response) {
      console.log('Razorpay Payment Response:', response);
      
      // Payment completed - webhook will handle verification
      // Just show success message and redirect
      setOrderSuccess(true);
      setOrderError('');
      await clearCart();
      show_toast('Payment successful! Processing your order...', true);
      setOrderLoading(false);
      
      // Redirect to order confirmation page
      // Your webhook will update the order status in the background
      setTimeout(() => {
            navigate('/order-confirmation');
          }, 2000);
    },
    prefill: {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact: formData.phone
    },
    notes: {
      address: `${formData.street}, ${formData.city}, ${formData.state}`,
      landmark: formData.landmark,
      orderNote: formData.orderNote
    },
    theme: {
      color: '#f33'
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed by user');
        setOrderLoading(false);
        show_toast('Payment cancelled', false);
      },
      // Handle payment errors
      onerror: function(error) {
        console.error('Payment error:', error);
        setOrderLoading(false);
        setOrderError('Payment failed. Please try again.');
        show_toast('Payment failed. Please try again.', false);
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  
  // Handle payment failure
  razorpay.on('payment.failed', function (response) {
    console.error('Payment failed:', response.error);
    setOrderLoading(false);
    setOrderError(`Payment failed: ${response.error.description}`);
    show_toast(`Payment failed: ${response.error.description}`, false);
  });

  razorpay.open();
};

  // Handle form submission
 const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  // Validate form
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    
    // REMOVED: show_toast(firstError, false);
    // Let the inline error messages handle field validation display
    
    // Optional: Scroll to first error field for better UX
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.focus();
    }
    
    return;
  }

  if (cartItems.length === 0) {
    show_toast('Your cart is empty. Please add items before checkout.', false);
    return;
  }

  setOrderLoading(true);
  setOrderError('');
  setFormErrors({});
  
  try {
    const token = localStorage.getItem("token");
    
    // Prepare products array for API
    const products = cartItems.map(item => ({
      productId: item._id || item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name
    }));

    // Prepare order data for API
    const orderData = {
      products: products,
      totalAmount: getFinalTotal(),
      subtotal: getCartTotal(),
      shippingCost: getShippingCost(),
      address: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postcode,
        country: formData.country,
        landmark: formData.landmark
      },
      shippingMethod: shippingOption,
      paymentMethod: paymentMethod,
      orderNote: formData.orderNote
    };

    console.log('Sending order data:', orderData);

    // Make API call
    const response = await axios.post(
      'https://aruvia-backend-rho.vercel.app/api/order/createorder',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      }
    );

    console.log('Order response:', response.data);

    if (response.data.success === "true" || response.data.success === true) {
      // Check if payment method requires online payment
      if (paymentMethod === 'bank' && response.data.razorpayOrderId) {
        // Redirect to Razorpay for online payment
        await handleRazorpayPayment(response.data.order, response.data.razorpayOrderId);
      } else {
        // For COD or other payment methods
        setOrderSuccess(true);
        setOrderError('');
        await clearCart();
        show_toast('Order placed successfully! Thank you for your purchase.', true);
        setOrderLoading(false);
        
        // Optional: Redirect to order confirmation page after delay
       setTimeout(() => {
            navigate('/order-confirmation');
          }, 2000);
      }
    } else {
      throw new Error(response.data.message || 'Failed to place order');
    }

  } catch (error) {
    console.error('Error placing order:', error);
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to place order. Please try again.';
    
    setOrderError(errorMessage);
    show_toast(`Error: ${errorMessage}`, false);
    setOrderLoading(false);
  }
};

  // Helper function to get input class with error styling
  const getInputClass = (fieldName, baseClass = '') => {
    return `${baseClass} ${formErrors[fieldName] ? 'error-input' : ''}`.trim();
  };

  return (
    <div className="modern-checkout-page">
      <SEO
        title="Checkout - Aruvia Herbals"
        description="Complete your purchase securely at Aruvia Herbals. Fast delivery and secure payment options available."
        url="https://aruviaherbals.com/checkout"
      />

      {/* Modern Hero Section */}
      <section className="checkout-hero">
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
            <ShoppingBag size={48} />
          </div>
          <h1>Secure Checkout</h1>
          <p>Complete your order with confidence</p>
        </div>
      </section>

      <div className="checkout-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart-modern">
            <div className="empty-icon">
              <ShoppingBag size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some amazing products to get started</p>
            <button 
              onClick={() => navigate('/products')}
              className="shop-now-btn-modern"
            >
              <Sparkles size={20} />
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="checkout-grid">
            {/* Left Column - Order Form */}
            <div className="checkout-form-section">
              <div className="form-card-modern">
                <div className="form-header-modern">
                  <div className="step-indicator">
                    <div className="step active">
                      <div className="step-number">1</div>
                      <span>Details</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <span>Payment</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="modern-form">
                  {/* Personal Information */}
                  <div className="form-section-modern">
                    <h3 className="section-title-modern">
                      <Crown size={24} />
                      Personal Information
                    </h3>
                    
                    <div className="form-grid">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          First Name <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name" 
                          required 
                          className={`form-input-modern ${formErrors.firstName ? 'error' : ''}`}
                        />
                        {formErrors.firstName && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.firstName}
                          </span>
                        )}
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          Last Name <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name" 
                          required 
                          className={`form-input-modern ${formErrors.lastName ? 'error' : ''}`}
                        />
                        {formErrors.lastName && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.lastName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          Email Address <span className="required">*</span>
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required 
                          className={`form-input-modern ${formErrors.email ? 'error' : ''}`}
                        />
                        {formErrors.email && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.email}
                          </span>
                        )}
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          Phone Number <span className="required">*</span>
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit phone number"
                          required 
                          maxLength="10"
                          className={`form-input-modern ${formErrors.phone ? 'error' : ''}`}
                        />
                        {formErrors.phone && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="form-section-modern">
                    <h3 className="section-title-modern">
                      <Truck size={24} />
                      Shipping Address
                    </h3>
                    
                    <div className="form-group-modern full-width">
                      <label className="form-label-modern">
                        Street Address <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                        required 
                        className={`form-input-modern ${formErrors.street ? 'error' : ''}`}
                      />
                      {formErrors.street && (
                        <span className="error-message-modern">
                          <AlertCircle size={16} />
                          {formErrors.street}
                        </span>
                      )}
                    </div>

                    <div className="form-grid">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          City <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          required 
                          className={`form-input-modern ${formErrors.city ? 'error' : ''}`}
                        />
                        {formErrors.city && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.city}
                          </span>
                        )}
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          State <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter state"
                          required 
                          className={`form-input-modern ${formErrors.state ? 'error' : ''}`}
                        />
                        {formErrors.state && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.state}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          Postal Code
                        </label>
                        <input 
                          type="text" 
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="6-digit postal code"
                          maxLength="6"
                          className={`form-input-modern ${formErrors.postcode ? 'error' : ''}`}
                        />
                        {formErrors.postcode && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.postcode}
                          </span>
                        )}
                      </div>

                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          Landmark <span className="required">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Enter landmark"
                          className={`form-input-modern ${formErrors.landmark ? 'error' : ''}`}
                        />
                        {formErrors.landmark && (
                          <span className="error-message-modern">
                            <AlertCircle size={16} />
                            {formErrors.landmark}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group-modern full-width">
                      <label className="form-label-modern">
                        Country <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                        required 
                        className={`form-input-modern ${formErrors.country ? 'error' : ''}`}
                      />
                      {formErrors.country && (
                        <span className="error-message-modern">
                          <AlertCircle size={16} />
                          {formErrors.country}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="form-section-modern">
                    <h3 className="section-title-modern">
                      <Star size={24} />
                      Additional Information
                    </h3>
                    
                    <div className="form-group-modern full-width">
                      <label className="form-label-modern">
                        Order Notes (Optional)
                      </label>
                      <textarea 
                        name="orderNote" 
                        value={formData.orderNote}
                        onChange={handleInputChange}
                        placeholder="Special instructions for your order..."
                        className="form-textarea-modern"
                        rows="4"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="order-summary-section">
              <div className="summary-card-modern">
                <div className="summary-header-modern">
                  <h2>Order Summary</h2>
                  <span className="item-count">({getCartItemCount()} items)</span>
                </div>

                {/* Cart Items */}
                <div className="cart-items-summary">
                  {cartItems.map((item) => (
                    <div key={item._id || item.productId} className="cart-item-summary">
                      <div className="item-image-summary">
                        <img 
                          src={item.image || "/assets/img/home9/product1.png"} 
                          alt={item.name}
                        />
                        <div className="item-quantity">{item.quantity}</div>
                      </div>
                      <div className="item-details-summary">
                        <h4>{item.name}</h4>
                        <div className="item-price">₹{item.price} × {item.quantity}</div>
                      </div>
                      <div className="item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Options */}
                <div className="shipping-section-modern">
                  <h3>
                    <Truck size={20} />
                    Shipping
                  </h3>
                  <div className="shipping-option-modern selected">
                    <div className="shipping-info">
                      <div className="shipping-name">Standard Delivery</div>
                      <div className="shipping-time">3-5 business days</div>
                    </div>
                    <div className="shipping-price">₹50.00</div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="payment-section-modern">
                  <h3>
                    <CreditCard size={20} />
                    Payment Method
                  </h3>
                  
                  <div className="payment-options-modern">
                    <label className="payment-option-modern">
                      <input 
                        type="radio" 
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <div className="payment-icon">
                          <Lock size={20} />
                        </div>
                        <div className="payment-info">
                          <div className="payment-name">Online Payment</div>
                          <div className="payment-desc">Secure payment via Razorpay</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Total */}
                <div className="order-total-modern">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>₹{getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="total-row final-total">
                    <span>Total:</span>
                    <span>₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {orderError && (
                  <div className="message-modern error">
                    <AlertCircle size={20} />
                    <span>{orderError}</span>
                  </div>
                )}
                
                {orderSuccess && (
                  <div className="message-modern success">
                    <CheckCircle size={20} />
                    <span>Order placed successfully! Thank you for your purchase.</span>
                  </div>
                )}

                {/* Place Order Button */}
                <button 
                  className="place-order-btn-modern"
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0 || orderLoading || orderSuccess}
                >
                  <div className="btn-content">
                    {orderLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>
                          {paymentMethod === 'bank' ? 'Redirecting to Payment...' : 'Placing Order...'}
                        </span>
                      </>
                    ) : orderSuccess ? (
                      <>
                        <CheckCircle size={20} />
                        <span>Order Placed!</span>
                      </>
                    ) : (
                      <>
                        <Shield size={20} />
                        <span>
                          {paymentMethod === 'bank' ? 'Proceed to Payment' : 'Place Order'}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="btn-shine"></div>
                </button>

                {/* Security Badge */}
                <div className="security-badge-modern">
                  <Shield size={16} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modern-checkout-page {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
          color: white;
          padding-top: 80px;
        }

        /* Hero Section */
        .checkout-hero {
          position: relative;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 60px;
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

        /* Main Container */
        .checkout-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        /* Empty Cart State */
        .empty-cart-modern {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, rgba(120, 119, 198, 0.2), rgba(255, 119, 198, 0.2));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          color: #7877c6;
        }

        .empty-cart-modern h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 15px;
          color: white;
        }

        .empty-cart-modern p {
          font-size: 18px;
          opacity: 0.7;
          margin-bottom: 30px;
        }

        .shop-now-btn-modern {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: linear-gradient(135deg, #7877c6, #ff77c6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .shop-now-btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(120, 119, 198, 0.4);
        }

        /* Checkout Grid */
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          align-items: start;
        }

        /* Form Section */
        .checkout-form-section {
          width: 100%;
        }

        .form-card-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
        }

        .form-header-modern {
          margin-bottom: 30px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0.5;
        }

        .step.active {
          opacity: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #7877c6, #ff77c6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #7877c6, #ff77c6);
          opacity: 0.3;
        }

        /* Form Sections */
        .form-section-modern {
          margin-bottom: 40px;
        }

        .section-title-modern {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 25px;
          color: white;
        }

        .section-title-modern svg {
          color: #7877c6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group-modern {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group-modern.full-width {
          grid-column: 1 / -1;
        }

        .form-label-modern {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .required {
          color: #ff4757;
        }

        .form-input-modern,
        .form-textarea-modern {
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-input-modern:focus,
        .form-textarea-modern:focus {
          outline: none;
          border-color: #7877c6;
          box-shadow: 0 0 20px rgba(120, 119, 198, 0.3);
        }

        .form-input-modern::placeholder,
        .form-textarea-modern::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-input-modern.error {
          border-color: #ff4757;
          box-shadow: 0 0 20px rgba(255, 71, 87, 0.3);
        }

        .error-message-modern {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ff4757;
          font-size: 12px;
          margin-top: 5px;
        }

        /* Order Summary Section */
        .order-summary-section {
          position: sticky;
          top: 100px;
        }

        .summary-card-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
        }

        .summary-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summary-header-modern h2 {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .item-count {
          color: #7877c6;
          font-weight: 600;
        }

        /* Cart Items Summary */
        .cart-items-summary {
          margin-bottom: 25px;
        }

        .cart-item-summary {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cart-item-summary:last-child {
          border-bottom: none;
        }

        .item-image-summary {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
        }

        .item-image-summary img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-quantity {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .item-details-summary {
          flex: 1;
        }

        .item-details-summary h4 {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 5px;
        }

        .item-price {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .item-total {
          font-size: 16px;
          font-weight: 700;
          color: #77dbe2;
        }

        /* Shipping Section */
        .shipping-section-modern {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .shipping-section-modern h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: white;
        }

        .shipping-option-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .shipping-option-modern.selected {
          border-color: #7877c6;
          background: rgba(120, 119, 198, 0.1);
        }

        .shipping-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .shipping-name {
          font-weight: 600;
          color: white;
        }

        .shipping-time {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .shipping-price {
          font-weight: 700;
          color: #77dbe2;
        }

        /* Payment Section */
        .payment-section-modern {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .payment-section-modern h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: white;
        }

        .payment-options-modern {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .payment-option-modern {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-option-modern:hover {
          border-color: #7877c6;
          background: rgba(120, 119, 198, 0.1);
        }

        .payment-option-modern input[type="radio"] {
          accent-color: #7877c6;
        }

        .payment-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #7877c6, #ff77c6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .payment-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .payment-name {
          font-weight: 600;
          color: white;
        }

        .payment-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Order Total */
        .order-total-modern {
          margin-bottom: 25px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 16px;
        }

        .total-row span:first-child {
          color: rgba(255, 255, 255, 0.8);
        }

        .total-row span:last-child {
          font-weight: 600;
          color: white;
        }

        .total-row.final-total {
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          padding-top: 15px;
          margin-top: 10px;
          font-size: 20px;
          font-weight: 700;
        }

        .total-row.final-total span:last-child {
          color: #77dbe2;
        }

        /* Messages */
        .message-modern {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .message-modern.error {
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.3);
          color: #ff4757;
        }

        .message-modern.success {
          background: rgba(46, 213, 115, 0.1);
          border: 1px solid rgba(46, 213, 115, 0.3);
          color: #2ed573;
        }

        /* Place Order Button */
        .place-order-btn-modern {
          position: relative;
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #7877c6, #ff77c6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .place-order-btn-modern:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(120, 119, 198, 0.4);
        }

        .place-order-btn-modern:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Security Badge */
        .security-badge-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(46, 213, 115, 0.1);
          border: 1px solid rgba(46, 213, 115, 0.3);
          border-radius: 8px;
          color: #2ed573;
          font-size: 14px;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .order-summary-section {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .checkout-container {
            padding: 0 15px 40px;
          }

          .hero-content h1 {
            font-size: 36px;
          }

          .form-card-modern,
          .summary-card-modern {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .step-indicator {
            flex-direction: column;
            gap: 15px;
          }

          .step-line {
            width: 2px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 28px;
          }

          .section-title-modern {
            font-size: 20px;
          }

          .form-card-modern,
          .summary-card-modern {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckOutPage;