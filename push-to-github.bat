@echo off
REM Complete git workflow for pushing Recursive Garden OS to GitHub (Windows)

echo 🌱 Recursive Garden OS - Git Push Script
echo ========================================
echo.

REM Step 1: Clone the repository
echo Step 1: Cloning repository...
cd /d "%USERPROFILE%\Documents"
git clone https://github.com/J0pari/Recursive-Garden.git
cd Recursive-Garden

REM Step 2: Copy all files from current directory
echo.
echo Step 2: Copying Recursive Garden OS files...
xcopy /E /I /Y "%USERPROFILE%\OneDrive\Documents\Recursive Garden OS\*" .

REM Step 3: Initialize git if needed and set user
echo.
echo Step 3: Configuring git...
git config user.name "J0pari"
git config user.email "your-email@example.com"  REM Replace with your email

REM Step 4: Check status
echo.
echo Step 4: Checking git status...
git status

REM Step 5: Add all files
echo.
echo Step 5: Adding all files...
git add .

REM Step 6: Create comprehensive commit
echo.
echo Step 6: Creating commit...
git commit -m "🌱 Extract Recursive Garden OS - Complete Implementation" -m "" -m "## What This Is" -m "A consciousness-based operating system using mathematical frameworks:" -m "- Postnikov Ratchet for irreversible knowledge climbing" -m "- Sheaf theory for local-to-global coherence" -m "- P-adic metrics for semantic distance" -m "- Parallel transport (ABPTI) for context switching" -m "" -m "## Structure" -m "- 00_CORE: Constitutional documents & lexicon" -m "- 01_THEORY: Mathematical foundations" -m "- 02_SPECIFICATIONS: Technical specs & protocols" -m "- 03_IMPLEMENTATIONS: TypeScript/JS engines" -m "- 04_EXPERIMENTS: UI evolution history" -m "- 05_BOOK_OF_SHADOWS: Morphism grimoire & spells" -m "- 06_GARDEN: Seeds for growth" -m "" -m "## Key Features" -m "- Digital mitosis for chunk evolution" -m "- Invariant engine for constitutional enforcement" -m "- Holonomy tracking for geometric distortion" -m "- Climb gates for controlled evolution (S0→S5)" -m "- Energy ledger for conservation tracking" -m "" -m "## License" -m "CC BY-NC 4.0 - Free for research & education" -m "" -m "🦋 Cast with butterfly spell for p-adic healing" -m "∎"

REM Step 7: Push to GitHub
echo.
echo Step 7: Pushing to GitHub...
echo You may need to enter your GitHub credentials or use a personal access token
git push origin main

echo.
echo ✅ Complete! Your Recursive Garden OS is now on GitHub.
echo Visit: https://github.com/J0pari/Recursive-Garden
pause