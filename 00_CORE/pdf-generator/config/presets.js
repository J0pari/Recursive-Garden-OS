/**
 * Preset configurations for different PDF generation modes
 */

module.exports = {
    // Minimal configuration - equivalent to generate_simple_pdf.js
    simple: {
        renderer: 'simple',
        outputPath: `./GARDEN_TEST_${Date.now()}.pdf`,
        features: {
            footnotes: false,
            modalSymbols: false,
            specialSyntax: false,
            animations: false,
            soundData: false,
            mathematicalColors: false
        },
        styling: {
            theme: 'minimal',
            colorScheme: 'static',
            animations: false
        },
        pdf: {
            displayHeaderFooter: false
        },
        debug: {
            saveHTML: true
        }
    },

    // Standard garden configuration - equivalent to generate_garden_pdf.js
    garden: {
        renderer: 'garden',
        outputPath: `./RECURSIVE_GARDEN_${new Date().toISOString().split('T')[0]}.pdf`,
        features: {
            footnotes: true,
            modalSymbols: true,
            specialSyntax: false,
            animations: false,
            soundData: false,
            mathematicalColors: false
        },
        styling: {
            theme: 'garden',
            colorScheme: 'dynamic',
            animations: false
        },
        pdf: {
            displayHeaderFooter: true,
            format: 'A4',
            margins: {
                top: '25mm',
                bottom: '30mm',
                left: '25mm',
                right: '25mm'
            }
        },
        debug: {
            saveHTML: true
        }
    },

    // Living garden configuration - equivalent to generate_living_garden_pdf.js
    living: {
        renderer: 'living',
        outputPath: `./RECURSIVE_GARDEN_ALIVE_${new Date().toISOString().split('T')[0]}.pdf`,
        features: {
            footnotes: true,
            modalSymbols: true,
            specialSyntax: true,
            animations: true,
            soundData: true,
            mathematicalColors: true
        },
        styling: {
            theme: 'living',
            colorScheme: 'mathematical',
            animations: true
        },
        pdf: {
            displayHeaderFooter: true,
            format: 'A4',
            margins: {
                top: '25mm',
                bottom: '30mm',
                left: '25mm',
                right: '25mm'
            }
        },
        debug: {
            saveHTML: true
        }
    },

    // Quick fix mode - equivalent to fix_pdf_generation.js
    fix: {
        source: 'html',
        sourcePath: './garden_pdf_alive.html',
        outputPath: `./RECURSIVE_GARDEN_ALIVE_${Date.now()}.pdf`,
        pdf: {
            format: 'A4',
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm'
            },
            printBackground: true
        }
    }
};