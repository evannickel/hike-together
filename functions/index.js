const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

/**
 * Create a Stripe Checkout Session for subscription
 *
 * This function is called from the frontend when a user wants to upgrade to premium.
 * It creates a Stripe Checkout session and returns the session ID.
 */
exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to create a checkout session.'
    );
  }

  const { familyId, priceId, successUrl, cancelUrl } = data;

  // Validate required parameters
  if (!familyId || !priceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'familyId and priceId are required.'
    );
  }

  try {
    // Get family document to verify user has access
    const familyDoc = await admin.firestore().collection('families').doc(familyId).get();

    if (!familyDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Family not found.'
      );
    }

    const familyData = familyDoc.data();

    // Verify user is part of this family
    if (familyData.ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User does not have permission to upgrade this family.'
      );
    }

    // Check if family is already premium
    if (familyData.subscriptionStatus === 'premium') {
      throw new functions.https.HttpsError(
        'already-exists',
        'This family already has a premium subscription.'
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        familyId: familyId,
        userId: context.auth.uid,
      },
      client_reference_id: familyId,
    });

    // Log the checkout session creation
    console.log(`Checkout session created: ${session.id} for family: ${familyId}`);

    return {
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      `Failed to create checkout session: ${error.message}`
    );
  }
});

/**
 * Stripe Webhook Handler
 *
 * This function handles webhook events from Stripe.
 * It's called by Stripe when events occur (like successful payment).
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      // Update family subscription status
      const familyId = session.metadata.familyId || session.client_reference_id;

      if (familyId) {
        try {
          await admin.firestore().collection('families').doc(familyId).update({
            subscriptionStatus: 'premium',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            upgradedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Family ${familyId} upgraded to premium`);
        } catch (error) {
          console.error(`Error updating family ${familyId}:`, error);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;

      // Find family by stripe subscription ID and downgrade
      const familiesSnapshot = await admin.firestore()
        .collection('families')
        .where('stripeSubscriptionId', '==', subscription.id)
        .get();

      for (const doc of familiesSnapshot.docs) {
        try {
          await doc.ref.update({
            subscriptionStatus: 'free',
            downgradedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Family ${doc.id} subscription cancelled`);
        } catch (error) {
          console.error(`Error downgrading family ${doc.id}:`, error);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;

      // Handle subscription updates (renewal, changes, etc.)
      console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});
