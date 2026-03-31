# 🚀 Deployment Guide - Originix

Complete step-by-step guide to deploy Originix to production.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] GitHub account
- [ ] Vercel account ([sign up free](https://vercel.com))
- [ ] Supabase account ([sign up free](https://supabase.com))
- [ ] Grok API key ([get from x.ai](https://x.ai))
- [ ] Code pushed to GitHub repository

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: originix-production
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
4. Wait for project to be ready (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire SQL schema from the main README.md
4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. Verify tables are created: Go to **Table Editor** and check

### 1.3 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIs...
   service_role key: eyJhbGciOiJIUzI1NiIs... (keep this SECRET!)
   ```

### 1.4 Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `https://yourdomain.vercel.app` (update after deployment)
   - **Redirect URLs**: Add:
     - `https://yourdomain.vercel.app/**`
     - `http://localhost:3000/**` (for local development)

3. Go to **Authentication** → **Email Templates**
4. Customize email templates (optional but recommended)

---

## 🔑 Step 2: Setup Grok API

### 2.1 Get API Key

1. Go to [x.ai](https://x.ai/)
2. Sign up / Log in
3. Navigate to API section
4. Generate new API key
5. **IMPORTANT**: Copy and save it immediately (shown only once!)

### 2.2 Test API Key (Optional)

```bash
curl https://api.x.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "grok-beta",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

If you get a response, your API key works! ✅

---

## 📦 Step 3: Prepare Code for Deployment

### 3.1 Initialize Git (if not done)

```bash
cd originix
git init
git add .
git commit -m "Initial commit - Originix v1.0"
```

### 3.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/)
2. Click **"New Repository"**
3. Name: `originix`
4. Visibility: Public or Private (your choice)
5. **DON'T** initialize with README (we already have one)
6. Click **"Create Repository"**

### 3.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/originix.git
git branch -M main
git push -u origin main
```

Verify: Refresh your GitHub repo page - you should see all files! ✅

---

## 🌐 Step 4: Deploy to Vercel

### 4.1 Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `originix` repository
5. Click **"Import"**

### 4.2 Configure Project Settings

On the import page:

1. **Framework Preset**: Next.js (should be auto-detected)
2. **Root Directory**: `./` (leave as is)
3. **Build Command**: `npm run build` (auto-filled)
4. **Install Command**: `npm install` (auto-filled)

### 4.3 Add Environment Variables

Click **"Environment Variables"** section and add:

| Name | Value | Notes |
|------|-------|-------|
| `GROK_API_KEY` | `your_grok_api_key` | From Step 2 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | From Step 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | From Step 1.3 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | From Step 1.3 (SECRET!) |
| `NEXT_PUBLIC_APP_URL` | `https://originix.vercel.app` | Your Vercel domain (update after) |

**IMPORTANT**: 
- Click **"Production"**, **"Preview"**, and **"Development"** for each variable
- DO NOT share `SUPABASE_SERVICE_ROLE_KEY` publicly!

### 4.4 Deploy!

1. Click **"Deploy"**
2. Wait ~2-5 minutes for build to complete
3. Once done, you'll see: 🎉 **"Congratulations!"**

---

## ✅ Step 5: Post-Deployment Configuration

### 5.1 Get Your Vercel URL

After deployment, Vercel gives you a URL like:
```
https://originix-xxxxx.vercel.app
```

Copy this URL!

### 5.2 Update Supabase Auth URLs

1. Go back to **Supabase Dashboard**
2. **Authentication** → **URL Configuration**
3. Update:
   - **Site URL**: `https://originix-xxxxx.vercel.app`
   - **Redirect URLs**: Add `https://originix-xxxxx.vercel.app/**`
4. Click **"Save"**

### 5.3 Update Environment Variables

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL`
4. Change to your actual Vercel URL: `https://originix-xxxxx.vercel.app`
5. Click **"Save"**
6. **Redeploy**: Go to **Deployments** tab → Click **"..."** → **"Redeploy"**

---

## 🧪 Step 6: Test Your Deployment

### 6.1 Basic Functionality Test

Visit your site: `https://originix-xxxxx.vercel.app`

Test these flows:

- [ ] **Landing page loads** ✅
- [ ] **Sign Up**:
  1. Click "Sign Up"
  2. Enter email, username, password, full name
  3. Submit
  4. Check email for confirmation link
  5. Click confirmation link
- [ ] **Sign In**:
  1. Use your credentials
  2. Should redirect to Community page
- [ ] **Brainstorm** (Feature 1):
  1. Go to Brainstorm page
  2. Enter seed idea
  3. Click "Get Inspiration"
  4. Should see suggestions
- [ ] **AI Creator** (Feature 3):
  1. Go to Create page
  2. Enter seed idea + select category
  3. Click "Generate Concept"
  4. Wait for AI to generate (~10-30 seconds)
  5. Should see generated concept with novelty score
- [ ] **Publish to Community**:
  1. From AI Creator, click "Save & Publish"
  2. Should redirect to Community page
  3. Should see your project listed
- [ ] **Community** (Feature 2):
  1. Browse projects
  2. Click on a project
  3. Should open detail page
  4. Try upvoting
  5. Try commenting
- [ ] **Profile**:
  1. Go to Profile page
  2. Should see your stats
  3. Try editing profile
  4. Save changes

### 6.2 Performance Test

Use [Lighthouse](https://pagespeed.web.dev/):
1. Enter your Vercel URL
2. Click "Analyze"
3. Aim for:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

### 6.3 Mobile Test

Test on mobile devices:
- iOS Safari
- Android Chrome
- Responsive design should work smoothly

---

## 🎨 Step 7: Custom Domain (Optional)

### 7.1 Purchase Domain

Buy a domain from:
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Google Domains](https://domains.google/)

Example: `originix.com`

### 7.2 Configure in Vercel

1. **Vercel Dashboard** → Your Project
2. **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain: `originix.com`
5. Click **"Add"**
6. Vercel will show DNS records

### 7.3 Update DNS

In your domain registrar (e.g., Namecheap):

1. Go to DNS settings
2. Add these records:

**For root domain (originix.com):**
```
Type: A
Host: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

3. Save and wait for propagation (~5 minutes to 48 hours)

### 7.4 Update Environment Variables

1. Update `NEXT_PUBLIC_APP_URL` to `https://originix.com`
2. Update Supabase Auth URLs to include new domain
3. Redeploy

---

## 🔧 Step 8: Monitoring & Maintenance

### 8.1 Setup Analytics (Optional)

**Vercel Analytics** (Built-in):
1. **Vercel Dashboard** → Your Project
2. **Analytics** tab
3. Click **"Enable"**
4. Free tier: 100k page views/month

**Google Analytics** (Optional):
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`

### 8.2 Error Monitoring

**Vercel Logs**:
- Go to **Deployments** → Click deployment → **Function Logs**
- Check for errors

**Sentry** (Recommended for production):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 8.3 Regular Backups

**Supabase**:
1. Go to **Database** → **Backups**
2. Backups are automatic (check schedule)
3. Download manual backup:
   ```bash
   pg_dump "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" > backup.sql
   ```

---

## 🐛 Troubleshooting

### Issue: Build Failed

**Symptoms**: Red ❌ on Vercel deployment

**Solutions**:
1. Check build logs in Vercel
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies
3. Fix locally first:
   ```bash
   npm run build
   # Fix any errors
   git add .
   git commit -m "Fix build errors"
   git push
   ```

### Issue: "Invalid API key" on Grok calls

**Symptoms**: AI generation fails

**Solutions**:
1. Verify `GROK_API_KEY` in Vercel environment variables
2. Check if key has correct format
3. Regenerate key from x.ai if needed
4. Redeploy after updating

### Issue: Supabase connection failed

**Symptoms**: Cannot sign up/login, database errors

**Solutions**:
1. Check Supabase project is active
2. Verify environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Check if database schema was run correctly
4. Verify RLS policies are enabled

### Issue: Authentication redirect loop

**Symptoms**: After login, keeps redirecting back to login

**Solutions**:
1. Check Supabase Auth URLs are correct
2. Add your Vercel domain to allowed redirect URLs
3. Clear browser cookies
4. Check if `NEXT_PUBLIC_APP_URL` is correct

### Issue: 500 Internal Server Error

**Symptoms**: Random 500 errors on API routes

**Solutions**:
1. Check Function Logs in Vercel
2. Verify all environment variables are set
3. Check if Grok API rate limit exceeded
4. Increase timeout in `vercel.json`:
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

---

## 📊 Performance Optimization

### Database Optimization

1. Add indexes if needed:
```sql
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_novelty_score ON public.projects(novelty_score DESC);
```

2. Enable Supabase connection pooling (for high traffic)

### Caching Strategy

Add caching to API routes:
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Image Optimization

Use Next.js Image component:
```typescript
import Image from 'next/image';

<Image 
  src={profile.avatar_url} 
  alt="Avatar"
  width={128}
  height={128}
/>
```

---

## 🎉 Success Checklist

Before announcing your launch:

- [ ] All pages load correctly
- [ ] Sign up/login works
- [ ] AI generation works
- [ ] Projects can be published to community
- [ ] Voting and comments work
- [ ] Profile page functional
- [ ] Mobile responsive
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Performance optimized (Lighthouse >80)

---

## 🚀 You're Live!

Congratulations! Originix is now live at `https://originix.vercel.app` (or your custom domain).

Share it with the world! 🌍

---

## 📞 Need Help?

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/originix/issues)
- **Discord**: Join our community (link in main README)
- **Email**: support@originix.com

---

Good luck with your launch! 🎊
