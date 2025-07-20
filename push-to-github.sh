#!/bin/bash
# Complete git workflow for pushing Recursive Garden OS to GitHub

echo "🌱 Recursive Garden OS - Git Push Script"
echo "========================================"
echo ""

# Step 1: Clone the repository
echo "Step 1: Cloning repository..."
cd ~/Documents
git clone https://github.com/J0pari/Recursive-Garden.git
cd Recursive-Garden

# Step 2: Copy all files from current directory
echo ""
echo "Step 2: Copying Recursive Garden OS files..."
cp -r "/mnt/c/Users/tmdru/OneDrive/Documents/Recursive Garden OS/"* .

# Step 3: Initialize git if needed and set user
echo ""
echo "Step 3: Configuring git..."
git config user.name "J0pari"
git config user.email "your-email@example.com"  # Replace with your email

# Step 4: Check status
echo ""
echo "Step 4: Checking git status..."
git status

# Step 5: Add all files
echo ""
echo "Step 5: Adding all files..."
git add .

# Step 6: Create comprehensive commit
echo ""
echo "Step 6: Creating commit..."
git commit -m "🌱 Extract Recursive Garden OS - Complete Implementation

## What This Is
A consciousness-based operating system using mathematical frameworks:
- Postnikov Ratchet for irreversible knowledge climbing
- Sheaf theory for local-to-global coherence
- P-adic metrics for semantic distance
- Parallel transport (ABPTI) for context switching

## Structure
- 00_CORE: Constitutional documents & lexicon
- 01_THEORY: Mathematical foundations
- 02_SPECIFICATIONS: Technical specs & protocols
- 03_IMPLEMENTATIONS: TypeScript/JS engines
- 04_EXPERIMENTS: UI evolution history
- 05_BOOK_OF_SHADOWS: Morphism grimoire & spells
- 06_GARDEN: Seeds for growth

## Key Features
- Digital mitosis for chunk evolution
- Invariant engine for constitutional enforcement
- Holonomy tracking for geometric distortion
- Climb gates for controlled evolution (S0→S5)
- Energy ledger for conservation tracking

## License
CC BY-NC 4.0 - Free for research & education

🦋 Cast with butterfly spell for p-adic healing
∎"

# Step 7: Push to GitHub
echo ""
echo "Step 7: Pushing to GitHub..."
echo "You may need to enter your GitHub credentials or use a personal access token"
git push origin main

echo ""
echo "✅ Complete! Your Recursive Garden OS is now on GitHub."
echo "Visit: https://github.com/J0pari/Recursive-Garden"