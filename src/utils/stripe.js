// Placeholder for Stripe instance
let stripe = null;

// Get Stripe configuration from settings
const getStripeConfig = async () => {
  try {
    const response = await fetch('/api/admin/payment-settings');
    if (response.ok) {
      const settings = await response.json();
      const stripeMode = settings.stripeMode || 'live';
      const isTestMode = settings.isTestMode || false;
      
      // If test mode is enabled, force test mode
      const effectiveMode = isTestMode ? 'test' : stripeMode;
      
      console.log(`Stripe configuration: ${effectiveMode.toUpperCase()} mode (Test Mode: ${isTestMode})`);
      
      return {
        publicKey: settings.stripePublicKey,
        mode: effectiveMode,
        isTestMode: isTestMode
      };
    }
  } catch (error) {
    console.warn('Failed to fetch Stripe settings, using environment variables as fallback:', error);
  }
  
  // Fallback to environment variables
  return {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    mode: 'live',
    isTestMode: false
  };
};

// Initialize Stripe
export const initializeStripe = async (stripePublicKey = null) => {
  try {
    const { loadStripe } = await import('@stripe/stripe-js');
    
    // Use provided public key or get from settings
    if (!stripePublicKey) {
      const config = await getStripeConfig();
      stripePublicKey = config.publicKey;
      
      // Log current mode for debugging
      console.log(`Stripe initialized in ${config.mode.toUpperCase()} mode (Test: ${config.isTestMode})`);
    }
    
    if (!stripePublicKey) {
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
export const createCheckoutSession = async (amount, currency = 'usd', successUrl = null, cancelUrl = null, itemId = null, itemName = null) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        success_url: successUrl || `${window.location.origin}/signup-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${window.location.origin}/signup`,
        itemId,
        itemName,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      console.error('Stripe checkout session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(`Failed to create checkout session. Please try again later.`);
    }

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create Stripe Checkout session
export const createSubscriptionSession = async (successUrl = null, cancelUrl = null, itemId = null, itemName = null) => {
  try {
    const response = await fetch('/api/stripe/create-subscription-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success_url: successUrl || `${window.location.origin}/signup-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${window.location.origin}/signup`,
        itemId,
        itemName,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      console.error('Stripe checkout session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(`Failed to create checkout session. Please try again later.`);
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
      console.error('Stripe checkout redirect error:', error);
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error('Checkout redirect error:', error);
    throw error;
  }
};

// Get Stripe instance
export const getStripe = () => stripe; 