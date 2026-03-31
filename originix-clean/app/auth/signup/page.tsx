'use client';

import { useState } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if username is taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error(language === 'en' ? 'Username already taken' : 'Username sudah dipakai');
      }

      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Success message
      alert(t.signupSuccess);
      router.push('/auth/signin');
    } catch (error: any) {
      setError(error.message || t.signupError);
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
            <span className="text-gradient">{t.signUp}</span>
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Create your Originix account' : 'Buat akun Originix kamu'}
          </p>
        </div>

        <div className="glass-strong p-8 rounded-2xl">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.username}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="username123"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Lowercase letters, numbers, and underscores only' : 'Huruf kecil, angka, dan underscore saja'}
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.fullName}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Minimum 6 characters' : 'Minimal 6 karakter'}
              </p>
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
                t.signUp
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {t.alreadyHaveAccount}{' '}
            <Link href="/auth/signin" className="text-primary-400 hover:text-primary-300 font-semibold">
              {t.signIn}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
