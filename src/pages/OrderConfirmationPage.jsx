import React, { useEffect, useState } from 'react';
import { Check, Package, Truck, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';

const OrderConfirmationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [orderDetails] = useState({
    orderNumber: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Koramangala, Bangalore, Karnataka 560095',
    paymentMethod: 'Online Payment (Razorpay)',
    subtotal: 2499.00,
    shipping: 50.00,
    total: 2549.00,
    items: [
      { id: 1, name: 'Premium Cotton T-Shirt', quantity: 2, price: 799.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100' },
      { id: 2, name: 'Denim Jeans', quantity: 1, price: 1499.00, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100' }
    ]
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 50%, #fff 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: '10px',
                height: '10px',
                backgroundColor: ['#f33', '#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff'][Math.floor(Math.random() * 5)],
                opacity: 0.8,
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(-45deg); }
          100% { transform: scale(1) rotate(-45deg); }
        }
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
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          padding: 30px;
          margin-bottom: 24px;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .btn-primary {
          background: #f33;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #d62929;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(255, 51, 51, 0.3);
        }
        .btn-secondary {
          background: white;
          color: #333;
          border: 2px solid #e0e0e0;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          border-color: #f33;
          color: #f33;
        }
        .timeline-step {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          position: relative;
        }
        .timeline-step::after {
          content: '';
          position: absolute;
          left: 23px;
          top: 50px;
          width: 2px;
          height: calc(100% + 24px);
          background: #e0e0e0;
        }
        .timeline-step:last-child::after {
          display: none;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Success Header */}
        <div className="card fade-in-up" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
          }}>
            <Check size={48} color="white" strokeWidth={3} />
          </div>
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#333', 
            marginBottom: '12px' 
          }}>
            Order Confirmed!
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#666', 
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>

          <div style={{ 
            display: 'inline-flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: '#f8f9fa',
            padding: '20px 40px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <span style={{ fontSize: '14px', color: '#888', fontWeight: '500' }}>
              Order Number
            </span>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#f33',
              letterSpacing: '1px'
            }}>
              {orderDetails.orderNumber}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: '#888', marginTop: '16px' }}>
            A confirmation email has been sent to <strong>{orderDetails.email}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Order Timeline */}
          <div className="card fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={24} color="#f33" />
              Order Status
            </h2>

            <div className="timeline-step">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <Check size={24} color="white" strokeWidth={3} />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>Order Confirmed</p>
                <p style={{ fontSize: '13px', color: '#888' }}>{orderDetails.date}</p>
              </div>
            </div>

            <div className="timeline-step">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <Package size={24} color="#2196f3" />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>Processing</p>
                <p style={{ fontSize: '13px', color: '#888' }}>We're preparing your items</p>
              </div>
            </div>

            <div className="timeline-step">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <Truck size={24} color="#999" />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#999', marginBottom: '4px' }}>Shipped</p>
                <p style={{ fontSize: '13px', color: '#888' }}>On the way to you</p>
              </div>
            </div>

            <div className="timeline-step">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <Check size={24} color="#999" />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#999', marginBottom: '4px' }}>Delivered</p>
                <p style={{ fontSize: '13px', color: '#888' }}>Expected by {orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <div style={{
              background: '#fff3e0',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Calendar size={20} color="#ff9800" />
              <span style={{ fontSize: '14px', color: '#f57c00' }}>
                Estimated delivery: <strong>{orderDetails.estimatedDelivery}</strong>
              </span>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#f33" />
                Delivery Address
              </h3>
              <p style={{ fontSize: '15px', color: '#333', fontWeight: '600', marginBottom: '4px' }}>
                {orderDetails.customerName}
              </p>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                {orderDetails.address}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
                  <Mail size={16} color="#888" />
                  {orderDetails.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
                  <Phone size={16} color="#888" />
                  {orderDetails.phone}
                </div>
              </div>
            </div>

            <div className="card fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="#f33" />
                Payment Information
              </h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#666' }}>{orderDetails.paymentMethod}</span>
                <span className="status-pill" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                  <Check size={16} />
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
            Order Items
          </h2>
          
          {orderDetails.items.map((item, index) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: index < orderDetails.items.length - 1 ? '1px solid #f0f0f0' : 'none',
              gap: '16px'
            }}>
              <img 
                src={item.image} 
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '14px', color: '#888' }}>
                  Quantity: {item.quantity}
                </p>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '15px', color: '#666' }}>Subtotal</span>
              <span style={{ fontSize: '15px', color: '#333' }}>₹{orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', color: '#666' }}>Shipping</span>
              <span style={{ fontSize: '15px', color: '#333' }}>₹{orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid #f0f0f0' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f33' }}>
                ₹{orderDetails.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fade-in-up" style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          marginTop: '32px',
          animationDelay: '0.6s',
          flexWrap: 'wrap'
        }}>
          <button className="btn-primary" onClick={() => window.location.href = '/orders'}>
            <Package size={20} />
            View My Orders
          </button>
          <button className="btn-secondary" onClick={() => window.location.href = '/'}>
            Continue Shopping
          </button>
        </div>

        {/* Help Section */}
        <div className="card fade-in-up" style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          animationDelay: '0.7s',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            Need Help?
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            If you have any questions about your order, feel free to contact us.
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@aruvia.com" style={{ 
              color: '#f33', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Mail size={16} />
              support@aruvia.com
            </a>
            <a href="tel:+919876543210" style={{ 
              color: '#f33', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Phone size={16} />
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;