// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { profile, loading, error, loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, go to dashboard
  if (profile) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Thinkers' Portal</h1>
              <p className="text-xs font-medium">American University of Yangon</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Think Beyond.<br />Lead Forward.
          </h2>
          <p className="text-sm text-white/70">
            Welcome to the AUY portal.WUahahahaha Manage academics, track attendance, view results, and stay connected.
          </p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-slate-500">Sign in to access your AUY portal</p>

          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600">{error}</div>}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@auy.edu.mm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border rounded-xl py-3 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-300 focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full rounded-xl bg-gradient-to-r from-navy-600 to-navy-800 py-3 text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl bg-white py-3 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}