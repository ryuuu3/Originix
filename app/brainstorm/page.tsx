'use client';

import { useState } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Loader2 } from 'lucide-react';

export default function BrainstormPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  
  const [seedIdea, setSeedIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  const handleBrainstorm = async () => {
    if (!seedIdea.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedIdea }),
      });
      
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Brainstorm error:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCreate = () => {
    // Pass seed idea to create page via query params
    router.push(`/create?seed=${encodeURIComponent(seedIdea)}`);
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-pink-500 rounded-2xl mb-6">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t.brainstormTitle}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {language === 'en' 
                ? 'Get inspired with intelligent suggestions before creating'
                : 'Dapatkan inspirasi dengan saran cerdas sebelum membuat'}
            </p>
          </div>

          {/* Input Section */}
          <div className="glass-strong p-8 rounded-2xl mb-8">
            <textarea
              value={seedIdea}
              onChange={(e) => setSeedIdea(e.target.value)}
              placeholder={t.brainstormPlaceholder}
              className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all min-h-[150px] resize-none"
            />
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleBrainstorm}
                disabled={!seedIdea.trim() || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  <>
                    {t.brainstormButton}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suggestions Display */}
          {suggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Existing Works */}
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-primary-400">
                  {language === 'en' ? '📚 Similar Existing Works' : '📚 Karya Serupa yang Ada'}
                </h3>
                <ul className="space-y-2">
                  {suggestions.existingWorks?.map((work: string, idx: number) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      {work}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unusual Angles */}
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-purple-400">
                  {language === 'en' ? '🎯 Unexplored Angles' : '🎯 Sudut Pandang Belum Terjamah'}
                </h3>
                <ul className="space-y-2">
                  {suggestions.unusualAngles?.map((angle: string, idx: number) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      {angle}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Frameworks */}
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-pink-400">
                  {language === 'en' ? '🛠️ Creative Frameworks' : '🛠️ Framework Kreatif'}
                </h3>
                <ul className="space-y-2">
                  {suggestions.frameworks?.map((framework: string, idx: number) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-pink-500">•</span>
                      {framework}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="glass-strong p-6 rounded-xl border-2 border-primary-500/30">
                <h3 className="text-xl font-bold mb-3">
                  {language === 'en' ? '🚀 Next Steps' : '🚀 Langkah Selanjutnya'}
                </h3>
                <p className="text-gray-300 mb-6">{suggestions.nextSteps}</p>
                
                <button
                  onClick={proceedToCreate}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center justify-center gap-2"
                >
                  {t.proceedToCreate}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Or skip to create */}
          {!suggestions && seedIdea && !loading && (
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                {language === 'en' ? 'Or skip brainstorming and' : 'Atau lewati brainstorming dan'}
              </p>
              <button
                onClick={proceedToCreate}
                className="px-6 py-3 glass rounded-xl hover:glass-strong transition-all"
              >
                {t.proceedToCreate}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
