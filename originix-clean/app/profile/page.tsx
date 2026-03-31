'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { supabase, Profile, Project } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit2, Save, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function ProfilePage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      setUser(user);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
        setBio(profileData.bio || '');
      }

      // Load user's projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setEditing(false);
      loadProfile();
      alert(language === 'en' ? 'Profile updated!' : 'Profil diperbarui!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(language === 'en' ? 'Failed to update profile' : 'Gagal memperbarui profil');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = {
    projects: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    aiGenerated: projects.filter(p => p.ai_generated).length,
    avgNovelty: projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => acc + (p.novelty_score || 0), 0) / projects.length)
      : 0,
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="glass-strong p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-pink-500 rounded-2xl flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        {t.fullName}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500 transition-all min-h-[100px] resize-none"
                        placeholder={language === 'en' ? 'Tell us about yourself...' : 'Ceritakan tentang dirimu...'}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-semibold flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {t.save}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFullName(profile?.full_name || '');
                          setBio(profile?.bio || '');
                        }}
                        className="px-6 py-2 glass rounded-xl hover:glass-strong transition-all"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-1">{profile?.full_name || profile?.username}</h1>
                        <p className="text-gray-400">@{profile?.username}</p>
                      </div>
                      <button
                        onClick={() => setEditing(true)}
                        className="p-2 glass rounded-lg hover:glass-strong transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>

                    {profile?.bio && (
                      <p className="text-gray-300 mb-4">{profile.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {language === 'en' ? 'Joined' : 'Bergabung'} {formatDistanceToNow(new Date(profile?.created_at || ''), { addSuffix: true })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{stats.projects}</div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Total Projects' : 'Total Proyek'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{stats.published}</div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Published' : 'Dipublikasikan'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{stats.aiGenerated}</div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'AI Generated' : 'Dibuat AI'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">{stats.avgNovelty}%</div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Avg Originality' : 'Rata-rata Originalitas'}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="glass-strong p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {language === 'en' ? 'Your Projects' : 'Proyek Kamu'}
              </h2>
              <Link href="/create">
                <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {language === 'en' ? 'Create New' : 'Buat Baru'}
                </button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-6">
                  {language === 'en' ? 'No projects yet. Start creating!' : 'Belum ada proyek. Mulai berkreasi!'}
                </p>
                <Link href="/brainstorm">
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-pink-500 rounded-xl font-semibold">
                    {language === 'en' ? 'Get Started' : 'Mulai Sekarang'}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Link key={project.id} href={`/project/${project.id}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="glass p-6 rounded-xl hover:glass-strong transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg line-clamp-1 flex-1">
                          {project.title}
                        </h3>
                        {project.status === 'draft' && (
                          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-400">
                            {t.draft}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {project.ai_generated && (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                        {project.novelty_score && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {project.novelty_score}%
                          </span>
                        )}
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
