import { supabase } from './supabaseClient';

export type PaidPlan = 'greenhorn' | 'vigilante' | 'sentinel';

export async function startCheckout(plan: PaidPlan): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Please sign in to subscribe.');

  const response = await fetch('/api/billing/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });

  const body = (await response.json()) as { url?: string; error?: string };
  if (!response.ok) throw new Error(body.error ?? 'Checkout failed.');
  if (!body.url) throw new Error('Checkout session did not return a URL.');

  window.location.href = body.url;
}

export async function syncBillingAfterCheckout(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return false;

  // Retry up to 3 times with increasing delay — Stripe may need a moment
  // to finalize the subscription after checkout completes.
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }

    const response = await fetch('/api/billing/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) continue;
    const body = (await response.json()) as { synced?: boolean };
    if (body.synced === true) return true;
  }

  return false;
}

export async function openBillingPortal(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Please sign in to manage billing.');

  const response = await fetch('/api/billing/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const body = (await response.json()) as { url?: string; error?: string };
  if (!response.ok) throw new Error(body.error ?? 'Billing portal failed.');
  if (!body.url) throw new Error('Billing portal did not return a URL.');

  window.location.href = body.url;
}
