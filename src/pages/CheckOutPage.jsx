import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { contextData } from '../services/Context';

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
    country: '',
    postcode: '',
    landmark: '',
    orderNote: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('bank'); // bank, check, cod
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showContent, setShowContent] = useState(false);

  // Validation rules
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'First name must be at least 2 characters and contain only letters'
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Last name must be at least 2 characters and contain only letters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^[+]?[\d\s\-()]{10,15}$/,
      message: 'Please enter a valid phone number (10-15 digits)'
    },
    street: {
      required: true,
      minLength: 5,
      message: 'Street address must be at least 5 characters long'
    },
    city: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'City must be at least 2 characters and contain only letters'
    },
    state: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'State must be at least 2 characters and contain only letters'
    },
    country: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Country must be at least 2 characters and contain only letters'
    },
    postcode: {
      required: false,
      pattern: /^[a-zA-Z0-9\s\-]{3,10}$/,
      message: 'Please enter a valid postal code'
    }
  };

  // Validate single field
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (value && rule.minLength && value.trim().length < rule.minLength) {
      return rule.message || `${name} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.pattern && !rule.pattern.test(value.trim())) {
      return rule.message || `Invalid ${name} format`;
    }

    return '';
  };

  // Validate all fields
  const validateAllFields = () => {
    const errors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    return errors;
  };

  // Check if form is valid
  const isFormValid = () => {
    const errors = validateAllFields();
    return Object.keys(errors).length === 0;
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to first error
  const scrollToFirstError = () => {
    const firstErrorField = document.querySelector('.error-field');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }
  };

  // Effect to handle initial load sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle form input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field in real-time
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle field blur (when user leaves the field)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Get field error (only show if touched)
  const getFieldError = (fieldName) => {
    return touched[fieldName] ? validationErrors[fieldName] : '';
  };

  // Calculate final total
  const getFinalTotal = () => {
    return getCartTotal();
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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
      alert('Razorpay SDK failed to load. Please check your internet connection.');
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
        try {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData._id
          };

          const verifyResponse = await axios.post(
            'https://aruvia-backend.onrender.com/api/payment/verify',
            verificationData,
            {
              headers: {
                'Content-Type': 'application/json',
                ...(localStorage.getItem("token") && { 
                  'Authorization': `Bearer ${localStorage.getItem("token")}` 
                })
              }
            }
          );

          if (verifyResponse.data.success) {
            setOrderSuccess(true);
            await clearCart();
            alert('Payment successful! Your order has been placed.');
            scrollToTop();
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Please contact support.');
        }
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
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle form submission with comprehensive validation
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allFields = Object.keys(validationRules);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // Validate all fields
    const errors = validateAllFields();
    setValidationErrors(errors);
    
    // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      scrollToFirstError();
      setOrderError('Please fix the validation errors above before proceeding.');
      return;
    }

    // Check cart
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Additional business logic validations
    if (getFinalTotal() <= 0) {
      setOrderError('Order total must be greater than zero.');
      return;
    }

    scrollToTop();
    setOrderLoading(true);
    setOrderError('');
    
    try {
      const token = localStorage.getItem("token");
      
      const products = cartItems.map(item => ({
        productId: item._id || item.productId,
        quantity: item.quantity
      }));

      const orderData = {
        products: products,
        totalAmount: getFinalTotal(),
        address: {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phone.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postcode.trim(),
          country: formData.country.trim(),
          landmark: formData.landmark.trim()
        },
        paymentMethod: paymentMethod,
        orderNote: formData.orderNote.trim()
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post(
        'https://aruvia-backend.onrender.com/api/order/createorder',
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
        if (paymentMethod === 'bank' && response.data.razorpayOrderId) {
          await handleRazorpayPayment(response.data.order, response.data.razorpayOrderId);
        } else {
          setOrderSuccess(true);
          await clearCart();
          alert('Order placed successfully! Thank you for your purchase.');
          scrollToTop();
        }
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      setOrderError(errorMessage);
      scrollToTop();
    } finally {
      if (paymentMethod !== 'bank') {
        setOrderLoading(false);
      }
    }
  };

  // Input component with validation styling
  const ValidatedInput = ({ name, type = "text", placeholder, required = false, className = "", ...props }) => {
    const error = getFieldError(name);
    const hasError = !!error;
    
    return (
      <div style={{ marginBottom: '15px' }}>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${className} ${hasError ? 'error-field' : ''}`}
          style={{
            border: hasError ? '2px solid #f33' : '1px solid #ddd',
            backgroundColor: hasError ? '#fff5f5' : 'white',
            ...props.style
          }}
          {...props}
        />
        {hasError && (
          <div style={{
            color: '#f33',
            fontSize: '12px',
            marginTop: '5px',
            display: 'block'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (!showContent) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading checkout...
      </div>
    );
  }

  return (
    <div>
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
              {/* Scroll to top button */}
              <button 
                onClick={scrollToTop}
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: '#f33',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  zIndex: 1000,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#d11';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f33';
                  e.target.style.transform = 'scale(1)';
                }}
                title="Scroll to top"
              >
                ↑
              </button>
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
                      
                      <form onSubmit={handlePlaceOrder} noValidate>
                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              First Name<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <ValidatedInput
                              name="firstName"
                              placeholder="Enter first name"
                              className="firstname"
                              required
                            />
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Last Name<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <ValidatedInput
                              name="lastName"
                              placeholder="Enter last name"
                              className="lastname"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Email Address<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <ValidatedInput
                              name="email"
                              type="email"
                              placeholder="Enter email address"
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <label className="out">
                              Phone<span style={{color: '#f33'}}>*</span>
                            </label><br />
                            <ValidatedInput
                              name="phone"
                              type="tel"
                              placeholder="Enter phone number"
                              className="district"
                              required
                            />
                          </div>
                        </div>
                        
                        <label className="out">
                          Street<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <ValidatedInput
                          name="street"
                          placeholder="Enter street address"
                          className="district"
                          required
                        />
                        
                        <label className="out">
                          City<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <ValidatedInput
                          name="city"
                          placeholder="Enter city"
                          className="district"
                          required
                        />
                        
                        <label className="out">
                          State<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <ValidatedInput
                          name="state"
                          placeholder="Enter state"
                          className="district"
                          required
                        />
                        
                        <label className="out">
                          Country<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <ValidatedInput
                          name="country"
                          placeholder="Enter country"
                          className="district"
                          required
                        />

                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">Postcode/ZIP</label><br />
                            <ValidatedInput
                              name="postcode"
                              placeholder="Enter postcode"
                              className="country"
                            />
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
                          </div>
                        </div>
                        
                        <label className="out" style={{marginTop: 20}}>
                          Order Note
                        </label>
                        <textarea 
                          name="orderNote" 
                          value={formData.orderNote}
                          onChange={handleInputChange}
                          placeholder="Special instructions for your order"
                          className="comment" 
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
                                  {item.name}
                                  {item.image && (
                                    <div style={{marginTop: 5}}>
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                      />
                                    </div>
                                  )}
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
                        <div className="total" style={{borderTop: '2px solid #333', paddingTop: 10}}>
                          <h5 className="sub-total" style={{fontWeight: 'bold'}}>Total</h5>
                          <h5 className="prince" style={{fontWeight: 'bold', color: '#f33'}}>
                            ₹{getCartTotal().toFixed(2)}
                          </h5>
                        </div>
                        
                        <div className="payment">
                          <label>
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
                          <p style={{paddingLeft: 20, paddingBottom: 20}}>
                            Pay securely using your credit card, debit card, or net banking through Razorpay.
                          </p>
                          <hr />
                        </div>
                        
                        <div className="place-ober">
                          {orderError && (
                            <div style={{
                              color: '#f33', 
                              marginBottom: '10px', 
                              padding: '10px', 
                              backgroundColor: '#ffebee',
                              border: '1px solid #f33',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}>
                              {orderError}
                            </div>
                          )}
                          
                          {orderSuccess && (
                            <div style={{
                              color: '#4caf50', 
                              marginBottom: '10px', 
                              padding: '10px', 
                              backgroundColor: '#e8f5e8',
                              border: '1px solid #4caf50',
                              borderRadius: '4px'
                            }}>
                              Order placed successfully!
                            </div>
                          )}
                          
                          <button 
                            className="ober"
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={cartItems.length === 0 || orderLoading || !isFormValid()}
                            style={{
                              opacity: (cartItems.length === 0 || orderLoading || !isFormValid()) ? 0.6 : 1,
                              cursor: (cartItems.length === 0 || orderLoading || !isFormValid()) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {orderLoading ? 
                              (paymentMethod === 'bank' ? 'Redirecting to Payment...' : 'Placing Order...') : 
                              (paymentMethod === 'bank' ? 'Proceed to Payment' : 'Place Order')
                            }
                          </button>
                          
                          {!isFormValid() && Object.keys(touched).length > 0 && (
                            <div style={{
                              fontSize: '12px',
                              color: '#f33',
                              marginTop: '8px',
                              textAlign: 'center'
                            }}>
                              Please fix validation errors to proceed
                            </div>
                          )}
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