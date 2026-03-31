'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { supabase, Project } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Search, ArrowUp, MessageCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'newest'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('status', 'published')
        .eq('visibility', 'public');

      // Apply filters
      if (filter === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVoteCount = async (projectId: string) => {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('vote_type', 'upvote');
    
    return count || 0;
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t.communityTitle}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {language === 'en'
                ? 'Discover, vote, and collaborate on creative concepts'
                : 'Temukan, vote, dan kolaborasi pada konsep kreatif'}
            </p>
          </div>

          {/* Filters and Search */}
          <div className="glass-strong p-6 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {t.allProjects}
                </button>
                <button
                  onClick={() => setFilter('trending')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === 'trending'
                      ? 'bg-primary-500 text-white'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  {t.trending}
                </button>
                <button
                  onClick={() => setFilter('newest')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === 'newest'
                      ? 'bg-primary-500 text-white'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {t.newest}
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-400">{t.loading}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} language={language} />
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-20 glass rounded-2xl">
              <p className="text-xl text-gray-400">
                {language === 'en' ? 'No projects found' : 'Tidak ada proyek ditemukan'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCard({ project, language }: { project: Project; language: 'en' | 'id' }) {
  const t = translations[language];
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    loadVoteCount();
  }, []);

  const loadVoteCount = async () => {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .eq('vote_type', 'upvote');
    
    setVoteCount(count || 0);
  };

  const categoryIcons: Record<string, string> = {
    story: '📖',
    game: '🎮',
    business: '💼',
    tech: '🔬',
    art: '🎨',
  };

  return (
    <Link href={`/project/${project.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass p-6 rounded-2xl hover:glass-strong transition-all cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
              {categoryIcons[project.category] || '💡'}
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary-400 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500">
                {t.by} {project.profiles?.username || 'Unknown'}
              </p>
            </div>
          </div>
          
          {project.ai_generated && (
            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">
              AI
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            <span>{voteCount} {t.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{project.view_count || 0} {t.views}</span>
          </div>
          {project.novelty_score && (
            <div className="ml-auto px-3 py-1 bg-primary-500/20 rounded-full text-primary-400 font-semibold">
              {project.novelty_score}% {language === 'en' ? 'Original' : 'Original'}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-600">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
