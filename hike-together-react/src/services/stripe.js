import { loadStripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, updateDoc } from 'firebase/firestore';
import { db, analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// TODO: Replace with your actual Stripe publishable key
// Get this from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create a Stripe Checkout session for subscription
 * @param {string} familyId - The family ID
 * @param {string} priceId - The Stripe Price ID ('monthly' or 'yearly')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const createCheckoutSession = async (familyId, priceId) => {
  try {
    // TODO: This requires Firebase Cloud Functions to be set up
    // For now, this is a placeholder that shows how it would work

    // In production, you would:
    // 1. Call a Firebase Cloud Function that creates a Stripe Checkout session
    // 2. The function returns a session ID
    // 3. Redirect to Stripe Checkout with that session ID

    const functions = getFunctions();
    const createSession = httpsCallable(functions, 'createStripeCheckoutSession');

    const result = await createSession({
      familyId,
      priceId,
      successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}`,
    });

    if (!result.data.sessionId) {
      throw new Error('No session ID returned');
    }

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: result.data.sessionId,
    });

    if (error) {
      throw error;
    }

    logEvent(analytics, 'checkout_started', { priceId });
    return { success: true };
  } catch (error) {
    console.error('Stripe checkout error:', error);

    // Provide helpful error messages
    if (error.message && error.message.includes('not found')) {
      return {
        success: false,
        error: 'Stripe checkout is not yet configured. Please contact support.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to start checkout. Please try again.',
    };
  }
};

/**
 * Handle successful payment by updating family subscription
 * @param {string} familyId - The family ID
 * @param {string} sessionId - The Stripe checkout session ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const handleSuccessfulPayment = async (familyId, sessionId) => {
  try {
    // Update family subscription status
    await updateDoc(doc(db, 'families', familyId), {
      subscriptionStatus: 'premium',
      stripeSessionId: sessionId,
      upgradedAt: new Date().toISOString(),
    });

    logEvent(analytics, 'subscription_created');
    return { success: true };
  } catch (error) {
    console.error('Handle payment error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update subscription status',
    };
  }
};

/**
 * Stripe Product Configuration
 *
 * To set up Stripe products, follow these steps:
 *
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create a new product called "Hike Together Premium"
 * 3. Add two prices to this product:
 *    - Monthly: $0.99/month (recurring)
 *    - Yearly: $10/year (recurring)
 * 4. Copy the Price IDs and add them to your .env file:
 *    VITE_STRIPE_PRICE_MONTHLY=price_xxxxxxxxxxxxx
 *    VITE_STRIPE_PRICE_YEARLY=price_xxxxxxxxxxxxx
 * 5. Also add your publishable key:
 *    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
 *
 * For production, you'll also need to:
 * 1. Set up Firebase Cloud Functions
 * 2. Create a function to handle Stripe checkout sessions
 * 3. Set up Stripe webhooks to handle subscription events
 */

export const STRIPE_PRICES = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
};

// Price display names
export const PRICE_NAMES = {
  monthly: '$0.99/month',
  yearly: '$10/year',
};
