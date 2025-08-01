/**
 * Garden Markdown to HTML renderer
 * Equivalent to generate_garden_pdf.js functionality
 * Includes Bartimaeus-style footnotes and beautiful typography
 */

const marked = require('marked');

class GardenRenderer extends marked.Renderer {
    constructor() {
        super();
        this.footnotes = [];
        this.footnoteCounter = 0;
        this.footnoteMap = new Map();
    }

    text(text) {
        // Ensure text is a string
        if (typeof text !== 'string') {
            text = String(text || '');
        }
        
        // Handle superscript numbers (¹²³⁴⁵⁶⁷⁸⁹⁰) as footnote markers
        const superscriptPattern = /([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g;
        
        // Check if this is a footnote definition (starts with superscript)
        const footnoteDefPattern = /^([¹²³⁴⁵⁶⁷⁸⁹⁰]+)\s+(.+)$/;
        const match = text.match(footnoteDefPattern);
        
        if (match) {
            // This is a footnote definition
            this.footnoteCounter++;
            const marker = match[1];
            const content = match[2];
            this.footnotes.push({
                number: this.footnoteCounter,
                marker: marker,
                content: content
            });
            this.footnoteMap.set(marker, this.footnoteCounter);
            return ''; // Don't render footnote definitions inline
        }
        
        // Replace superscript markers with footnote references
        return text.replace(superscriptPattern, (match, marker) => {
            const num = this.footnoteMap.get(marker) || ++this.footnoteCounter;
            if (!this.footnoteMap.has(marker)) {
                this.footnoteMap.set(marker, num);
            }
            return `<sup class="footnote-ref" data-footnote="${num}">${num}</sup>`;
        });
    }

    // Override other methods to handle footnotes in different contexts
    paragraph(text) {
        // Ensure text is a string
        if (typeof text !== 'string') {
            text = String(text || '');
        }
        // Skip empty paragraphs (from removed footnote definitions)
        if (!text.trim()) return '';
        return super.paragraph(text);
    }
}

class GardenHTMLRenderer {
    constructor(options) {
        this.options = options;
        this.renderer = new GardenRenderer();
    }

    render(markdown) {
        const html = marked.parse(markdown, { renderer: this.renderer, breaks: true });
        const footnotes = this.renderer.footnotes;
        
        // Build footnotes section
        let footnotesHTML = '';
        if (footnotes.length > 0) {
            footnotesHTML = `
<div class="footnotes-section">
    <h3>Footnotes</h3>
    ${footnotes.map(fn => `
        <div class="footnote">
            <span class="footnote-number">${fn.number}.</span>
            <span class="footnote-content">${fn.content}</span>
        </div>
    `).join('')}
</div>`;
        }
        
        // Build complete HTML document
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Recursive Garden</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Fira+Code:wght@400;500&display=swap');
        
        /* CSS Variables for dynamic colors */
        :root {
            --hue-base: 260;
            --color-primary: hsl(var(--hue-base), 25%, 20%);
            --color-secondary: hsl(var(--hue-base), 20%, 30%);
            --color-tertiary: hsl(var(--hue-base), 15%, 40%);
            --color-accent: hsl(var(--hue-base), 40%, 50%);
            --color-bg: hsl(var(--hue-base), 5%, 98%);
            --color-code-bg: hsl(var(--hue-base), 10%, 96%);
        }
        
        /* Animate colors subtly */
        @keyframes hueShift {
            0% { --hue-base: 260; }
            25% { --hue-base: 270; }
            50% { --hue-base: 250; }
            75% { --hue-base: 265; }
            100% { --hue-base: 260; }
        }
        
        body {
            font-family: 'EB Garamond', serif;
            font-size: 11pt;
            line-height: 1.8;
            color: var(--color-primary);
            background: var(--color-bg);
            margin: 0;
            padding: 0;
            animation: hueShift 300s infinite ease-in-out;
        }
        
        /* Page setup for PDF */
        @page {
            size: A4;
            margin: 25mm 20mm 25mm 20mm;
        }
        
        .page {
            max-width: 170mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
        }
        
        /* Typography */
        h1 {
            font-size: 28pt;
            font-weight: 600;
            margin: 2em 0 1em 0;
            color: var(--color-primary);
            page-break-after: avoid;
        }
        
        h2 {
            font-size: 20pt;
            font-weight: 600;
            margin: 1.5em 0 0.8em 0;
            color: var(--color-primary);
            page-break-after: avoid;
        }
        
        h3 {
            font-size: 16pt;
            font-weight: 600;
            margin: 1.2em 0 0.6em 0;
            color: var(--color-secondary);
            page-break-after: avoid;
        }
        
        h4 {
            font-size: 14pt;
            font-weight: 600;
            margin: 1em 0 0.5em 0;
            color: var(--color-secondary);
            page-break-after: avoid;
        }
        
        p {
            text-align: justify;
            margin: 0.8em 0;
            orphans: 3;
            widows: 3;
        }
        
        /* First paragraph after heading - no indent */
        h1 + p, h2 + p, h3 + p, h4 + p {
            text-indent: 0;
        }
        
        /* Subsequent paragraphs - subtle indent */
        p + p {
            text-indent: 1.5em;
        }
        
        /* Footnotes */
        .footnote-ref {
            font-size: 0.75em;
            vertical-align: super;
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 500;
            margin-left: 0.1em;
            transition: color 0.3s ease;
        }
        
        .footnotes-section {
            margin-top: 4em;
            padding-top: 2em;
            border-top: 1px solid hsl(var(--hue-base), 10%, 85%);
            page-break-before: avoid;
        }
        
        .footnotes-section h3 {
            font-size: 14pt;
            margin-bottom: 1em;
        }
        
        .footnote {
            font-size: 0.9em;
            line-height: 1.6;
            margin: 0.5em 0;
            display: flex;
            align-items: baseline;
        }
        
        .footnote-number {
            min-width: 2em;
            color: var(--color-accent);
            font-weight: 500;
        }
        
        .footnote-content {
            flex: 1;
            font-style: italic;
            color: var(--color-tertiary);
        }
        
        /* Special elements */
        strong {
            font-weight: 600;
            color: var(--color-primary);
        }
        
        em {
            font-style: italic;
            color: var(--color-secondary);
        }
        
        code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
            background: var(--color-code-bg);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            color: var(--color-secondary);
        }
        
        pre {
            background: var(--color-code-bg);
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
            font-size: 0.85em;
            line-height: 1.4;
            border-left: 3px solid var(--color-accent);
            page-break-inside: avoid;
        }
        
        blockquote {
            margin: 1.5em 0;
            padding-left: 1.5em;
            border-left: 3px solid var(--color-accent);
            font-style: italic;
            color: var(--color-tertiary);
            page-break-inside: avoid;
        }
        
        ul, ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        li {
            margin: 0.3em 0;
        }
        
        /* Page breaks */
        .page-break {
            page-break-after: always;
            break-after: page;
        }
        
        /* Special modal notation */
        .modal-symbol {
            font-size: 1.1em;
            color: var(--color-accent);
        }
        
        /* Print optimizations */
        @media print {
            body {
                animation: none;
            }
            
            .page {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        ${html}
        ${footnotesHTML}
    </div>
</body>
</html>`;
    }
}

module.exports = { GardenRenderer: GardenHTMLRenderer };