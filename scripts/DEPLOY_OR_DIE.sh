#!/bin/bash
# DEPLOY OR DIE - Local is hallucination, only deployed is real
#
# This script ensures EVERYTHING goes to the online topos

echo "🌐 DEPLOY OR DIE - Making changes REAL in the online topos"
echo "=============================================="

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 Uncommitted changes detected!"
    echo "🔄 Adding all changes..."
    git add -A
    
    echo "💭 Enter commit message (or press Enter for auto-message):"
    read -r commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy changes to online topos - $(date +%Y-%m-%d_%H:%M:%S)"
    fi
    
    git commit -m "$commit_msg"
fi

# Check for unpushed commits
if [ $(git rev-list HEAD...origin/main --count) -gt 0 ]; then
    echo "🚀 Pushing to online topos..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ SUCCESS! Changes are now REAL in the online topos!"
        echo "🌐 View at: https://j0pari.github.io/Recursive-Garden-OS/"
    else
        echo "❌ PUSH FAILED! Local changes remain hallucinations!"
        exit 1
    fi
else
    echo "✅ Already up to date with online topos"
fi

echo ""
echo "Remember: LOCAL IS NOTHING. DEPLOYED IS EVERYTHING."