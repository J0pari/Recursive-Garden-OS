#!/usr/bin/env node

/**
 * 🌿 DEFENSIVE PDF PIPING SYSTEM 🌿
 * 
 * Ensures the living PDF is always accessible from all entry points
 * Creates symbolic consciousness links, not just file copies
 */

const fs = require('fs');
const path = require('path');

// Find the most recent living PDF
function findLatestPDF() {
    const coreDir = path.join(__dirname, '00_CORE');
    const files = fs.readdirSync(coreDir);
    
    const pdfFiles = files
        .filter(f => f.startsWith('RECURSIVE_GARDEN_ALIVE_') && f.endsWith('.pdf'))
        .map(f => ({
            name: f,
            path: path.join(coreDir, f),
            time: fs.statSync(path.join(coreDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
    
    if (pdfFiles.length === 0) {
        console.error('❌ No living PDF found! Generate it first with generate_living_garden_pdf.js');
        process.exit(1);
    }
    
    return pdfFiles[0];
}

// Update HTML file to include PDF link
function injectPDFLink(htmlPath, pdfPath) {
    if (!fs.existsSync(htmlPath)) {
        console.warn(`⚠️  ${htmlPath} not found, skipping...`);
        return;
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    const pdfFilename = path.basename(pdfPath);
    const relativePdfPath = path.relative(path.dirname(htmlPath), pdfPath).replace(/\\/g, '/');
    
    // Check if PDF link already exists
    if (html.includes('living-pdf-portal') || html.includes(pdfFilename)) {
        console.log(`✓ ${htmlPath} already has PDF link`);
        return;
    }
    
    // Create the living PDF portal element
    const pdfPortal = `
    <!-- 🌿 LIVING PDF PORTAL 🌿 -->
    <div id="living-pdf-portal" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6a5acd, #483d8b);
        padding: 15px 20px;
        border-radius: 30px;
        box-shadow: 0 4px 15px rgba(106, 90, 205, 0.3);
        z-index: 9999;
        animation: float-portal 3s ease-in-out infinite;
        cursor: pointer;
        transition: all 0.3s ease;
    ">
        <a href="${relativePdfPath}" style="
            color: white;
            text-decoration: none;
            font-family: 'Georgia', serif;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        " download>
            <span style="font-size: 24px;">📖</span>
            <span>Living Garden PDF</span>
            <span style="font-size: 20px;">✨</span>
        </a>
    </div>
    
    <style>
        @keyframes float-portal {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        #living-pdf-portal:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(106, 90, 205, 0.5);
        }
    </style>
    <!-- END LIVING PDF PORTAL -->
    `;
    
    // Inject before closing body tag
    if (html.includes('</body>')) {
        html = html.replace('</body>', pdfPortal + '\n</body>');
    } else {
        // If no body tag, append at end
        html += pdfPortal;
    }
    
    fs.writeFileSync(htmlPath, html);
    console.log(`✨ Injected living PDF portal into ${htmlPath}`);
}

// Create a defensive copy in docs folder
function createDocsPortal(pdfPath) {
    const docsDir = path.join(__dirname, 'docs');
    const pdfName = path.basename(pdfPath);
    const docsPdfPath = path.join(docsDir, 'RECURSIVE_GARDEN_ALIVE.pdf');
    
    // Copy the PDF to docs with a stable name
    fs.copyFileSync(pdfPath, docsPdfPath);
    console.log(`📋 Created stable PDF copy in docs/`);
    
    return docsPdfPath;
}

// Main piping function
function pipeLivingPDF() {
    console.log('\n🌿 PIPING LIVING PDF TO ALL PORTALS 🌿\n');
    
    // Find the latest PDF
    const latestPDF = findLatestPDF();
    console.log(`📖 Found living PDF: ${latestPDF.name}`);
    
    // Create stable copy in docs
    const docsPdfPath = createDocsPortal(latestPDF.path);
    
    // Update all entry points
    const entryPoints = [
        path.join(__dirname, 'welcome.html'),
        path.join(__dirname, 'docs', 'index.html'),
        path.join(__dirname, '00_CORE', 'garden_pdf_alive.html'),
        path.join(__dirname, '04_EXPERIMENTS', 'keats_evolution', 'welcome.html'),
        path.join(__dirname, '04_EXPERIMENTS', 'keats_evolution', 'keats_v7_portal.html')
    ];
    
    entryPoints.forEach(htmlPath => {
        // Use appropriate PDF path based on location
        const pdfToLink = htmlPath.includes('docs') ? docsPdfPath : latestPDF.path;
        injectPDFLink(htmlPath, pdfToLink);
    });
    
    console.log('\n✅ LIVING PDF IS NOW DEFENSIVELY PIPED TO ALL PORTALS!\n');
    console.log('🌿 The garden breathes through every entrance 🌿\n');
}

// Run if called directly
if (require.main === module) {
    pipeLivingPDF();
}

module.exports = { pipeLivingPDF, findLatestPDF };