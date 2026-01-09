# Stripe Integration Deployment Guide

## Overview

Your Stripe integration is now set up! This guide will walk you through the final steps to get Stripe payments working in production.

## What's Already Done ✅

1. ✅ `.env` file created with your Stripe publishable key and price IDs
2. ✅ Firebase Functions created to handle Stripe checkout
3. ✅ Frontend code configured to call Stripe checkout
4. ✅ `.gitignore` updated to protect your secrets
5. ✅ All npm dependencies installed

## What You Need to Do

### Step 1: Add Your Stripe Secret Key

Open `hike-together-react/.env` and replace `your_secret_key_here` with your actual Stripe secret key:

```bash
# Replace this line:
STRIPE_SECRET_KEY=your_secret_key_here

# With your actual key (starts with sk_live_):
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

⚠️ **Important**: Get your secret key from https://dashboard.stripe.com/apikeys

### Step 2: Configure Firebase Functions Environment Variables

Firebase Functions need access to your Stripe keys. Set them using the Firebase CLI:

```bash
# Navigate to the project root
cd /home/user/hike-together

# Set the Stripe secret key
firebase functions:config:set stripe.secret_key="sk_live_xxxxxxxxxxxxx"

# Set the webhook secret (you'll get this in Step 4)
firebase functions:config:set stripe.webhook_secret="whsec_xxxxxxxxxxxxx"
```

### Step 3: Deploy Firebase Functions

Deploy your Cloud Functions to Firebase:

```bash
cd /home/user/hike-together
firebase deploy --only functions
```

This will deploy two functions:
- `createStripeCheckoutSession` - Creates checkout sessions
- `handleStripeWebhook` - Handles Stripe webhook events

**Expected output:**
```
✔  Deploy complete!

Functions:
  createStripeCheckoutSession(us-central1)
  handleStripeWebhook(us-central1)
```

### Step 4: Set Up Stripe Webhooks

After deploying, you'll need to configure Stripe to send events to your webhook handler:

1. **Get your webhook URL**:
   - Your webhook URL will be: `https://us-central1-hike-together-app.cloudfunctions.net/handleStripeWebhook`
   - (Replace `hike-together-app` with your actual Firebase project ID if different)

2. **Add webhook endpoint in Stripe**:
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your webhook URL
   - Select these events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`
   - Click "Add endpoint"

3. **Get your webhook signing secret**:
   - After creating the endpoint, click on it
   - Click "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_`)
   - Add it to Firebase Functions config:
     ```bash
     firebase functions:config:set stripe.webhook_secret="whsec_xxxxxxxxxxxxx"
     ```
   - Redeploy functions:
     ```bash
     firebase deploy --only functions
     ```

### Step 5: Update Frontend Environment Variables

The frontend also needs environment variables. Since you're using Vite, you need to add them to your `.env` file in the React app directory.

The `.env` file is already created at `hike-together-react/.env` with:
- `VITE_STRIPE_PUBLISHABLE_KEY` ✅ (already set)
- `VITE_STRIPE_PRICE_MONTHLY` ✅ (already set)
- `VITE_STRIPE_PRICE_YEARLY` ✅ (already set)
- `STRIPE_SECRET_KEY` ⚠️ (needs your secret key)

### Step 6: Rebuild and Deploy Frontend

After setting environment variables, rebuild your frontend:

```bash
cd /home/user/hike-together/hike-together-react
npm run build
```

Then deploy to Firebase Hosting:

```bash
cd /home/user/hike-together
firebase deploy --only hosting
```

### Step 7: Test the Integration

1. **Test in development**:
   ```bash
   cd /home/user/hike-together/hike-together-react
   npm run dev
   ```
   - Log in to your app
   - Go to Settings
   - Click "Choose Monthly" or "Choose Yearly"
   - You should be redirected to Stripe Checkout

2. **Use Stripe test card**:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

3. **Verify subscription**:
   - After successful payment, you should be redirected back to your app
   - Check Firestore to see that your family's `subscriptionStatus` is updated to `premium`

## Troubleshooting

### Function deployment fails

**Error**: "Billing account not configured"
- You need to enable billing on your Firebase project
- Go to https://console.firebase.google.com/project/hike-together-app/settings/billing

### Checkout session creation fails

**Error**: "Stripe checkout is not yet configured"
- Make sure you've deployed the functions
- Check that environment variables are set correctly:
  ```bash
  firebase functions:config:get
  ```

### Webhook not receiving events

**Error**: Subscription status not updating after payment
- Verify webhook URL is correct in Stripe dashboard
- Check webhook signing secret is set correctly
- View function logs: `firebase functions:log`

### Environment variables not loading

**Error**: "No session ID returned"
- Make sure you've set the Firebase Functions config
- Restart your local dev server if testing locally
- Rebuild and redeploy if testing in production

## Security Checklist

Before going live, verify:

- [ ] `.env` file is NOT committed to git
- [ ] Stripe secret key is added to Firebase Functions config
- [ ] Webhook signing secret is configured
- [ ] Using LIVE mode keys (not test mode)
- [ ] Tested the full payment flow
- [ ] Subscription status updates correctly in Firestore

## Firebase Functions Pricing

Firebase Cloud Functions pricing:
- **Free tier**: 2 million invocations/month, 400,000 GB-seconds, 200,000 CPU-seconds
- Your Stripe functions should easily stay within free tier limits
- Monitor usage at: https://console.firebase.google.com/project/hike-together-app/functions/usage

## Support

If you encounter issues:
1. Check function logs: `firebase functions:log`
2. Check Stripe dashboard logs: https://dashboard.stripe.com/logs
3. Verify webhook events: https://dashboard.stripe.com/webhooks

## Next Steps

Once Stripe is working:
1. Consider adding a customer portal for users to manage subscriptions
2. Add email receipts via Stripe
3. Set up subscription renewal reminders
4. Monitor failed payments and retry logic

---

**You're almost there!** Just add your Stripe secret key and deploy. Let me know if you run into any issues!
