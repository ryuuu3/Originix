'use client';

import { useState, useEffect, Suspense } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Save, RefreshCw, TrendingUp } from 'lucide-react';

// --- KOMPONEN KONTEN (Logika Utama) ---
function CreateContent() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState<any>(null);
  const [seedIdea, setSeedIdea] = useState('');
  const [category, setCategory] = useState('story');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);

  useEffect(() => {
    // Ambil data user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Ambil seed dari query params URL (?seed=...)
    const seed = searchParams.get('seed');
    if (seed) {
      setSeedIdea(decodeURIComponent(seed));
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!seedIdea.trim()) return;
    
    setLoading(true);
    setGenerated(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedIdea, category }),
      });
      
      const data = await response.json();
      setGenerated(data);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: generated.title,
          description: generated.description,
          full_content: { concept: generated.fullConcept },
          category,
          ai_generated: true,
          generation_metadata: { seedIdea, timestamp: new Date().toISOString() },
          novelty_score: generated.noveltyScore,
          status: 'published',
        });

      if (error) throw error;

      alert(t.projectPublished);
      router.push('/community');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save project');
    }
  };

  const categories = [
    { value: 'story', label: t.story, icon: '📖' },
    { value: 'game', label: t.game, icon: '🎮' },
    { value: 'business', label: t.business, icon: '💼' },
    { value: 'tech', label: t.tech, icon: '🔬' },
    { value: 'art', label: t.art, icon: '🎨' },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t.createTitle}</span>
          </h1>
          <p className="text-gray-400 text-lg">{t.createSubtitle}</p>
        </div>

        {/* Input Form */}
        <div className="glass-strong p-8 rounded-2xl mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.seedIdea}
              </label>
              <textarea
                value={seedIdea}
                onChange={(e) => setSeedIdea(e.target.value)}
                placeholder={t.brainstormPlaceholder}
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all min-h-[120px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                {t.category}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      category === cat.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/10 glass hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium text-white">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!seedIdea.trim() || loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.generateConcept}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Result */}
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-xl border-2 border-primary-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <TrendingUp className="w-6 h-6 text-primary-400" />
                  <span className="font-semibold text-lg">{t.noveltyScore}</span>
                </div>
                <div className="text-3xl font-bold text-gradient">
                  {generated.noveltyScore}%
                </div>
              </div>
              <div className="mt-4 bg-dark-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${generated.noveltyScore}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary-500 to-pink-500"
                />
              </div>
            </div>

            <div className="glass-strong p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 text-gradient">{generated.title}</h2>
              <p className="text-xl text-gray-300 leading-relaxed">{generated.description}</p>
            </div>

            <div className="glass p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-primary-400">
                {language === 'en' ? 'Full Concept' : 'Konsep Lengkap'}
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{generated.fullConcept}</p>
            </div>

            <div className="flex gap-4">
              <button onClick={handleGenerate} className="flex-1 px-6 py-4 glass rounded-xl hover:glass-strong transition-all flex items-center justify-center gap-2 text-white">
                <RefreshCw className="w-5 h-5" /> {t.regenerate}
              </button>
              <button onClick={handleSaveAndPublish} className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg">
                <Save className="w-5 h-5" /> {t.saveAndPublish}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// --- KOMPONEN PAGE (Wrapper Suspense) ---
export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">Loading Creative Engine...</p>
        </div>
      </div>
    }>
      <CreateContent />
    </Suspense>
  );
}
