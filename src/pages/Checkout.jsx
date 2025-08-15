import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import { useErrorModal } from '../hooks/useErrorModal';
import { showNotification } from '../store/uiSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total: cartTotal, clearAll } = useCart();
  const { currency, showPrice } = useCurrency();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  
  const [paymentMethod, setPaymentMethod] = useState('solana');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      showSpinner("Processing payment...");
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart after successful payment
      clearAll();
      dispatch(showNotification("Payment successful! Your order has been processed."));
      
      // Navigate to success page or back to store
      navigate('/store');
    } catch (error) {
      showError("Payment failed", error.message);
    } finally {
      setIsProcessing(false);
      hideSpinner();
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 pt-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
              <i className="fas fa-shopping-cart text-6xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">
              There's nothing to checkout. Add some items to your cart first.
            </p>
            <button
              onClick={() => navigate('/store')}
              className="btn-primary text-lg px-8 py-3"
            >
              Go Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 pt-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={handleBackToCart}
            className="text-[#42677D] hover:text-[#355263] flex items-center mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="glass rounded-lg shadow-sm border border-gray-200/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {currency === 'SOL' 
                        ? `${showPrice(item.priceUSD * item.quantity) ? showPrice(item.priceUSD * item.quantity).toFixed(4) : '...'} SOL`
                        : `$${(item.priceUSD * item.quantity).toFixed(2)}`
                      }
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200/50 pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>
                    {currency === 'SOL' 
                      ? `${showPrice(cartTotal) ? showPrice(cartTotal).toFixed(4) : '...'} SOL`
                      : `$${cartTotal.toFixed(2)}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="glass rounded-lg shadow-sm border border-gray-200/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="solana"
                    name="paymentMethod"
                    value="solana"
                    checked={paymentMethod === 'solana'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#0EA47A] focus:ring-[#0EA47A] border-gray-300"
                  />
                  <label htmlFor="solana" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-[#0EA47A] mr-2" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                        <path fill="currentColor" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                        <path fill="currentColor" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                      </svg>
                      Pay with SOL
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#42677D] focus:ring-[#42677D] border-gray-300"
                  />
                  <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <i className="fab fa-stripe text-[#42677D] text-xl mr-2"></i>
                      Pay with Card (USD)
                    </div>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </button>
              
              <div className="mt-6 p-4 bg-blue-50/80 rounded-lg backdrop-blur-sm">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-blue-600 mt-1 mr-3"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-blue-700 mt-1">
                      Your payment is protected with bank-level security and encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 