# Cyber Sentinel AI

React + Vite frontend with an Express backend that proxies Gemini and enforces SaaS limits (Supabase Auth + Stripe subscriptions).

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`

2. Create your env file:
   - Copy `.env.example` → `.env.local` (recommended)
   - Fill in:
     - `GEMINI_API_KEY`
     - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
     - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`

3. Apply the Supabase schema:
   - Open `supabase/schema.sql` in the Supabase SQL editor and run it.

4. Run the app (frontend + backend):
   `npm run dev`

Frontend: `http://localhost:5173`
Backend health check: `http://localhost:3001/api/health`

## Deploy to Vercel

This project is already configured for Vercel:
- `vercel.json` builds the Vite app and routes `/api/*` to the serverless API.
- `api/index.ts` exports the Express app from `server/index.ts`.

### 1. Push code to GitHub

1. Commit your latest changes.
2. Push to your GitHub repository.

### 2. Import project in Vercel

1. Go to Vercel dashboard.
2. Click **Add New Project**.
3. Import this GitHub repository.
4. Framework preset should detect **Vite**.
5. Build settings should use:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3. Add environment variables (Vercel Project Settings)

Add these variables in Vercel for Production (and Preview if needed):

- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_GREENHORN`
- `STRIPE_PRICE_VIGILANTE`
- `STRIPE_PRICE_SENTINEL`
- `FRONTEND_URL` = `https://your-vercel-domain.vercel.app` (or your custom domain)

Optional:
- `PORT` is not required on Vercel, but harmless if set.

### 4. Deploy

1. Click **Deploy**.
2. After deployment, verify health endpoint:
   - `https://your-vercel-domain.vercel.app/api/health`

### 5. Configure Stripe for production

1. In Stripe Dashboard, create/update webhook endpoint:
   - `https://your-vercel-domain.vercel.app/api/billing/webhook`
2. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copy webhook signing secret to Vercel as `STRIPE_WEBHOOK_SECRET`.
4. Ensure your live recurring price IDs are set in:
   - `STRIPE_PRICE_GREENHORN`
   - `STRIPE_PRICE_VIGILANTE`
   - `STRIPE_PRICE_SENTINEL`

### 6. Configure Supabase Auth URLs

In Supabase Dashboard:
1. Go to **Authentication → URL Configuration**.
2. Set **Site URL** to your production domain.
3. Add your production app URL to **Redirect URLs**.
4. If using Google OAuth, ensure the same callback/redirect URLs are allowed.

### 7. Apply database schema

If not already applied, run `supabase/schema.sql` in Supabase SQL editor for the production project.

### 8. Smoke test production

1. Open app home page.
2. Sign up / sign in.
3. Run a scan.
4. Start checkout and complete test payment.
5. Confirm user lands on Account page and plan updates.
6. Open billing portal and confirm return to Account page.

## Stripe notes

- Create 3 recurring Prices in Stripe (Greenhorn / Vigilante / Sentinel) and set their IDs in `STRIPE_PRICE_GREENHORN`, `STRIPE_PRICE_VIGILANTE`, `STRIPE_PRICE_SENTINEL`.
- Add a webhook endpoint pointing to `/api/billing/webhook` and set `STRIPE_WEBHOOK_SECRET`.
- All new users get a **3-day free trial** with 1 scan per day. No credit card required. After the trial expires, users must subscribe to continue.

## Future: Team / Multi-Seat Feature

The current billing model supports individual users. A team/multi-seat feature is planned for a future release. Here's the implementation roadmap:

### Database changes (Supabase)
- Create an `organizations` table (`id`, `name`, `owner_id`, `created_at`).
- Create an `org_members` table (`org_id`, `user_id`, `role` enum: `owner` / `admin` / `member`, `invited_at`, `accepted_at`).
- Add `org_id` column to `subscriptions`, `usage`, and `scans` tables.
- Add RLS policies so members can read their org's scans and usage.

### Billing changes (Stripe)
- Use `quantity` on the Stripe subscription to represent seat count.
- When an admin adds/removes a member, call `stripe.subscriptions.update()` to adjust the quantity.
- Add a per-seat price in Stripe (e.g. $17/seat/month for Enterprise).

### Backend changes
- Add invite/accept/remove member endpoints (`/api/org/invite`, `/api/org/members`, etc.).
- Quota enforcement becomes org-level: aggregate `usage` across all org members.
- `/api/me` returns `orgId`, `orgName`, `orgRole` when the user belongs to an org.

### Frontend changes
- Add a "Team" settings page: invite by email, manage members, view org usage.
- Navbar shows org name and role when in an org context.
- Admin can upgrade/downgrade seats from the billing portal.

### Migration path
- Existing individual subscribers keep their plan.
- An "Enterprise" tier is introduced with per-seat pricing.
- Individual users can create an org and become its owner, converting their subscription to a team plan.

## Optional: Google sign-in (Supabase Auth)

- Supabase → Authentication → Providers → Google → Enable.
- In Google Cloud, create an OAuth client (Web) and add the redirect URL that Supabase shows (it ends with `/auth/v1/callback`).
- Supabase → Authentication → URL Configuration:
   - Local dev: allow `http://localhost:5173`
   - Production: set your real domain
