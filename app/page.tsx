'use client';

import { useLanguageStore, translations } from '@/lib/language';
import { Sparkles, Lightbulb, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Varian animasi biar kodingan di bawah nggak kepanjangan
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="min-h-screen relative">
      {/* Background Glow - Bikin ambience makin pro */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-40 z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-6 glass rounded-full text-sm font-medium text-primary-400 border border-primary-500/20"
            >
              ✨ AI-Powered Creativity
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
              <span className="text-gradient leading-tight">{t.heroTitle}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/brainstorm">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-primary-500 via-pink-500 to-purple-500 rounded-full font-bold text-lg flex items-center gap-3 transition-all"
                >
                  {t.getStarted}
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
              
              <Link href="/community">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass rounded-full font-bold text-lg hover:bg-white/10 border border-white/10 transition-all"
                >
                  {t.learnMore}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Lightbulb />, title: t.feature1Title, desc: t.feature1Desc, color: "from-primary-500 to-pink-500" },
              { icon: <Sparkles />, title: t.feature2Title, desc: t.feature2Desc, color: "from-purple-500 to-blue-500" },
              { icon: <Users />, title: t.feature3Title, desc: t.feature3Desc, color: "from-pink-500 to-purple-500" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, borderColor: "rgba(255,255,255,0.2)" }}
                className="glass p-10 rounded-[2.5rem] border border-white/5 transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  {i === 0 ? <Lightbulb className="w-8 h-8" /> : i === 1 ? <Sparkles className="w-8 h-8" /> : <Users className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-32 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-border group"
          >
            <div className="gradient-border-content p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Ready to Create Something <br/>
                <span className="text-gradient">Original</span>?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join thousands of creators breaking creative boundaries and turning ideas into reality.
              </p>
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full font-black text-xl shadow-xl shadow-primary-500/20"
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
