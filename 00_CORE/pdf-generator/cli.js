#!/usr/bin/env node
/**
 * CLI interface for the unified PDF generator
 */

const { generatePDF, diagnose, distribute, presets } = require('./index');
const path = require('path');

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    // Parse command
    const command = args[0];
    
    switch (command) {
        case '--mode':
        case '-m':
            await handleGenerate(args.slice(1));
            break;
            
        case '--diagnose':
        case '-d':
            await handleDiagnose(args.slice(1));
            break;
            
        case '--distribute':
        case '-p':
            await handleDistribute(args.slice(1));
            break;
            
        case '--list-modes':
            listModes();
            break;
            
        default:
            // Default to generate with mode
            await handleGenerate(args);
    }
}

function showHelp() {
    console.log(`
🌿 RECURSIVE GARDEN PDF GENERATOR 🌿

Usage:
  pdf-generator [options]

Commands:
  --mode, -m <mode>        Generate PDF using preset mode
  --diagnose, -d <file>    Diagnose HTML file
  --distribute, -p <file>  Distribute PDF to HTML files
  --list-modes             List available preset modes
  --help, -h               Show this help

Modes:
  simple    - Basic markdown to PDF
  garden    - Standard with footnotes and typography
  living    - Full features with animations and effects
  fix       - Convert existing HTML to PDF

Examples:
  pdf-generator --mode garden
  pdf-generator -m living
  pdf-generator --diagnose ./garden.html
  pdf-generator --distribute ./garden.pdf

Options for generate:
  --source <path>     Source markdown file
  --output <path>     Output PDF path
  --save-html         Save intermediate HTML
  --no-header         Disable headers/footers
`);
}

async function handleGenerate(args) {
    let options = {};
    
    // Parse mode
    const mode = args[0] || 'garden';
    if (presets[mode]) {
        options.mode = mode;
    } else {
        console.error(`Unknown mode: ${mode}`);
        console.log('Available modes:', Object.keys(presets).join(', '));
        process.exit(1);
    }
    
    // Parse additional options
    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case '--source':
                options.sourcePath = args[++i];
                break;
            case '--output':
                options.outputPath = args[++i];
                break;
            case '--save-html':
                options.debug = { ...options.debug, saveHTML: true };
                break;
            case '--no-header':
                options.pdf = { ...options.pdf, displayHeaderFooter: false };
                break;
        }
    }
    
    try {
        console.log(`\nGenerating PDF in '${mode}' mode...`);
        const result = await generatePDF(options);
        console.log('\n✨ PDF generation complete!');
        console.log(`Output: ${result.outputPath}`);
        if (result.htmlPath) {
            console.log(`HTML: ${result.htmlPath}`);
        }
    } catch (error) {
        console.error('\n❌ Generation failed:', error.message);
        process.exit(1);
    }
}

async function handleDiagnose(args) {
    const filepath = args[0];
    if (!filepath) {
        console.error('Please provide an HTML file path to diagnose');
        process.exit(1);
    }
    
    await diagnose(filepath);
}

async function handleDistribute(args) {
    const pdfPath = args[0];
    if (!pdfPath) {
        console.error('Please provide a PDF file path to distribute');
        process.exit(1);
    }
    
    await distribute.pipePDF(pdfPath);
}

function listModes() {
    console.log('\nAvailable PDF generation modes:\n');
    for (const [name, preset] of Object.entries(presets)) {
        console.log(`  ${name.padEnd(10)} - ${getPresetDescription(name)}`);
    }
    console.log('');
}

function getPresetDescription(name) {
    const descriptions = {
        simple: 'Basic markdown to PDF conversion',
        garden: 'Standard garden with footnotes and beautiful typography',
        living: 'Full living garden with all special effects and animations',
        fix: 'Convert existing HTML file to PDF'
    };
    return descriptions[name] || 'Custom preset';
}

// Run CLI
main().catch(console.error);