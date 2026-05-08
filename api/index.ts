import app from '../server/index';

// Disable Vercel's default body parsing so Express (and Stripe webhook
// signature verification via express.raw()) receives the raw request body.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
