import React, { useContext, useState } from 'react';
import axios from 'axios';
import { contextData } from '../services/Context';
import { show_toast } from '../utils/Toast';

const CheckOutPage = () => {
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
      case 'flat': return 50.00; // More realistic shipping cost for India
      case 'local': return 25.00;
      case 'free': 
      default: return 0.00;
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
  const handleRazorpayPayment = async (orderData, razorpayOrderId) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      show_toast('Razorpay SDK failed to load. Please check your internet connection.', false);
      setOrderLoading(false);
      return;
    }

    const options = {
      key: 'rzp_live_iFvbsicduHI4Lb', // Replace with your actual Razorpay Key ID
      amount: Math.round(getFinalTotal() * 100), // Amount in paise
      currency: 'INR',
      name: 'Aruvia',
      description: 'Order Payment',
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          // Verify payment with your backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData._id
          };

          const token = localStorage.getItem("token");
          
          // Call your payment verification API
          const verifyResponse = await axios.post(
            'https://aruvia-backend-rho.vercel.app/api/payment/verify',
            verificationData,
            {
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 
                  'Authorization': `Bearer ${token}` // Fixed template literal
                })
              }
            }
          );

          if (verifyResponse.data.success) {
            setOrderSuccess(true);
            setOrderError('');
            await clearCart();
            show_toast('Payment successful! Your order has been placed.', true);
            
            // Optional: Redirect to order confirmation page after a delay
            setTimeout(() => {
              // window.location.href = '/order-confirmation';
            }, 2000);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setOrderError('Payment verification failed. Please contact support.');
          show_toast('Payment verification failed. Please contact support.', false);
        } finally {
          setOrderLoading(false);
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`, // Fixed template literal
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state}`, // Fixed template literal
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
        }
      }
    };

    const razorpay = new window.Razorpay(options);
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
          // window.location.href = '/order-confirmation';
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
    <div>
      <style jsx>{`
        .error-input {
          border: 1px solid #f33 !important;
          background-color: #ffebee !important;
        }
        .error-text {
          color: #f33;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        .shipping-option {
          margin: 10px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .shipping-option.selected {
          border-color: #f33;
          background-color: #fff5f5;
        }
      `}</style>

      <div className="wrappage">
        <div className="container container-content">
          <ul className="breadcrumb v2">
            <li><a href="#">Home</a></li>
            <li className="active">Checkout</li>
          </ul>
        </div>
        
        <div className="check-out">
          <div className="container">
            <div className="titlell">
              <h2>Checkout</h2>
            </div>
            
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h3>Your cart is empty</h3>
                <p>Please add items to your cart before checkout.</p>
              </div>
            ) : (
              <div className="row">
                {/* Order Details Form */}
                <div className="col-md-7 col-sm-7">
                  <div className="form-name">
                    <div className="billing">
                      <h2 style={{fontSize: 26, paddingBottom: 20, fontWeight: 'bold'}}>
                        Order Details
                      </h2>
                      
                      <form onSubmit={handlePlaceOrder}>
                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              First Name<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <input 
                              type="text" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Enter first name" 
                              required 
                              className={getInputClass('firstName', 'firstname')}
                            />
                            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Last Name<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <input 
                              type="text" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Enter last name" 
                              required 
                              className={getInputClass('lastName', 'lastname')}
                            />
                            {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Email Address<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter email address"
                              required 
                              className={getInputClass('email', 'district')}
                            />
                            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Phone<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit phone number"
                              required 
                              maxLength="10"
                              className={getInputClass('phone', 'district')}
                            />
                            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                          </div>
                        </div>
                        
                        <label className="out">
                          Street Address<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <input 
                          type="text" 
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="Enter street address"
                          required 
                          className={getInputClass('street', 'district')}
                        />
                        {formErrors.street && <span className="error-text">{formErrors.street}</span>}
                        
                        <label className="out">
                          City<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                          required 
                          className={getInputClass('city', 'district')}
                        />
                        {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                        
                        <label className="out">
                          State<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter state"
                          required 
                          className={getInputClass('state', 'district')}
                        />
                        {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                        
                        <label className="out">
                          Country<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <input 
                          type="text" 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter country"
                          required 
                          className={getInputClass('country', 'district')}
                        />
                        {formErrors.country && <span className="error-text">{formErrors.country}</span>}

                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">Postal Code</label><br />
                            <input 
                              type="text" 
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit postal code"
                              maxLength="6"
                              className={getInputClass('postcode', 'country')}
                            />
                            {formErrors.postcode && <span className="error-text">{formErrors.postcode}</span>}
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <label className="out">Landmark</label><br />
                            <input 
                              type="text" 
                              name="landmark"
                              value={formData.landmark}
                              onChange={handleInputChange}
                              placeholder="Enter landmark"
                              className="district" 
                            />
                           {formErrors.landmark && <span className="error-text">{formErrors.landmark}</span>}

                          </div>
                        </div>
                        
                        {/* Shipping Options */}
                        <div style={{marginTop: 30, marginBottom: 20}}>
                          <h4>Shipping Options</h4>
                          
                          <div className={`shipping-option ${shippingOption === 'free' ? 'selected' : ''}`}>
                            <label>
                              <input 
                                type="radio" 
                                name="shipping"
                                value="free"
                                checked={shippingOption === 'free'}
                                onChange={(e) => setShippingOption(e.target.value)}
                              />
                              <span style={{marginLeft: 10}}>Free Shipping (5-7 business days) - ₹0.00</span>
                            </label>
                          </div>
                          
                          <div className={`shipping-option ${shippingOption === 'flat' ? 'selected' : ''}`}>
                            <label>
                              <input 
                                type="radio" 
                                name="shipping"
                                value="flat"
                                checked={shippingOption === 'flat'}
                                onChange={(e) => setShippingOption(e.target.value)}
                              />
                              <span style={{marginLeft: 10}}>Standard Shipping (3-5 business days) - ₹50.00</span>
                            </label>
                          </div>
                          
                          
                        </div>
                        
                        <label className="out" style={{marginTop: 20}}>
                          Order Notes (Optional)
                        </label>
                        <textarea 
                          name="orderNote" 
                          value={formData.orderNote}
                          onChange={handleInputChange}
                          placeholder="Special instructions for your order"
                          className="comment"
                          rows="4"
                        />
                      </form>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-md-5 col-sm-5">
                  <div className="order">
                    <div className="content-order">
                      <div className="table">
                        <table>
                          <caption>Your Order ({getCartItemCount()} items)</caption>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr key={item._id || item.productId}>
                                <td>
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                    {item.image && (
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        style={{width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px'}}
                                      />
                                    )}
                                    <span>{item.name}</span>
                                  </div>
                                </td>
                                <td>
                                  <i className="fa fa-times" aria-hidden="true" />
                                  {item.quantity}
                                </td>
                                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="content-total">
                        <div className="total">
                          <h5 className="sub-total">Subtotal</h5>
                          <h5 className="prince">₹{getCartTotal().toFixed(2)}</h5>
                        </div>
                        
                        <div className="total">
                          <h5 className="sub-total">Shipping</h5>
                          <h5 className="prince">₹{getShippingCost().toFixed(2)}</h5>
                        </div>
                        
                        <div className="total" style={{borderTop: '2px solid #333', paddingTop: 10}}>
                          <h5 className="sub-total" style={{fontWeight: 'bold'}}>Total</h5>
                          <h5 className="prince" style={{fontWeight: 'bold', color: '#f33'}}>
                            ₹{getFinalTotal().toFixed(2)}
                          </h5>
                        </div>
                        
                        <div className="payment">
                          <h4 style={{marginBottom: 15}}>Payment Method</h4>
                          
                          <label style={{display: 'block', marginBottom: 15}}>
                            <input 
                              type="radio" 
                              name="payment"
                              value="bank"
                              checked={paymentMethod === 'bank'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span style={{fontSize: 16, color: '#494949', fontWeight: 'bold', marginLeft: 5}}>
                              Online Payment (Razorpay)
                            </span>
                          </label>
                          <p style={{paddingLeft: 25, marginBottom: 15, fontSize: 14, color: '#666'}}>
                            Pay securely using credit card, debit card, UPI, or net banking through Razorpay.
                          </p>
                          
                         
                          <p style={{paddingLeft: 25, marginBottom: 20, fontSize: 14, color: '#666'}}>
                            Pay when your order is delivered to your doorstep.
                          </p>
                        </div>
                        
                        <div className="place-ober">
                          {orderError && (
                            <div style={{
                              color: '#f33', 
                              marginBottom: '15px', 
                              padding: '12px', 
                              backgroundColor: '#ffebee',
                              border: '1px solid #f33',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}>
                              {orderError}
                            </div>
                          )}
                          
                          {orderSuccess && (
                            <div style={{
                              color: '#4caf50', 
                              marginBottom: '15px', 
                              padding: '12px', 
                              backgroundColor: '#e8f5e8',
                              border: '1px solid #4caf50',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}>
                              ✓ Order placed successfully! Thank you for your purchase.
                            </div>
                          )}
                          
                          <button 
                            className="ober"
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={cartItems.length === 0 || orderLoading || orderSuccess}
                            style={{
                              opacity: (cartItems.length === 0 || orderLoading || orderSuccess) ? 0.6 : 1,
                              cursor: (cartItems.length === 0 || orderLoading || orderSuccess) ? 'not-allowed' : 'pointer',
                              width: '100%',
                              padding: '12px',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                          >
                            {orderLoading ? 
                              (paymentMethod === 'bank' ? 'Redirecting to Payment...' : 'Placing Order...') : 
                              orderSuccess ? 'Order Placed!' :
                              (paymentMethod === 'bank' ? 'Proceed to Payment' : 'Place Order')
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;