import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import { useErrorModal } from '../hooks/useErrorModal';
import { useYesNoModal } from '../hooks/useYesNoModal';
import { usePaymentModal } from '../hooks/usePaymentModal';
import { usePaymentSuccess } from '../hooks/usePaymentSuccess';
import { showNotification } from '../store/uiSlice';
import { shortAddress } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total: cartTotal, isEmpty, removeItem, updateItemQuantity, clearAll } = useCart();
  const { currency, showPrice } = useCurrency();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  const { showModal } = useYesNoModal();
  const { openPaymentModal } = usePaymentModal();
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess } = usePaymentSuccess();

  // Handle payment success from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      handleStripePaymentSuccess(sessionId).then((result) => {
        // Redirect to Store My Purchases tab after successful cart purchase
        if (result && result.itemType === 'cart-purchase') {
          navigate('/store?tab=My%20Purchases', { replace: true });
        }
      });
      navigate(location.pathname, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      dispatch(showNotification('Payment was cancelled'));
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, dispatch, navigate, location.pathname]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateItemQuantity(itemId, newQuantity);
    dispatch(showNotification("Cart updated"));
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    dispatch(showNotification("Item removed from cart"));
  };

  const handleClearCart = () => {
    showModal({
      title: "Clear Cart",
      message: "Are you sure you want to remove all items from your cart?",
      onConfirm: () => {
        clearAll();
        dispatch(showNotification("Cart cleared"));
      }
    });
  };

  const handleCheckout = async () => {
    if (isEmpty) return;
    
    try {
      // Calculate total amount for all cart items
      const totalAmount = cartTotal;
      const itemNames = cartItems.map(item => item.title);
      const cartItemIds = cartItems.map(item => item._id);
      
      // Open payment modal with cart total
      const result = await openPaymentModal({
        amount: totalAmount,
        itemName: `Cart Purchase (${cartItems.length} items)`,
        itemId: 'cart-purchase',
        metadata: {
          cartItems: JSON.stringify(cartItemIds),
          totalItems: cartItems.length.toString(),
          itemNames: JSON.stringify(itemNames)
        }
      });

      if (!result || !result.paymentMethod) return;
      
      // Handle payment success based on payment method
      if (result.paymentMethod === 'stripe') {
      } else if (result.paymentMethod === 'solana') {
        try {
          const paymentResult = await handleSolanaPaymentSuccess(result.signature, result.metadata);
          
          if (paymentResult.itemType === 'cart-purchase') {
            dispatch(showNotification(`${cartItems.length} items purchased successfully!`));
            // Redirect to Store My Purchases tab after successful cart purchase
            navigate('/store?tab=My%20Purchases', { replace: true });
          } else {
            dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
          }
        } catch (error) {
          console.error('Error getting payment details:', error);
          // Fallback to generic success message
          showError('Payment successful, but confirmation failed');
        }
      }
      
    } catch (error) {
      showError("Payment failed", error.message);
    }
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen py-12 pt-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
              <i className="fas fa-shopping-cart text-6xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={handleContinueShopping}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 pt-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="glass rounded-lg shadow-sm border border-gray-200/50">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200/50">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {item.description}
                        </p>
                        <div className="mt-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {currency === 'SOL' 
                              ? `${showPrice(item.priceUSD) ? showPrice(item.priceUSD).toFixed(4) : '...'} SOL`
                              : `$${item.priceUSD}`
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300/50 rounded-md bg-white/50">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </button>
                          <span className="px-3 py-1 text-gray-900 font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-colors"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50/50 transition-colors"
                          title="Remove item"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg shadow-sm border border-gray-200/50 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>
                    {currency === 'SOL' 
                      ? `${showPrice(cartTotal) ? showPrice(cartTotal).toFixed(4) : '...'} SOL`
                      : `$${cartTotal.toFixed(2)}`
                    }
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="border-t border-gray-200/50 pt-3">
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
              
              <button
                onClick={handleCheckout}
                disabled={isEmpty}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
              
              <button
                onClick={handleContinueShopping}
                className="w-full mt-3 px-4 py-3 border border-gray-300/50 rounded-md text-gray-700 glass hover:bg-white/80 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              
              <div className="mt-6 p-4 bg-blue-50/80 rounded-lg backdrop-blur-sm">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-blue-600 mt-1 mr-3"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-blue-700 mt-1">
                      Your payment information is protected with bank-level security.
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

export default Cart; 