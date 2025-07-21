const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDFFromHTML() {
    console.log('🌿 Generating living PDF from HTML...');
    
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Load the HTML file directly
        const htmlPath = path.resolve('garden_pdf_alive.html');
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'domcontentloaded'
        });
        
        // Give it a moment for styles to apply
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const pdfPath = `RECURSIVE_GARDEN_ALIVE_${timestamp}.pdf`;
        
        console.log('📖 Creating PDF...');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm'
            }
        });
        
        console.log(`✅ PDF saved to: ${pdfPath}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

generatePDFFromHTML();