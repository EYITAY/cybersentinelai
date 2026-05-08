import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('[server] Missing STRIPE_SECRET_KEY');
}

export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured (missing STRIPE_SECRET_KEY).');
  }
  return stripe;
}
