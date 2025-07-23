#!/usr/bin/env node
/**
 * Backward compatibility wrapper for generate_simple_pdf.js
 * Now uses the unified PDF generator
 */

const { generatePDF } = require('./pdf-generator');

// Run with simple preset
generatePDF({ mode: 'simple' })
    .then(() => console.log('\n✨ Simple PDF generated!'))
    .catch(err => {
        console.error('PDF generation failed:', err);
        process.exit(1);
    });