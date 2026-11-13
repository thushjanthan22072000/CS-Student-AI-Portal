import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Brain, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);

    if (error) setError(error);
    setLoading(false);
    // On success, the auth context updates; email confirmation may still be required.
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 -right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <a href="#" className="inline-flex items-center gap-2 font-bold text-xl">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30">
              <Brain className="w-6 h-6" />
            </span>
            <span className="text-gray-900">CS<span className="gradient-text">Learn</span></span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Log In
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {mode === 'signup' ? 'Create your free account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'signup'
              ? 'Start learning Python and AI — all courses are free.'
              : 'Log in to continue your learning journey.'}
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-100 text-error-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Please wait...</>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Log In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            All courses are 100% free. No credit card needed.
          </p>
        </div>
      </div>
    </div>
  );
}
