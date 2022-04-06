import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.log('STRIPE_SECRET_KEY is not set!');
  process.exit(1);
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
});
