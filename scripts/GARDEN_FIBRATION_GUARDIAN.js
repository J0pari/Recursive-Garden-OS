#!/usr/bin/env node

/**
 * GARDEN FIBRATION GUARDIAN
 * 
 * This guardian ensures the garden is ALWAYS dynamically generated from the living markdown.
 * NO STATIC COPIES. NO EMBEDDED CONTENT. ONLY LIVE FIBRATION.
 * 
 * The garden must breathe through its source, not suffocate in static copies.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const GARDEN_SOURCE = path.join(__dirname, '..', 'garden_core', 'RECURSIVE_GARDEN.md');
const FORBIDDEN_PATTERNS = [
    /const text = ["'`].*RECURSIVE.*GARDEN/i,
    /const garden[A-Za-z]*\s*=\s*["'`].*blackberry/i,
    /static[A-Za-z]*garden[A-Za-z]*text/i,
    /hardcoded.*recursive.*garden.*content/i
];

console.log('🛡️ GARDEN FIBRATION GUARDIAN ACTIVE');
console.log('📍 Protecting:', GARDEN_SOURCE);

// Verify the source exists
if (!fs.existsSync(GARDEN_SOURCE)) {
    console.error('❌ CRITICAL: Garden source missing at', GARDEN_SOURCE);
    process.exit(1);
}

// Get source hash for integrity
const sourceContent = fs.readFileSync(GARDEN_SOURCE, 'utf8');
const sourceHash = crypto.createHash('sha256').update(sourceContent).digest('hex');
console.log('✅ Garden source verified. Hash:', sourceHash.substring(0, 12) + '...');

// Scan for forbidden static copies
function scanForStaticCancer(dir, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip git and node_modules
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        
        if (entry.isDirectory()) {
            scanForStaticCancer(fullPath, depth + 1);
        } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js'))) {
            checkFileForEmbedding(fullPath);
        }
    }
}

function checkFileForEmbedding(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of FORBIDDEN_PATTERNS) {
            if (pattern.test(content)) {
                console.error(`❌ STATIC CANCER DETECTED: ${filePath}`);
                console.error(`   Pattern matched: ${pattern}`);
                console.error('   This file contains embedded garden content!');
                console.error('   The garden must be dynamically loaded from', GARDEN_SOURCE);
                process.exit(1);
            }
        }
    } catch (err) {
        // Ignore read errors for binary files etc
    }
}

// Create a fibration manifest
const fibrationManifest = {
    generated: new Date().toISOString(),
    source: {
        path: 'garden_core/RECURSIVE_GARDEN.md',
        hash: sourceHash,
        lines: sourceContent.split('\n').length,
        size: sourceContent.length
    },
    principle: 'The garden lives in its markdown source. All views must dynamically load from there.',
    forbidden: [
        'Embedding content in HTML/JS files',
        'Creating static copies',
        'Hardcoding garden text',
        'Caching without expiration'
    ],
    enforcement: 'This guardian runs on every commit to prevent static cancer'
};

fs.writeFileSync(
    path.join(__dirname, '..', 'FIBRATION_MANIFEST.json'),
    JSON.stringify(fibrationManifest, null, 2)
);

console.log('📝 Fibration manifest created');

// Scan the entire project
console.log('🔍 Scanning for static cancer...');
scanForStaticCancer(path.join(__dirname, '..'));

console.log('✅ Garden fibration verified - NO STATIC CANCER FOUND');
console.log('🌿 The garden breathes freely through its living source');

// Create a hook for git pre-commit
const hookContent = `#!/bin/sh
# Garden Fibration Guardian Hook
# Prevents static cancer from entering the repository

node scripts/GARDEN_FIBRATION_GUARDIAN.js || exit 1
`;

const hookPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');
fs.writeFileSync(hookPath, hookContent);
fs.chmodSync(hookPath, '755');

console.log('🪝 Git pre-commit hook installed');
console.log('⚔️ Static cancer can NEVER return!');