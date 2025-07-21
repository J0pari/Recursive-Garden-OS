const fs = require('fs');

console.log('🔍 Diagnosing garden HTML...\n');

const html = fs.readFileSync('garden_pdf_alive.html', 'utf-8');

// Find the body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    
    // Extract first 10 text elements
    const textElements = bodyContent.match(/<(h[1-6]|p)[^>]*>.*?<\/\1>/g);
    
    if (textElements) {
        console.log('First 10 elements in the HTML body:\n');
        textElements.slice(0, 10).forEach((elem, i) => {
            // Strip tags to show just text
            const text = elem.replace(/<[^>]+>/g, '').trim();
            const tag = elem.match(/<(\w+)/)[1];
            console.log(`${i + 1}. [${tag}] ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        });
    }
    
    // Check for title
    const h1Match = bodyContent.match(/<h1[^>]*>(.*?)<\/h1>/);
    if (h1Match) {
        console.log('\n✅ Found H1 title:', h1Match[1].replace(/<[^>]+>/g, ''));
    } else {
        console.log('\n❌ NO H1 TITLE FOUND IN BODY!');
    }
    
    // Check what's at the very beginning
    const firstContent = bodyContent.substring(0, 500).trim();
    console.log('\n📄 First 500 chars of body:\n', firstContent);
} else {
    console.log('❌ Could not find body in HTML!');
}