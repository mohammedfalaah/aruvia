import React, { useEffect, useState } from 'react';
import { Check, Package, Truck, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import SEO from '../services/SEO';

const OrderConfirmationPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
 

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
      <SEO
  title="Order Confirmed"
  description="Thank you for your order! Your herbal products will be delivered soon."
  url="https://aruviaherbals.com/order-confirmation"
/>
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
        
           
          </div>

          <p style={{ fontSize: '14px', color: '#888', marginTop: '16px' }}>
          </p>
        </div>

      

        {/* Order Items */}
       

        {/* Action Buttons */}
        <div className="fade-in-up" style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center',
          marginTop: '32px',
          animationDelay: '0.6s',
          flexWrap: 'wrap'
        }}>
          {/* <button className="btn-primary" onClick={() => window.location.href = '/orders'}>
            <Package size={20} />
            View My Orders
          </button> */}
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
            <a href="mailto:aruviaproducts@gmail.com" style={{ 
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
              +91 9497840126
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;