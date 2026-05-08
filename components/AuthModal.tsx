import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useToast } from './common/Toast';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      showToast('Redirecting to Google…', 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      showToast(msg, 'error');
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Signed in successfully.', 'success');
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast('Check your email to confirm your account.', 'info');
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
        <header className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'signin'
                ? 'Access your scans and subscription.'
                : 'Start scanning with your new account.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <form onSubmit={submit} className="p-6 space-y-4">
          <button
            type="button"
            disabled={loading}
            onClick={signInWithGoogle}
            className="w-full bg-white border border-gray-300 text-gray-900 font-semibold py-3 rounded-md hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          >
            <span className="inline-flex items-center justify-center w-5 h-5" aria-hidden="true">
              <svg viewBox="0 0 48 48" className="w-5 h-5" role="img" aria-hidden="true">
                <path
                  className="text-blue-500"
                  fill="currentColor"
                  d="M24 9.5c3.23 0 6.14 1.12 8.42 2.97l6.27-6.27C34.9 2.78 29.75.5 24 .5 14.62.5 6.5 6.02 2.66 14.06l7.4 5.74C12.02 13.32 17.55 9.5 24 9.5z"
                />
                <path
                  className="text-red-500"
                  fill="currentColor"
                  d="M46.5 24.5c0-1.72-.15-3.38-.43-4.99H24v9.46h12.62c-.54 2.9-2.18 5.35-4.65 7.01l7.12 5.52c4.16-3.84 6.41-9.49 6.41-16z"
                />
                <path
                  className="text-yellow-500"
                  fill="currentColor"
                  d="M10.06 28.2a14.53 14.53 0 0 1 0-8.9l-7.4-5.74a23.5 23.5 0 0 0 0 20.38l7.4-5.74z"
                />
                <path
                  className="text-green-500"
                  fill="currentColor"
                  d="M24 47.5c5.75 0 10.9-1.9 14.57-5.15l-7.12-5.52c-2.01 1.35-4.6 2.14-7.45 2.14-6.45 0-11.98-3.82-13.94-10.3l-7.4 5.74C6.5 41.48 14.62 47.5 24 47.5z"
                />
              </svg>
            </span>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-700 flex-1" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px bg-gray-700 flex-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center text-sm text-gray-400">
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-cyan-400 hover:underline"
              >
                New here? Create an account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-cyan-400 hover:underline"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
