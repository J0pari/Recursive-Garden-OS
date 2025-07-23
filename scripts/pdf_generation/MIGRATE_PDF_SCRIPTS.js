#!/usr/bin/env node
/**
 * Migration script to rename old PDF scripts
 * This preserves them with .old extension for reference
 */

const fs = require('fs').promises;
const path = require('path');

const oldScripts = [
    'diagnose_pdf.js',
    'fix_pdf_generation.js',
    'generate_garden_pdf.js',
    'generate_living_garden_pdf.js',
    'generate_simple_pdf.js',
    'pipe_living_pdf.js'
];

async function migrate() {
    console.log('🔄 Migrating old PDF scripts...\n');
    
    for (const script of oldScripts) {
        try {
            const oldPath = path.join(__dirname, script);
            const backupPath = oldPath + '.old';
            
            // Check if script exists
            await fs.access(oldPath);
            
            // Rename to .old
            await fs.rename(oldPath, backupPath);
            console.log(`✓ Renamed ${script} → ${script}.old`);
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`- ${script} not found (already migrated?)`);
            } else {
                console.error(`✗ Error migrating ${script}:`, error.message);
            }
        }
    }
    
    console.log('\n✨ Migration complete!');
    console.log('\nTo use the new unified PDF generator:');
    console.log('  node pdf-generator/cli.js --mode garden');
    console.log('  node pdf-generator/cli.js --help\n');
}

// Run migration
migrate().catch(console.error);