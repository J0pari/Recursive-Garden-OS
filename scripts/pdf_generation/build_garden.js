#!/usr/bin/env node
/**
 * BUILD GARDEN - One source of truth for all garden outputs
 * 
 * CHARTER_GUARD: Build system to embed garden content
 * BOOK_OF_SHADOWS: SARANETH (Binding)
 * MORPHISM: INTENT(One MD source for all) → CHARTER(verified) → BOOK(SARANETH) → CODE
 * 
 * This builds:
 * 1. garden_text.html - Interactive living view
 * 2. RECURSIVE_GARDEN_ALIVE.pdf - Downloadable plain formatted
 * 
 * Both from the SINGLE source: 00_CORE/RECURSIVE_GARDEN.md
 */

const fs = require('fs').promises;
const path = require('path');

async function buildGarden() {
    console.log('🌿 Building Garden from single source...');
    
    try {
        // Read the source of truth
        const gardenPath = path.join(__dirname, 'RECURSIVE_GARDEN.md');
        const gardenContent = await fs.readFile(gardenPath, 'utf8');
        console.log(`📖 Read ${gardenContent.length} characters from RECURSIVE_GARDEN.md`);
        
        // 1. Build the interactive HTML version
        await buildHTMLVersion(gardenContent);
        
        // 2. Build the PDF (using existing PDF generator)
        await buildPDFVersion();
        
        console.log('✅ Garden built successfully from single source!');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

async function buildHTMLVersion(gardenContent) {
    console.log('🌐 Building HTML version...');
    
    // Read the current garden_text.html
    const htmlPath = path.join(__dirname, '../docs/garden_text.html');
    let htmlContent = await fs.readFile(htmlPath, 'utf8');
    
    // Escape the content for embedding in JavaScript
    const escapedContent = gardenContent
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    
    // Find the fetch section and replace with embedded content
    const fetchPattern = /\/\/ Load garden content with multiple fallback attempts[\s\S]*?const text = await response\.text\(\);/;
    
    const replacement = `// EMBEDDED CONTENT - Built from 00_CORE/RECURSIVE_GARDEN.md
                // Built at: ${new Date().toISOString()}
                const text = "${escapedContent}";
                
                // Simulate successful response for compatibility
                const response = { ok: true, status: 200, statusText: 'OK (Embedded)' };`;
    
    if (!htmlContent.match(fetchPattern)) {
        throw new Error('Could not find fetch pattern in garden_text.html');
    }
    
    htmlContent = htmlContent.replace(fetchPattern, replacement);
    
    // Write the updated HTML
    await fs.writeFile(htmlPath, htmlContent);
    console.log('✅ HTML version updated with embedded content');
}

async function buildPDFVersion() {
    console.log('📄 Building PDF version...');
    
    // Use the existing PDF generator
    const { execSync } = require('child_process');
    
    try {
        // Run the PDF generator wrapper
        execSync('node generate_garden_pdf_wrapper.js', {
            cwd: __dirname,
            stdio: 'inherit'
        });
        console.log('✅ PDF version generated');
    } catch (error) {
        console.error('⚠️  PDF generation failed:', error.message);
        console.log('   (This is non-fatal - HTML version still works)');
    }
}

// Add watch mode for development
if (process.argv.includes('--watch')) {
    console.log('👁️  Watching for changes...');
    const chokidar = require('chokidar');
    
    chokidar.watch(path.join(__dirname, 'RECURSIVE_GARDEN.md'))
        .on('change', () => {
            console.log('\n🔄 Source changed, rebuilding...');
            buildGarden();
        });
    
    // Initial build
    buildGarden();
} else {
    // Single build
    buildGarden();
}