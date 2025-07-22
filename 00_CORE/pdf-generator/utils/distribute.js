/**
 * PDF distribution utility
 * Equivalent to pipe_living_pdf.js functionality
 */

const fs = require('fs').promises;
const path = require('path');

async function pipePDF(pdfPath, options = {}) {
    const {
        targets = ['./welcome.html', './docs/index.html', './docs/demos.html'],
        createPortal = true,
        stablePath = './docs/RECURSIVE_GARDEN_ALIVE.pdf'
    } = options;
    
    console.log('🌿 PIPING LIVING PDF INTO THE GARDEN...\n');
    
    try {
        // Verify PDF exists
        await fs.access(pdfPath);
        console.log(`✓ Found PDF: ${pdfPath}`);
        
        // Create stable copy in docs
        if (stablePath) {
            await fs.copyFile(pdfPath, stablePath);
            console.log(`✓ Created stable copy: ${stablePath}`);
        }
        
        // Process each target HTML file
        for (const htmlFile of targets) {
            try {
                await injectPDFLink(htmlFile, stablePath || pdfPath, createPortal);
                console.log(`✓ Injected PDF link into ${htmlFile}`);
            } catch (error) {
                console.error(`✗ Failed to process ${htmlFile}:`, error.message);
            }
        }
        
        console.log('\n✨ PDF distribution complete!');
        return { success: true };
        
    } catch (error) {
        console.error('Distribution failed:', error);
        return { success: false, error: error.message };
    }
}

async function injectPDFLink(htmlPath, pdfPath, createPortal) {
    const html = await fs.readFile(htmlPath, 'utf8');
    
    // Calculate relative path from HTML to PDF
    const htmlDir = path.dirname(htmlPath);
    const relativePdfPath = path.relative(htmlDir, pdfPath).replace(/\\/g, '/');
    
    // Create portal HTML if requested
    const portalHTML = createPortal ? `
<!-- PDF Portal -->
<div id="pdf-portal" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
    <a href="${relativePdfPath}" 
       style="display: block; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              border-radius: 50%; display: flex; align-items: center; justify-content: center; 
              box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease; text-decoration: none;">
        <span style="color: white; font-size: 24px;">📖</span>
    </a>
</div>
<style>
    #pdf-portal a:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
</style>
` : '';
    
    // Check if portal already exists
    if (html.includes('id="pdf-portal"')) {
        // Update existing portal
        const updatedHtml = html.replace(
            /href="[^"]*"(\s+style="[^"]*display:\s*block;[^"]*width:\s*60px)/,
            `href="${relativePdfPath}"$1`
        );
        await fs.writeFile(htmlPath, updatedHtml);
    } else if (createPortal) {
        // Add new portal before closing body tag
        const updatedHtml = html.replace('</body>', `${portalHTML}\n</body>`);
        await fs.writeFile(htmlPath, updatedHtml);
    }
    
    // Also update any existing PDF links in the content
    const linkPattern = /<a[^>]*href="[^"]*\.pdf"[^>]*>/g;
    if (linkPattern.test(html)) {
        const updatedHtml = html.replace(linkPattern, (match) => {
            return match.replace(/href="[^"]*"/, `href="${relativePdfPath}"`);
        });
        await fs.writeFile(htmlPath, updatedHtml);
    }
}

module.exports = { pipePDF };