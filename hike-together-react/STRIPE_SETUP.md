# Stripe Setup Guide for Hike Together

This guide will help you set up Stripe payments for the Hike Together app.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Firebase project with Firestore enabled
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create Stripe Products

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click **"+ Add product"**
3. Create a product with these details:
   - **Name**: Hike Together Premium
   - **Description**: Unlimited hikes per month for your family
   - **Pricing model**: Recurring

4. Add the first price:
   - **Price**: $0.99
   - **Billing period**: Monthly
   - Click **"Add price"**
   - Copy the **Price ID** (starts with `price_`)

5. Add the second price (click "Add another price"):
   - **Price**: $10.00
   - **Billing period**: Yearly
   - Click **"Add price"**
   - Copy the **Price ID** (starts with `price_`)

## Step 2: Get Your Stripe API Keys

1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
2. In the "Standard keys" section:
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)
   - Copy your **Secret key** (starts with `sk_test_` for test mode)

**Important**: Never commit your secret key to version control!

## Step 3: Configure Environment Variables

1. Create a `.env` file in the `hike-together-react` directory:

```bash
# Copy the example file
cp .env.example .env
```

2. Edit `.env` and add your Stripe keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
VITE_STRIPE_PRICE_MONTHLY=price_your_monthly_price_id_here
VITE_STRIPE_PRICE_YEARLY=price_your_yearly_price_id_here
```

## Step 4: Set Up Firebase Cloud Functions (Required for Production)

To securely process payments, you need Firebase Cloud Functions. Here's how to set them up:

### 4.1 Initialize Firebase Functions

```bash
# From the project root directory
firebase init functions

# Choose:
# - JavaScript or TypeScript (your choice)
# - Install dependencies: Yes
```

### 4.2 Install Stripe in Functions

```bash
cd functions
npm install stripe
```

### 4.3 Create Checkout Session Function

Create `functions/index.js` (or `index.ts` if using TypeScript):

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { familyId, priceId, successUrl, cancelUrl } = data;

  try {
    // Create Stripe Checkout session
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
      client_reference_id: familyId,
      metadata: {
        familyId,
        userId: context.auth.uid,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Webhook to handle successful payments
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const familyId = session.metadata.familyId;

    // Update family subscription status in Firestore
    await admin.firestore().collection('families').doc(familyId).update({
      subscriptionStatus: 'premium',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      upgradedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Handle subscription cancellation
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    // Find and update the family
    const familiesSnapshot = await admin.firestore()
      .collection('families')
      .where('stripeSubscriptionId', '==', subscription.id)
      .get();

    for (const doc of familiesSnapshot.docs) {
      await doc.ref.update({
        subscriptionStatus: 'free',
        canceledAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  res.json({ received: true });
});
```

### 4.4 Set Firebase Functions Config

```bash
# Set your Stripe secret key
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key_here"

# Later, you'll set the webhook secret (see Step 5)
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
```

### 4.5 Deploy Functions

```bash
firebase deploy --only functions
```

## Step 5: Set Up Stripe Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - Format: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook`
   - Replace `YOUR_PROJECT_ID` with your Firebase project ID
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Firebase config:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
   firebase deploy --only functions
   ```

## Step 6: Update Firestore Security Rules

Add rules to allow premium users unlimited hikes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /families/{familyId} {
      allow read: if request.auth != null &&
                     request.auth.uid in resource.data.memberUserIds;
      allow write: if request.auth != null &&
                      request.auth.uid in resource.data.memberUserIds;

      match /hikes/{hikeId} {
        allow read: if request.auth != null &&
                       request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.memberUserIds;
        allow create: if request.auth != null &&
                         request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.memberUserIds &&
                         (get(/databases/$(database)/documents/families/$(familyId)).data.subscriptionStatus == 'premium' ||
                          get(/databases/$(database)/documents/families/$(familyId)).data.hikesThisMonth < 3);
      }
    }
  }
}
```

## Step 7: Testing

### Test Mode (Safe to Use)

1. Use Stripe test mode keys (pk_test_* and sk_test_*)
2. Use test card numbers from [Stripe Testing Docs](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiration date and any 3-digit CVC

### Going Live

1. Switch to Live mode in Stripe Dashboard
2. Repeat Steps 1-5 with **live** API keys (pk_live_* and sk_live_*)
3. Update your `.env` with live keys
4. Redeploy Firebase Functions with live keys:
   ```bash
   firebase functions:config:set stripe.secret_key="sk_live_your_live_secret_key"
   firebase deploy --only functions
   ```

## Troubleshooting

### "Stripe checkout is not yet configured" Error

This means Firebase Cloud Functions haven't been set up yet. Complete Step 4 above.

### Webhook Not Receiving Events

1. Check your webhook URL is correct
2. Verify the signing secret matches
3. Look at webhook logs in Stripe Dashboard
4. Check Firebase Functions logs: `firebase functions:log`

### Payment Succeeds But Subscription Not Updated

1. Check webhook is configured correctly
2. Verify Firestore security rules allow updates
3. Check Firebase Functions logs for errors

## Support

For issues with:
- Stripe: https://support.stripe.com
- Firebase: https://firebase.google.com/support
- This app: Contact evan@evannickel.com
