'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, translations } from '@/lib/language';
import { supabase, Project, Comment } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  Edit, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Eye,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadProject();
    loadComments();
    checkUserVote();
    incrementViewCount();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (username, full_name, avatar_url)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
      
      // Load vote count
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('vote_type', 'upvote');
      
      setVoteCount(count || 0);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq('project_id', projectId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });
    
    setComments(data || []);
  };

  const checkUserVote = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();
    
    if (data) setUserVote(data.vote_type as 'upvote' | 'downvote');
  };

  const incrementViewCount = async () => {
    await supabase.rpc('increment_view_count', { project_uuid: projectId });
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    try {
      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
        
        setUserVote(null);
        setVoteCount(prev => voteType === 'upvote' ? prev - 1 : prev);
      } else {
        // Add or update vote
        await supabase
          .from('votes')
          .upsert({
            project_id: projectId,
            user_id: user.id,
            vote_type: voteType,
          });
        
        setUserVote(voteType);
        if (voteType === 'upvote') {
          setVoteCount(prev => userVote === 'downvote' ? prev + 1 : prev + 1);
        }
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          project_id: projectId,
          user_id: user.id,
          content: commentText,
        });

      setCommentText('');
      loadComments();
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(language === 'en' ? 'Link copied to clipboard!' : 'Link disalin ke clipboard!');
  };

  const handleDelete = async () => {
    if (!confirm(language === 'en' ? 'Delete this project?' : 'Hapus proyek ini?')) return;

    try {
      await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      router.push('/community');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <Link href="/community">
            <button className="px-6 py-3 bg-primary-500 rounded-xl">
              Back to Community
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    story: '📖',
    game: '🎮',
    business: '💼',
    tech: '🔬',
    art: '🎨',
  };

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="glass-strong p-8 rounded-2xl mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`p-2 rounded-lg transition-all ${
                    userVote === 'upvote'
                      ? 'bg-primary-500 text-white'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <span className="font-bold text-xl">{voteCount}</span>
                <button
                  onClick={() => handleVote('downvote')}
                  className={`p-2 rounded-lg transition-all ${
                    userVote === 'downvote'
                      ? 'bg-red-500 text-white'
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    {categoryIcons[project.category] || '💡'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gradient">
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{t.by}</span>
                      <span className="text-primary-400">{project.profiles?.username}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.ai_generated && (
                    <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {t.generatedWith}
                    </div>
                  )}
                  {project.novelty_score && (
                    <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-xs text-primary-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {project.novelty_score}% {t.originalityScore}
                    </div>
                  )}
                  <div className="px-3 py-1 glass rounded-full text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {project.view_count || 0} {t.views}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 glass rounded-lg hover:glass-strong transition-all"
                  title={t.shareProject}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {user?.id === project.user_id && (
                  <>
                    <Link href={`/project/${projectId}/edit`}>
                      <button
                        className="p-3 glass rounded-lg hover:glass-strong transition-all"
                        title={t.editProject}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="p-3 glass rounded-lg hover:bg-red-500/20 transition-all"
                      title={t.deleteProject}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Full Content */}
          <div className="glass p-8 rounded-2xl mb-6">
            <h2 className="text-2xl font-bold mb-6 text-primary-400">
              {language === 'en' ? 'Full Concept' : 'Konsep Lengkap'}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.full_content?.concept || 'No detailed content available.'}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass-strong p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              {language === 'en' ? 'Comments' : 'Komentar'} ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.addComment}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all min-h-[100px] resize-none mb-3"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-pink-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                >
                  {t.postComment}
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 glass rounded-xl text-center">
                <p className="text-gray-400 mb-3">
                  {language === 'en' ? 'Sign in to leave a comment' : 'Masuk untuk berkomentar'}
                </p>
                <Link href="/auth/signin">
                  <button className="px-6 py-2 bg-primary-500 rounded-lg font-semibold">
                    {t.signIn}
                  </button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="glass p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center">
                      {comment.profiles?.avatar_url ? (
                        <img 
                          src={comment.profiles.avatar_url} 
                          alt={comment.profiles.username}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary-400">
                          {comment.profiles?.username || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {language === 'en' ? 'No comments yet. Be the first!' : 'Belum ada komentar. Jadilah yang pertama!'}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
