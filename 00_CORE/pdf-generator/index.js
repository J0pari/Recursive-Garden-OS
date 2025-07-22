/**
 * Unified PDF Generator for Recursive Garden OS
 * 
 * CHARTER_GUARD: Consolidating PDF generation to follow DRY principle
 * BOOK_OF_SHADOWS: RANNA (Simplification)
 * MORPHISM: INTENT(reduce duplication) → CHARTER(DRY) → BOOK(simplify) → CODE
 * 
 * This module replaces 6 separate PDF scripts with one configurable solution
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Internal modules
const presets = require('./config/presets');
const defaults = require('./config/defaults');
const { GardenRenderer } = require('./renderers/garden');
const { LivingRenderer } = require('./renderers/living');
const { SimpleRenderer } = require('./renderers/simple');
const { diagnoseHTML } = require('./utils/diagnose');
const { pipePDF } = require('./utils/distribute');

class PDFGenerator {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    /**
     * Main PDF generation function with configurable options
     */
    async generatePDF(userOptions = {}) {
        // Apply preset if specified
        let options = { ...defaults };
        if (userOptions.mode && presets[userOptions.mode]) {
            options = { ...options, ...presets[userOptions.mode] };
        }
        // Override with user options
        options = this.deepMerge(options, userOptions);

        try {
            // Initialize Puppeteer
            await this.initBrowser(options.puppeteer);

            let html;
            
            // Generate or read HTML based on source type
            if (options.source === 'markdown') {
                html = await this.generateHTMLFromMarkdown(options);
            } else if (options.source === 'html') {
                html = await fs.readFile(options.sourcePath, 'utf8');
            } else {
                throw new Error(`Unknown source type: ${options.source}`);
            }

            // Save HTML if debug mode
            if (options.debug.saveHTML) {
                const htmlPath = options.outputPath.replace('.pdf', '.html');
                await fs.writeFile(htmlPath, html);
                console.log(`HTML saved to: ${htmlPath}`);
            }

            // Generate PDF
            await this.page.setContent(html, { waitUntil: 'networkidle0' });
            
            // Configure PDF options
            const pdfOptions = {
                path: options.outputPath,
                ...options.pdf
            };

            // Add headers/footers if enabled
            if (options.pdf.displayHeaderFooter) {
                pdfOptions.headerTemplate = options.pdf.headerTemplate || this.getDefaultHeader();
                pdfOptions.footerTemplate = options.pdf.footerTemplate || this.getDefaultFooter();
            }

            await this.page.pdf(pdfOptions);
            console.log(`PDF generated: ${options.outputPath}`);

            return {
                success: true,
                outputPath: options.outputPath,
                htmlPath: options.debug.saveHTML ? options.outputPath.replace('.pdf', '.html') : null
            };

        } catch (error) {
            console.error('PDF generation failed:', error);
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    /**
     * Generate HTML from Markdown based on renderer type
     */
    async generateHTMLFromMarkdown(options) {
        const markdown = await fs.readFile(options.sourcePath, 'utf8');
        
        let renderer;
        switch (options.renderer) {
            case 'simple':
                renderer = new SimpleRenderer(options);
                break;
            case 'garden':
                renderer = new GardenRenderer(options);
                break;
            case 'living':
                renderer = new LivingRenderer(options);
                break;
            default:
                renderer = new SimpleRenderer(options);
        }

        return renderer.render(markdown);
    }

    /**
     * Initialize Puppeteer browser and page
     */
    async initBrowser(puppeteerOptions) {
        this.browser = await puppeteer.launch(puppeteerOptions);
        this.page = await this.browser.newPage();
        
        // Set default viewport
        await this.page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 2
        });
    }

    /**
     * Cleanup browser resources
     */
    async cleanup() {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Deep merge utility for options
     */
    deepMerge(target, source) {
        const output = { ...target };
        
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                output[key] = this.deepMerge(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        }
        
        return output;
    }

    /**
     * Get default header template
     */
    getDefaultHeader() {
        return `
            <div style="font-size: 10px; font-family: 'EB Garamond', serif; 
                        text-align: center; width: 100%; color: #666;">
                <span>The Recursive Garden</span>
            </div>
        `;
    }

    /**
     * Get default footer template
     */
    getDefaultFooter() {
        return `
            <div style="font-size: 10px; font-family: 'EB Garamond', serif; 
                        width: 100%; display: flex; justify-content: space-between; 
                        padding: 0 20px; color: #666;">
                <span>Chapter <span class="pageNumber"></span></span>
                <span>Living Mathematics</span>
            </div>
        `;
    }
}

// Create singleton instance
const generator = new PDFGenerator();

// Export main functions
module.exports = {
    generatePDF: (options) => generator.generatePDF(options),
    diagnose: diagnoseHTML,
    distribute: { pipePDF },
    presets,
    
    // For advanced usage
    PDFGenerator
};