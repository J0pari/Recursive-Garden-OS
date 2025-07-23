#!/usr/bin/env node
/**
 * Backward compatibility wrapper for generate_garden_pdf.js
 * Now uses the unified PDF generator
 */

const { generatePDF } = require('./pdf-generator');

// Run with garden preset
generatePDF({ mode: 'garden' })
    .then(() => console.log('\n✨ Garden PDF generated!'))
    .catch(err => {
        console.error('PDF generation failed:', err);
        process.exit(1);
    });