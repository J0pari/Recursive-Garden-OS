/**
 * Simple Markdown to HTML renderer
 * Equivalent to generate_simple_pdf.js functionality
 */

class SimpleRenderer {
    constructor(options) {
        this.options = options;
    }

    render(markdown) {
        // Basic markdown to HTML conversion
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // Wrap in paragraphs
        html = '<p>' + html + '</p>';

        // Build complete HTML document
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Recursive Garden</title>
    <style>
        body {
            font-family: Georgia, serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
        }
        
        h1, h2, h3 {
            font-family: Arial, sans-serif;
            color: #000;
        }
        
        h1 { 
            font-size: 2.5em; 
            margin-bottom: 0.5em;
            text-align: center;
        }
        
        h2 { 
            font-size: 2em; 
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        
        h3 { 
            font-size: 1.5em; 
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        
        p {
            margin-bottom: 1em;
        }
        
        a {
            color: #0066cc;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        strong {
            font-weight: bold;
        }
        
        em {
            font-style: italic;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>
        `.trim();
    }
}

module.exports = { SimpleRenderer };