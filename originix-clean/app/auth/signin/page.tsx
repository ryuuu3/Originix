'use client';

import { useState } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/community');
    } catch (error: any) {
      setError(error.message || t.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">{t.signIn}</span>
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Welcome back to Originix' : 'Selamat datang kembali di Originix'}
          </p>
        </div>

        <div className="glass-strong p-8 rounded-2xl">
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.loading}
                </>
              ) : (
                t.signIn
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {t.dontHaveAccount}{' '}
            <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 font-semibold">
              {t.signUp}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
