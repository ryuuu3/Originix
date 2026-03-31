#!/bin/bash

echo "🚀 Originix - GitHub Push Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git not initialized!"
    echo "Run: git init"
    exit 1
fi

# Prompt for GitHub username
echo "📝 Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: Username cannot be empty!"
    exit 1
fi

# Construct repository URL
REPO_URL="https://github.com/$GITHUB_USERNAME/originix.git"

echo ""
echo "📦 Repository URL: $REPO_URL"
echo ""
echo "⚠️  IMPORTANT: Make sure you have created the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Repository name: originix"
echo ""
read -p "Press ENTER when repository is created on GitHub..."

# Add remote
echo ""
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

if [ $? -ne 0 ]; then
    echo "❌ Failed to add remote!"
    exit 1
fi

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/$GITHUB_USERNAME/originix"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to vercel.com"
    echo "   2. Import the originix repository"
    echo "   3. Add environment variables"
    echo "   4. Deploy!"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common fixes:"
    echo "1. Make sure repository exists on GitHub"
    echo "2. Check your GitHub credentials"
    echo "3. Try using SSH instead: git@github.com:$GITHUB_USERNAME/originix.git"
    echo ""
fi
