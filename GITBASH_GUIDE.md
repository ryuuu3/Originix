# 🚀 Git Bash Push Guide - Originix

## Complete step-by-step untuk push ke GitHub pakai Git Bash

---

## 📋 Prerequisites

- ✅ Git Bash sudah installed ([Download](https://git-scm.com/downloads))
- ✅ GitHub account sudah dibuat
- ✅ Project Originix sudah di-extract

---

## 🎯 STEP-BY-STEP LENGKAP:

### **Step 1: Buka Git Bash**

1. Navigate ke folder `originix` yang udah di-extract
2. Right-click di dalam folder → **"Git Bash Here"**
3. Git Bash terminal akan terbuka

---

### **Step 2: Verify Git Initialized**

Cek apakah Git sudah initialized:

```bash
git status
```

✅ **Jika sudah initialized**, lo akan lihat:
```
On branch main
nothing to commit, working tree clean
```

❌ **Jika belum**, jalankan:
```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit: Originix - AI-Powered Creative Platform"
git branch -M main
```

---

### **Step 3: Create GitHub Repository**

1. Buka browser, go to: **https://github.com/new**
2. Fill in details:
   - **Repository name**: `originix`
   - **Description**: "AI-Powered Creative Platform - Where Ideas Become Reality"
   - **Visibility**: ✅ **Public** (recommended untuk Vercel free tier)
   - ❌ **JANGAN** centang "Add a README file"
   - ❌ **JANGAN** centang "Add .gitignore"
3. Click **"Create repository"**

---

### **Step 4: Copy Repository URL**

Setelah repo dibuat, GitHub akan show halaman kosong dengan instruksi.

Copy **HTTPS URL** yang muncul, contoh:
```
https://github.com/YOUR_USERNAME/originix.git
```

**PENTING**: Ganti `YOUR_USERNAME` dengan username GitHub lo!

---

### **Step 5: Add Remote & Push (Di Git Bash)**

Balik ke **Git Bash** yang masih terbuka di folder `originix`.

Jalankan command ini (ganti YOUR_USERNAME!):

```bash
# Add remote origin (ganti YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/originix.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

---

### **Step 6: Authentication**

Git Bash akan minta credentials:

#### **Option A: Personal Access Token (Recommended)**

GitHub sudah tidak support password biasa. Lo harus pakai **Personal Access Token**:

1. **Generate Token**:
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Name: `Originix Deploy`
   - Expiration: 90 days (atau custom)
   - ✅ Check: `repo` (semua permissions under repo)
   - Click **"Generate token"**
   - **COPY TOKEN IMMEDIATELY** (hanya muncul sekali!)

2. **Paste di Git Bash**:
   ```
   Username: YOUR_GITHUB_USERNAME
   Password: PASTE_YOUR_TOKEN_HERE
   ```

#### **Option B: SSH (Alternative)**

Kalau mau pakai SSH instead of HTTPS:

```bash
# Remove HTTPS remote
git remote remove origin

# Add SSH remote (ganti YOUR_USERNAME!)
git remote add origin git@github.com:YOUR_USERNAME/originix.git

# Push
git push -u origin main
```

**Note**: Lo perlu setup SSH key dulu kalau belum pernah.

---

### **Step 7: Verify Success** ✅

Kalau berhasil, lo akan lihat output seperti:

```
Enumerating objects: 30, done.
Counting objects: 100% (30/30), done.
Delta compression using up to 8 threads
Compressing objects: 100% (27/27), done.
Writing objects: 100% (30/30), 45.67 KiB | 2.85 MiB/s, done.
Total 30 (delta 2), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/originix.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### **Step 8: Check GitHub**

1. Buka browser
2. Go to: `https://github.com/YOUR_USERNAME/originix`
3. Refresh page
4. Lo harus lihat **semua files**:
   - ✅ app/
   - ✅ components/
   - ✅ lib/
   - ✅ README.md
   - ✅ package.json
   - ✅ etc. (27 files total)

🎉 **SUCCESS! Code di GitHub!**

---

## 🚀 NEXT: Deploy ke Vercel

Sekarang code udah di GitHub, saatnya deploy!

### **Quick Vercel Deployment:**

1. **Go to**: https://vercel.com
2. **Sign in** dengan GitHub account
3. Click **"Add New..."** → **"Project"**
4. **Import** repository `originix`
5. **Framework Preset**: Next.js (auto-detected)
6. **Add Environment Variables**:
   
   Click "Environment Variables" dan add satu-per-satu:

   ```
   GROK_API_KEY=your_grok_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Note**: Untuk semua variable, pastikan check ✅ **Production**, **Preview**, dan **Development**

7. Click **"Deploy"**
8. Wait **2-5 minutes**
9. **DONE!** 🎉

Vercel akan kasih lo URL seperti:
```
https://originix-xxxxx.vercel.app
```

---

## 🔧 Troubleshooting Git Bash

### **Error: "Permission denied (publickey)"**

**Solution**: Pakai HTTPS instead of SSH, atau setup SSH key:

```bash
# Check if SSH key exists
ls -la ~/.ssh

# If not, generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Paste ke GitHub: https://github.com/settings/ssh/new
```

---

### **Error: "remote origin already exists"**

**Solution**: Remove dan add ulang:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/originix.git
git push -u origin main
```

---

### **Error: "Updates were rejected"**

**Solution**: Force push (hati-hati!):

```bash
git push -u origin main --force
```

Atau pull dulu:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

### **Error: "Support for password authentication was removed"**

**Solution**: Pakai Personal Access Token (lihat Step 6, Option A)

GitHub tidak lagi support password biasa. Lo **HARUS** pakai token!

---

### **Error: Git Bash command not found**

**Solution**: Install Git for Windows:

1. Download: https://git-scm.com/download/win
2. Install dengan default settings
3. Restart computer
4. Try again

---

## 📝 Quick Reference Commands

```bash
# Check status
git status

# Check remote
git remote -v

# Check commit history
git log --oneline

# Check current branch
git branch

# Re-add remote (jika salah)
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/originix.git

# Force push (careful!)
git push -u origin main --force

# Pull from GitHub
git pull origin main
```

---

## 🎯 Full Workflow Summary

```bash
# 1. Open Git Bash in originix folder
cd /path/to/originix

# 2. Initialize (if needed)
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 3. Add remote (create repo on GitHub first!)
git remote add origin https://github.com/YOUR_USERNAME/originix.git

# 4. Push to GitHub
git push -u origin main

# 5. Deploy to Vercel (via browser)
# - Import GitHub repo
# - Add env variables
# - Deploy!
```

---

## 💡 Pro Tips

1. **Save Your Token**: Simpan Personal Access Token di password manager
2. **Check .gitignore**: Pastikan `.env.local` NOT pushed (sudah ada di .gitignore)
3. **Commit Messages**: Gunakan descriptive commit messages
4. **Branch Protection**: Setup branch protection rules di GitHub (optional)
5. **CI/CD**: Vercel auto-deploy setiap git push (very cool!)

---

## 📚 Additional Resources

- **Git Bash Basics**: https://git-scm.com/docs/gitglossary
- **GitHub Docs**: https://docs.github.com/en
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Setup**: `DEPLOYMENT_GUIDE.md` (in project)

---

## ✅ Checklist

Before deploying, make sure:

- [ ] Code pushed to GitHub successfully
- [ ] All 27 files visible on GitHub
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Grok API key obtained
- [ ] Ready to deploy to Vercel!

---

## 🎊 YOU'RE READY!

**Current Status:**
✅ Project created  
✅ Git initialized  
✅ Ready to push  

**Next Steps:**
1. Create GitHub repo
2. Run commands in Git Bash
3. Deploy to Vercel
4. **GO LIVE!** 🚀

---

**GOOD LUCK BRO!** 🔥

Need help? Check DEPLOYMENT_GUIDE.md for full deployment walkthrough!
