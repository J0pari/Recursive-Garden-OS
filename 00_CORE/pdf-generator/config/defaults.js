/**
 * Default configuration for PDF generation
 */

module.exports = {
    mode: 'standard',
    source: 'markdown',
    sourcePath: './RECURSIVE_GARDEN.md',
    outputPath: `./RECURSIVE_GARDEN_${new Date().toISOString().split('T')[0]}.pdf`,
    renderer: 'simple',
    
    features: {
        footnotes: false,
        modalSymbols: false,
        specialSyntax: false,
        animations: false,
        soundData: false,
        mathematicalColors: false
    },
    
    styling: {
        theme: 'default',
        fonts: ['EB Garamond', 'Fira Code'],
        colorScheme: 'static',
        animations: false
    },
    
    pdf: {
        format: 'A4',
        margins: {
            top: '25mm',
            bottom: '25mm',
            left: '20mm',
            right: '20mm'
        },
        printBackground: true,
        displayHeaderFooter: false,
        headerTemplate: '',
        footerTemplate: '',
        preferCSSPageSize: true
    },
    
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000
    },
    
    debug: {
        saveHTML: false,
        diagnose: false,
        verbose: false
    }
};