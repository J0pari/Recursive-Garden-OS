const fs = require('fs');
const puppeteer = require('puppeteer');

async function generatePDF() {
    console.log('🌱 Reading garden...');
    const markdown = fs.readFileSync('RECURSIVE_GARDEN.md', 'utf-8');
    
    // Super simple HTML - just to test if content is there
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Georgia, serif; 
            line-height: 1.6; 
            margin: 50px;
            font-size: 11pt;
        }
        h1 { font-size: 24pt; margin-top: 2em; }
        h2 { font-size: 18pt; margin-top: 1.5em; }
        h3 { font-size: 14pt; margin-top: 1.2em; }
        p { margin: 1em 0; }
        strong { font-weight: bold; }
        em { font-style: italic; }
    </style>
</head>
<body>
${markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para)
    .map(para => para.startsWith('<') ? para : `<p>${para}</p>`)
    .join('\n')}
</body>
</html>`;

    fs.writeFileSync('test_output.html', html);
    console.log('✅ HTML saved to test_output.html');
    
    console.log('🎨 Generating PDF...');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const pdfPath = `GARDEN_TEST_${timestamp}.pdf`;
    
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' }
    });
    
    await browser.close();
    console.log(`✅ PDF saved to ${pdfPath}`);
}

generatePDF().catch(console.error);