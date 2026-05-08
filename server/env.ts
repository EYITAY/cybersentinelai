import dotenv from 'dotenv';

// Load environment variables for the backend.
// Prefer `.env.local` (dev), but fall back to `.env`.
dotenv.config({ path: '.env.local' });
dotenv.config();
