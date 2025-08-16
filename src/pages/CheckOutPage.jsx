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

  const [paymentMethod, setPaymentMethod] = useState('bank'); // bank, check, cod
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showContent, setShowContent] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Effect to handle initial load sequence
  useEffect(() => {
    // Small delay to show content first
    const timer = setTimeout(() => {
      setShowContent(true);
      // Then scroll to top after content is shown
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate final total (now just the cart total)
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
      key: 'rzp_live_iFvbsicduHI4Lb', // Replace with your Razorpay Key ID
      amount: Math.round(getFinalTotal() * 100), // Amount in paise
      currency: 'INR',
      name: 'Aruvia', // Replace with your store name
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

          // Call your payment verification API
          const verifyResponse = await axios.post(
            'https://aruvia-backend.onrender.com/api/payment/verify', // Replace with your verification endpoint
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
            
            // Scroll to top after successful payment
            scrollToTop();
            
            // Redirect to order confirmation page
            // window.location.href = '/order-confirmation';
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
        color: '#f33' // Customize based on your brand color
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed by user');
          setOrderLoading(false);
          console.log("Change to product payment ");
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Scroll to top when placing order
    scrollToTop();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Prepare products array for API
      const products = cartItems.map(item => ({
        productId: item._id || item.productId,
        quantity: item.quantity
      }));

      // Prepare order data for API
      const orderData = {
        products: products,
        totalAmount: getFinalTotal(),
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
        paymentMethod: paymentMethod,
        orderNote: formData.orderNote
      };

      console.log('Sending order data:', orderData);

      // Make API call
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
        // Check if payment method requires online payment
        if (paymentMethod === 'bank' && response.data.razorpayOrderId) {
          // Redirect to Razorpay for online payment
          await handleRazorpayPayment(response.data.order, response.data.razorpayOrderId);
        } else {
          // For COD or other payment methods
          setOrderSuccess(true);
          await clearCart();
          alert('Order placed successfully! Thank you for your purchase.');
          
          // Scroll to top after successful order
          scrollToTop();
          
          // Optionally redirect to order confirmation page
          // window.location.href = '/order-confirmation';
        }
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError(
        error.response?.data?.message || 
        error.message || 
        'Failed to place order. Please try again.'
      );
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to place order'}`);
    } finally {
      if (paymentMethod !== 'bank') {
        setOrderLoading(false);
      }
      // For bank payment, loading will be disabled in Razorpay modal dismiss handler
    }
  };

  // Loading state while content is being prepared
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
                              className="firstname" 
                            />
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
                              className="lastname" 
                            />
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
                              className="form-control" 
                            />
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
                              placeholder="Enter phone number"
                              required 
                              className="district" 
                            />
                          </div>
                        </div>
                        
                        <label className="out">
                          Street<span style={{color: '#f33'}}>*</span>
                        </label><br />
                        <input 
                          type="text" 
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder="Enter street address"
                          required 
                          className="district" 
                        />
                        
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
                          className="district" 
                        />
                        
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
                          className="district" 
                        />
                        
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
                          className="district" 
                        />

                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <label className="out">Postcode/ZIP</label><br />
                            <input 
                              type="text" 
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleInputChange}
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
                              borderRadius: '4px'
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
                            disabled={cartItems.length === 0 || orderLoading}
                            style={{
                              opacity: (cartItems.length === 0 || orderLoading) ? 0.6 : 1,
                              cursor: (cartItems.length === 0 || orderLoading) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {orderLoading ? 
              (paymentMethod === 'bank' ? 'Redirecting to Payment...' : 'Placing Order...') : 
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