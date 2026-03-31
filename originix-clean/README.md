# 🚀 Originix - AI-Powered Creative Platform

**Where Ideas Become Reality**

Originix is a revolutionary platform that helps creators break free from creative blocks. Generate truly original concepts with AI, share them with a vibrant community, and connect with investors to bring ideas to life.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

---

## 🌟 Features

### 1️⃣ **AI-Powered Brainstorming**
- Get intelligent suggestions and creative frameworks
- Discover unexplored angles for your ideas
- Reference similar existing works
- Gateway to deeper concept generation

### 2️⃣ **AI Creativity Engine**
- **Multi-Angle Generation**: Synthesizes concepts from logical, emotional, and wildcard perspectives
- **Originality Scoring**: Built-in novelty detection ensures unique ideas
- **Category Support**: Stories, games, business models, tech concepts, and art
- **Grok API Integration**: Powered by cutting-edge AI technology

### 3️⃣ **Community Platform**
- Share and publish your concepts
- Vote and discover trending ideas
- Comment and collaborate
- Connect with investors and companies
- Monetization pathway for creators

### 🌍 **Bilingual Support**
- Full English and Indonesian language support
- Seamless language switching

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: [Grok API](https://x.ai/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn or pnpm
- Supabase account ([sign up free](https://supabase.com/))
- Grok API key ([get yours](https://x.ai/))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/originix.git
cd originix
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Grok API
GROK_API_KEY=your_grok_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to SQL Editor
4. Run the following SQL schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'creator',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    full_content JSONB,
    category TEXT,
    tags TEXT[],
    ai_generated BOOLEAN DEFAULT false,
    generation_metadata JSONB,
    novelty_score FLOAT,
    status TEXT DEFAULT 'draft',
    visibility TEXT DEFAULT 'public',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Comments table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generations history
CREATE TABLE public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    model_used TEXT DEFAULT 'grok',
    response JSONB,
    novelty_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborations table
CREATE TABLE public.collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (see full schema in documentation)
-- ... (add all RLS policies from earlier)

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(project_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.projects
    SET view_count = view_count + 1
    WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql;
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/originix.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add all variables from `.env.local`
   - Make sure to add them in Vercel's project settings
6. Click "Deploy"

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add GROK_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

### Post-Deployment Checklist
- [ ] Update `NEXT_PUBLIC_APP_URL` in environment variables to your production URL
- [ ] Configure Supabase Auth redirect URLs (add your Vercel domain)
- [ ] Test all features in production
- [ ] Set up custom domain (optional)

---

## 📁 Project Structure

```
originix/
├── app/
│   ├── api/
│   │   ├── brainstorm/
│   │   │   └── route.ts          # Brainstorm API endpoint
│   │   └── generate/
│   │       └── route.ts          # AI generation endpoint
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx          # Sign in page
│   │   └── signup/
│   │       └── page.tsx          # Sign up page
│   ├── brainstorm/
│   │   └── page.tsx              # Feature 1: Brainstorming
│   ├── community/
│   │   └── page.tsx              # Feature 2: Community feed
│   ├── create/
│   │   └── page.tsx              # Feature 3: AI Creator
│   ├── profile/
│   │   └── page.tsx              # User profile page
│   ├── project/
│   │   └── [id]/
│   │       └── page.tsx          # Project detail page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   └── Navigation.tsx            # Navigation bar component
├── lib/
│   ├── supabase.ts               # Supabase client & types
│   ├── language.ts               # i18n support (EN/ID)
│   └── grok.ts                   # Grok API integration
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Red gradient (#ef4444 - #dc2626)
- **Secondary**: Pink to Purple (#ec4899 - #a855f7)
- **Dark**: Various shades (#030712 - #1f2937)
- **Glass**: Frosted glass effect with backdrop blur

### Typography
- System fonts with fallback to sans-serif
- Gradient text for headings using `text-gradient` class

### Animations
- Framer Motion for page transitions
- Custom keyframes for gradient, float, and glow effects
- Smooth hover states on interactive elements

---

## 🔐 Authentication Flow

1. User signs up with email, password, username, and full name
2. Supabase Auth creates user account
3. Trigger automatically creates profile in `profiles` table
4. User receives confirmation email
5. User signs in and gets redirected to community page

---

## 🤖 AI Generation Flow

### Brainstorm (Feature 1)
1. User inputs seed idea
2. Grok API analyzes idea
3. Returns: existing works, unusual angles, frameworks, next steps
4. User can proceed to AI Creator

### AI Creator (Feature 3)
1. User inputs seed idea + selects category
2. System generates concept from **3 angles**:
   - **Logical**: Structured, coherent world-building
   - **Emotional**: Character-driven, emotional depth
   - **Wildcard**: Unconventional, absurd, creative
3. AI synthesizes all 3 angles into one coherent concept
4. Novelty score calculated (0-100%)
5. User can regenerate or publish to community

---

## 📊 Database Schema

### Tables
- `profiles`: User profiles (extends auth.users)
- `projects`: Creative concepts/projects
- `votes`: Upvote/downvote system
- `comments`: Project comments with threading support
- `ai_generations`: History of AI generations
- `collaborations`: Investor-creator connections

### Key Relationships
- User → Projects (one-to-many)
- Project → Votes (one-to-many)
- Project → Comments (one-to-many)
- User → Collaborations (many-to-many via projects)

---

## 🌐 API Endpoints

### `/api/brainstorm` (POST)
Get brainstorming suggestions

**Request:**
```json
{
  "seedIdea": "A time travel story about economics"
}
```

**Response:**
```json
{
  "existingWorks": ["...", "...", "..."],
  "unusualAngles": ["...", "...", "..."],
  "frameworks": ["...", "..."],
  "nextSteps": "..."
}
```

### `/api/generate` (POST)
Generate concept with AI

**Request:**
```json
{
  "seedIdea": "A time travel story about economics",
  "category": "story"
}
```

**Response:**
```json
{
  "title": "Generated Title",
  "description": "Elevator pitch...",
  "fullConcept": "Detailed concept...",
  "noveltyScore": 87
}
```

---

## 🔧 Configuration

### Supabase RLS Policies
Row Level Security is enabled on all tables. Key policies:
- Public projects are viewable by everyone
- Users can only modify their own content
- Authenticated users can vote and comment

### Grok API Configuration
Uses `grok-beta` model with:
- Temperature: 0.7-0.9 (configurable)
- Multi-turn conversations for synthesis
- JSON response format for structured data

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Supabase connection failed**
- Check if `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Verify Supabase project is active

**Issue: Grok API errors**
- Verify `GROK_API_KEY` is valid
- Check API rate limits
- Ensure proper error handling in code

**Issue: Authentication not working**
- Check Supabase Auth settings
- Verify email templates are configured
- Ensure redirect URLs are set correctly

**Issue: Novelty score always 0**
- This is expected in MVP - requires vector database integration
- Currently uses simplified heuristic

---

## 🚧 Future Enhancements

### Phase 2
- [ ] Vector database integration (Pinecone/Weaviate)
- [ ] Real similarity scoring against existing concepts
- [ ] Advanced filtering and search
- [ ] Tags and categories
- [ ] User following system

### Phase 3
- [ ] Direct messaging between investors and creators
- [ ] Collaboration tools
- [ ] Payment integration
- [ ] Project milestones and tracking
- [ ] Analytics dashboard

### Phase 4
- [ ] Mobile apps (React Native)
- [ ] API for third-party integrations
- [ ] AI model fine-tuning on successful concepts
- [ ] Blockchain-based IP protection

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Grok AI](https://x.ai/) - AI generation
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

## 📞 Support

For support, email support@originix.com or join our Discord community.

---

## 🌟 Star this repo if you find it useful!

Made with ❤️ by the Originix Team
```
