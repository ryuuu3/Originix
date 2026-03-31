'use client';

import { useLanguageStore, translations } from '@/lib/language';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sparkles, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];
  
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/brainstorm', label: t.brainstorm },
    { href: '/create', label: t.create },
    { href: '/community', label: t.community },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-gradient">Originix</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 glass rounded-lg hover:glass-strong transition-all"
              title="Toggle Language"
            >
              <Globe className="w-5 h-5" />
              <span className="ml-2 text-sm">{language.toUpperCase()}</span>
            </button>

            {user ? (
              <>
                <Link href="/profile">
                  <button className="px-4 py-2 glass rounded-lg hover:glass-strong transition-all">
                    {t.profile}
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-all"
                >
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <button className="px-4 py-2 glass rounded-lg hover:glass-strong transition-all">
                    {t.signIn}
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all">
                    {t.signUp}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 glass rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={toggleLanguage}
                    className="w-full px-4 py-2 glass rounded-lg flex items-center gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'en' ? 'English' : 'Indonesia'}</span>
                  </button>
                  
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 glass rounded-lg"
                      >
                        {t.profile}
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 bg-primary-500 rounded-lg"
                      >
                        {t.signOut}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 glass rounded-lg"
                      >
                        {t.signIn}
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-500 rounded-lg"
                      >
                        {t.signUp}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
