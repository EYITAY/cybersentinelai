import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function getUserFromBearerToken(authorization?: string): Promise<User> {
  if (!authorization?.startsWith('Bearer ')) {
    throw new Error('Missing Authorization bearer token');
  }
  const token = authorization.slice('Bearer '.length).trim();
  if (!token) throw new Error('Missing access token');

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error('Invalid or expired session token');
  }
  return data.user;
}
