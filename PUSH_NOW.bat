@echo off
echo EMERGENCY PUSH TO GITHUB - RECURSIVE GARDEN OS
echo ==============================================
echo.

REM Initialize git in current directory
git init

REM Add remote
git remote add origin https://github.com/J0pari/Recursive-Garden.git

REM Configure user
git config user.name "J0pari"
git config user.email "your-email@example.com"

REM Add ALL files
git add --all

REM Commit everything
git commit -m "🌱 COMPLETE Recursive Garden OS - All implementations included"

REM Force push to main branch
git push -u origin main --force

echo.
echo DONE! Check https://github.com/J0pari/Recursive-Garden
pause