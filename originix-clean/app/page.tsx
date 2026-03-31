'use client';

import { useLanguageStore, translations } from '@/lib/language';
import { Sparkles, Lightbulb, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">{t.heroTitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/brainstorm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full font-semibold text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                >
                  {t.getStarted}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/community">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass rounded-full font-semibold text-lg hover:glass-strong transition-all"
                >
                  {t.learnMore}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-dark-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.feature1Title}</h3>
              <p className="text-gray-400">{t.feature1Desc}</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.feature2Title}</h3>
              <p className="text-gray-400">{t.feature2Desc}</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.feature3Title}</h3>
              <p className="text-gray-400">{t.feature3Desc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="gradient-border"
          >
            <div className="gradient-border-content p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Create Something <span className="text-gradient">Original</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of creators breaking creative boundaries
              </p>
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full font-bold text-lg"
                >
                  {t.getStarted}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
