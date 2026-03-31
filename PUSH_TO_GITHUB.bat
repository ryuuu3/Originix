@echo off
echo ================================
echo Originix - GitHub Push Script
echo ================================
echo.

REM Check if .git exists
if not exist .git (
    echo Error: Git not initialized!
    echo Run: git init
    pause
    exit /b 1
)

REM Prompt for GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "

if "%GITHUB_USERNAME%"=="" (
    echo Error: Username cannot be empty!
    pause
    exit /b 1
)

REM Construct repository URL
set REPO_URL=https://github.com/%GITHUB_USERNAME%/originix.git

echo.
echo Repository URL: %REPO_URL%
echo.
echo IMPORTANT: Make sure you have created the repository on GitHub first!
echo    Go to: https://github.com/new
echo    Repository name: originix
echo.
pause

REM Add remote
echo.
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

if errorlevel 1 (
    echo Failed to add remote!
    pause
    exit /b 1
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed!
    echo.
    echo Common fixes:
    echo 1. Make sure repository exists on GitHub
    echo 2. Check your GitHub credentials
    echo 3. Try using SSH instead
    echo.
    pause
    exit /b 1
)

echo.
echo ================================
echo SUCCESS! Code pushed to GitHub!
echo ================================
echo.
echo View your repository at:
echo    https://github.com/%GITHUB_USERNAME%/originix
echo.
echo Next steps:
echo    1. Go to vercel.com
echo    2. Import the originix repository
echo    3. Add environment variables
echo    4. Deploy!
echo.
pause
