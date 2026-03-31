import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  role: 'creator' | 'investor' | 'company';
  bio: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  full_content: any;
  category: 'story' | 'game' | 'business' | 'tech' | 'art';
  tags: string[];
  ai_generated: boolean;
  generation_metadata: any;
  novelty_score: number;
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};

export type Vote = {
  id: string;
  project_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
};

export type Comment = {
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles?: Profile;
};

export type AIGeneration = {
  id: string;
  user_id: string;
  project_id: string | null;
  prompt: string;
  model_used: string;
  response: any;
  novelty_score: number;
  created_at: string;
};
