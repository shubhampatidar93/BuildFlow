import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onGuestAccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onGuestAccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setErrorMessage(err.message || 'Google sign-in could not be completed. You can try Guest access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(email, password, displayName.trim() || undefined);
        if (user) {
          onSuccess(user);
          onClose();
        }
      } else {
        const user = await signInWithEmail(email, password);
        if (user) {
          onSuccess(user);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Email auth error:', err);
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please double-check and try again.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMessage('An account already exists with this email. Please sign in instead.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    onGuestAccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0D1220] border border-[#263247] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6C63FF] via-[#22D3EE] to-[#34D399]" />

        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#263247]/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#22D3EE]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                {mode === 'signin' ? 'Sign in to BUILDflow' : 'Create Student Account'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Sync roadmaps, Firestore tasks & AI dialogues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-xs text-[#FB7185] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Option 1: Google Sign In */}
          <button
            id="auth-modal-google-btn"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#263247] hover:border-[#6C63FF]/50 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50"
          >
            {/* Google G Logo */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#263247]" />
            <span className="absolute bg-[#0D1220] px-3 text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
              Or with email
            </span>
          </div>

          {/* Option 2: Email & Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Shubham Patidar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111827] border border-[#263247] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111827] border border-[#263247] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111827] border border-[#263247] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#22D3EE] text-white text-xs font-bold shadow-[0_0_15px_rgba(108,99,255,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In & Sign Up */}
          <div className="text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-[#94A3B8]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#22D3EE] hover:underline font-semibold"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#94A3B8]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className="text-[#22D3EE] hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Option 3: Guest Instant Access */}
          <div className="pt-3 border-t border-[#263247]/60">
            <button
              id="auth-modal-guest-btn"
              onClick={handleGuest}
              className="w-full py-2 px-3 rounded-xl bg-[#111827]/60 hover:bg-[#111827] border border-[#263247] text-[11px] font-semibold text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#34D399]" />
              <span>Explore Instant Guest Mode (No password required)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
