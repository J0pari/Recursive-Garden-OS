/**
 * Diagnostic utility for HTML files
 * Equivalent to diagnose_pdf.js functionality
 */

const fs = require('fs').promises;
// Simple regex-based HTML parsing (no jsdom dependency)

async function diagnoseHTML(filepath) {
    console.log(`\n=== Diagnosing HTML file: ${filepath} ===\n`);
    
    try {
        // Read the HTML file
        const html = await fs.readFile(filepath, 'utf8');
        console.log(`File size: ${html.length} characters\n`);
        
        // Extract body content
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;
        
        // Check for title
        const titleMatch = bodyContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (titleMatch) {
            console.log(`Title found: "${titleMatch[1].trim()}"\n`);
        } else {
            console.log('WARNING: No H1 title found!\n');
        }
        
        // Extract first 10 text elements
        console.log('First 10 text elements:');
        console.log('------------------------');
        const textPattern = /<(p|h[1-6]|li)[^>]*>([^<]+)<\/\1>/gi;
        const matches = Array.from(bodyContent.matchAll(textPattern));
        
        for (let i = 0; i < Math.min(10, matches.length); i++) {
            const [, tag, text] = matches[i];
            const trimmedText = text.trim().substring(0, 100);
            console.log(`${i + 1}. [${tag.toUpperCase()}] ${trimmedText}${trimmedText.length >= 100 ? '...' : ''}`);
        }
        console.log('');
        
        // Show first 500 chars of text content
        console.log('First 500 characters of body content:');
        console.log('-------------------------------------');
        const textOnly = bodyContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log(textOnly.substring(0, 500) + '...\n');
        
        // Check for footnotes
        const footnoteMatches = bodyContent.match(/class="footnote"/g);
        const footnoteCount = footnoteMatches ? footnoteMatches.length : 0;
        if (footnoteCount > 0) {
            console.log(`Found ${footnoteCount} footnotes\n`);
        }
        
        // Check for special elements
        const codeBlockMatches = bodyContent.match(/<pre[^>]*>/g);
        const blockquoteMatches = bodyContent.match(/<blockquote[^>]*>/g);
        const codeBlockCount = codeBlockMatches ? codeBlockMatches.length : 0;
        const blockquoteCount = blockquoteMatches ? blockquoteMatches.length : 0;
        
        console.log(`Code blocks: ${codeBlockCount}`);
        console.log(`Blockquotes: ${blockquoteCount}\n`);
        
        return {
            success: true,
            stats: {
                fileSize: html.length,
                hasTitle: !!titleMatch,
                textElements: matches.length,
                footnotes: footnoteCount,
                codeBlocks: codeBlockCount,
                blockquotes: blockquoteCount
            }
        };
        
    } catch (error) {
        console.error('Diagnosis failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { diagnoseHTML };