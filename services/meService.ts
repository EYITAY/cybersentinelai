import { supabase } from './supabaseClient';

export interface MeResponse {
  email: string | null;
  userId: string;
  plan: 'trial' | 'expired' | 'greenhorn' | 'vigilante' | 'sentinel';
  periodStart: string;
  scansUsed: number;
  scansPerMonth: number;
  allowedPersonas: string[];
  trialEndsAt: string | null;
  trialDaysLeft: number;
}

export async function fetchMe(): Promise<MeResponse> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not signed in');

  const res = await fetch('/api/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await res.json()) as MeResponse & { error?: string };
  if (!res.ok) throw new Error(body.error ?? 'Failed to load account');
  return body;
}
