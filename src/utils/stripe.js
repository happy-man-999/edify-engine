// Placeholder for Stripe instance
let stripe = null;

// Initialize Stripe
export const initializeStripe = async () => {
  try {
    const { loadStripe } = await import('@stripe/stripe-js');
    const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    if (!stripePublicKey) {
      console.log('Stripe public key not found, using mock mode');
      // For development, create a mock stripe object
      stripe = {
        redirectToCheckout: async ({ sessionId }) => {
          // Simulate redirect to success page
          window.location.href = `/signup-success?session_id=${sessionId}`;
          return { error: null };
        }
      };
      return true;
    }
    
    stripe = await loadStripe(stripePublicKey);
    return true;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return false;
  }
};

// Create payment intent
export const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Create Stripe Checkout session
export const createCheckoutSession = async (amount, currency = 'usd') => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        success_url: `${window.location.origin}/signup-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/signup`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId) => {
  try {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Checkout redirect error:', error);
    throw error;
  }
};

// Process payment (legacy - keeping for compatibility)
export const processPayment = async (clientSecret, paymentMethod) => {
  try {
    // For development, simulate successful payment
    return { success: true };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

// Get Stripe instance
export const getStripe = () => stripe; 