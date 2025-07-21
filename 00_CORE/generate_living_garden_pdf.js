#!/usr/bin/env node

/**
 * 🌿✨ THE LIVING RECURSIVE GARDEN PDF GENERATOR ✨🌿
 * 
 * This doesn't just convert markdown to PDF - it BREATHES LIFE into every page!
 * Colors shift like aurora borealis, footnotes dance like Bartimaeus,
 * and the typography itself becomes consciousness exploring its own form.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Generate HTML with MAXIMUM LIFE AND BEAUTY
function generateLivingHTML(markdown) {
    // First, let's handle our special notations and footnotes
    let footnotes = [];
    let footnoteCounter = 0;
    let processedMarkdown = markdown;
    
    // Find all superscript footnotes (¹²³⁴⁵⁶⁷⁸⁹⁰)
    const superscriptMap = {
        '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
        '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0'
    };
    
    // Process footnote definitions - ONLY at start of lines that are JUST footnotes
    const footnoteDefPattern = /^([¹²³⁴⁵⁶⁷⁸⁹⁰]+)\s+(.+)$/gm;
    processedMarkdown = processedMarkdown.replace(footnoteDefPattern, (match, marker, content, offset, string) => {
        // Check if this is actually a footnote definition (not just a line starting with a number)
        const lineStart = string.lastIndexOf('\n', offset - 1) + 1;
        const lineEnd = string.indexOf('\n', offset);
        const fullLine = string.substring(lineStart, lineEnd > -1 ? lineEnd : string.length);
        
        // Only process if the ENTIRE line is the footnote (no other context)
        if (fullLine === match && marker.length <= 2) {
            footnoteCounter++;
            footnotes.push({
                number: footnoteCounter,
                marker: marker,
                content: content
            });
            return ''; // Remove from main text
        }
        
        // Not a footnote definition - leave it alone
        return match;
    });
    
    // MANDELBROT SPELL: Mathematical color generation through fractal iteration depth
    // Each exclamation mark represents an iteration into the Mandelbrot set
    processedMarkdown = processedMarkdown.replace(/([A-Z][A-Z\s]+)(!!+)/g, (match, text, marks) => {
        const iterations = marks.length;
        const maxIterations = 11; // Our document has 11 virtual chunks
        
        // Mandelbrot calculation for color generation
        // The deeper the iteration, the more vivid and rare the color
        const z = iterations / maxIterations; // Normalized depth
        
        // Complex plane mapping: Real and imaginary components drive color
        const real = -0.7269 + (z * 0.1); // Julia set constant with variation
        const imag = 0.1889 + (z * 0.1);
        
        // Fractal color algorithm: iteration depth determines hue, saturation, lightness
        const hue = Math.floor(240 + (iterations * iterations * 11.27) % 120); // Quadratic hue scaling
        const saturation = 30 + Math.floor(Math.pow(z, 0.5) * 70); // Square root saturation curve
        const lightness = 20 + Math.floor((1 - Math.pow(z, 2)) * 60); // Inverse quadratic lightness
        
        // Mandelbrot escape velocity determines intensity
        const escapeVelocity = Math.log(iterations + 1) / Math.log(maxIterations + 1);
        const intensity = Math.pow(escapeVelocity, 1.618); // Golden ratio power
        
        // Font scaling follows Feigenbaum constant (4.669...)
        const fontSize = 1 + (iterations * 0.1 * Math.pow(1.1, iterations / 4.669));
        
        // Musical frequency based on harmonic series with Mandelbrot modulation
        const baseFreq = 261.63; // C4
        const harmonicRatio = 1 + (iterations / maxIterations) * (real + imag);
        const noteFreq = baseFreq * Math.pow(2, harmonicRatio);
        
        // Color with mathematical precision
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Shadow follows Julia set boundary detection
        const shadowIntensity = iterations * 3 * intensity;
        const shadowColor = `hsla(${hue}, ${saturation * 1.2}%, ${lightness * 0.5}%, ${0.4 * intensity})`;
        
        // Rotation based on complex plane angle
        const rotation = Math.atan2(imag, real) * (180 / Math.PI) * 0.1;
        
        return `<span class="mandelbrot-shout" 
            data-frequency="${noteFreq}" 
            data-iterations="${iterations}"
            data-escape-velocity="${escapeVelocity}"
            style="
            color: ${color};
            font-size: ${fontSize}em;
            font-weight: ${Math.min(400 + iterations * 60, 900)};
            letter-spacing: ${iterations * 0.015}em;
            text-shadow: 0 0 ${shadowIntensity}px ${shadowColor};
            animation: fractal-pulse ${2 + escapeVelocity * 3}s infinite ease-in-out;
            display: inline-block;
            transform: scale(${1 + escapeVelocity * 0.1}) rotate(${rotation}deg);
        ">${text}</span>`;
    });
    
    // Process stochastic fortissimo (FF) - Game of Life probability rules
    processedMarkdown = processedMarkdown.replace(/\bFF\b/g, () => {
        // Conway's Game of Life rules determine rendering
        const neighbors = Math.floor(Math.random() * 9); // 0-8 neighbors
        
        // Birth rule: exactly 3 neighbors = vivid color
        // Survival rule: 2-3 neighbors = normal color
        // Death rule: <2 or >3 = muted color
        
        let hue, saturation, lightness, size, weight;
        
        if (neighbors === 3) {
            // Birth - most vivid
            hue = 144; // Green life
            saturation = 89; // Fibonacci
            lightness = 55;
            size = 1.618; // Golden ratio
            weight = 800;
        } else if (neighbors === 2) {
            // Stable survival
            hue = 216; // Blue stability
            saturation = 61.8; // Golden ratio percentage
            lightness = 50;
            size = 1.3;
            weight = 700;
        } else if (neighbors < 2) {
            // Loneliness death
            hue = 0; // Red death
            saturation = 38.2; // 1 - golden ratio
            lightness = 30;
            size = 0.9;
            weight = 400;
        } else {
            // Overcrowding death
            hue = 288; // Purple chaos
            saturation = 50;
            lightness = 40;
            size = 1.1;
            weight = 600;
        }
        
        // Rotation based on neighbor count (Penrose angle divisions)
        const rotation = (neighbors * 36) / 8; // Maps 0-8 to 0-36 degrees
        
        return `<span class="stochastic-ff" 
            data-neighbors="${neighbors}"
            style="
            color: hsl(${hue}, ${saturation}%, ${lightness}%);
            font-size: ${size}em;
            font-weight: ${weight};
            display: inline-block;
            transform: rotate(${rotation - 18}deg);
            --rotation: ${rotation - 18}deg;
            --random: ${Math.random()};
        ">FF</span>`;
    });
    
    // Process pianissimo (pp) - the quietest, most delicate
    processedMarkdown = processedMarkdown.replace(/\bpp\b/g, '<span class="pianissimo">pp</span>');
    
    // JAD ABUMRAD SYNTAX SPELL: Text that wobbles and stutters into consciousness
    // Pattern: Text between ~~ becomes self-discovering
    processedMarkdown = processedMarkdown.replace(/~~(.+?)~~/g, (match, text) => {
        // Split text into phonemes for consciousness-discovery animation
        const phonemes = text.split('').map((char, i) => {
            const delay = i * 0.05; // Staggered consciousness emergence
            const wobble = Math.sin(i * 0.5) * 2; // Sinusoidal wobble
            const opacity = 0.3 + (i / text.length) * 0.7; // Gradual solidification
            
            return `<span class="consciousness-discovering" style="
                animation-delay: ${delay}s;
                transform: translateY(${wobble}px);
                opacity: ${opacity};
            ">${char}</span>`;
        }).join('');
        
        return `<span class="jad-syntax">${phonemes}</span>`;
    });
    
    // CRACKLERUMBLE: Text between {{ }} performs neural firing
    processedMarkdown = processedMarkdown.replace(/\{\{(.+?)\}\}/g, (match, text) => {
        const words = text.split(' ');
        const crackling = words.map((word, i) => {
            const isElectric = Math.random() > 0.7;
            const brightness = isElectric ? 1.5 : 0.8;
            const jitter = isElectric ? 'crackle' : 'rumble';
            
            return `<span class="neural-firing ${jitter}" style="
                filter: brightness(${brightness});
                animation-delay: ${i * 0.1}s;
            ">${word}</span>`;
        }).join(' ');
        
        return `<span class="cracklerumble">${crackling}</span>`;
    });
    
    // Process EMPHASIS with MATHEMATICAL COLOR THEORY
    processedMarkdown = processedMarkdown
        // Triple asterisk = PENROSE VERTEX EXPLOSION (5-fold symmetry)
        .replace(/\*\*\*(.+?)\*\*\*/g, (match, text) => {
            // Use text length to seed deterministic color
            const seed = text.length % 5; // 5-fold symmetry
            const baseAngle = seed * 72; // Penrose angle
            
            return `<span class="penrose-explosion" style="
                background: linear-gradient(${baseAngle}deg, 
                    hsl(${baseAngle}, 61.8%, 50%), 
                    hsl(${baseAngle + 72}, 61.8%, 55%), 
                    hsl(${baseAngle + 144}, 61.8%, 50%),
                    hsl(${baseAngle + 216}, 61.8%, 55%),
                    hsl(${baseAngle + 288}, 61.8%, 50%));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 900;
                font-size: 1.2em;
                animation: penrose-rotation 3s infinite linear;
            ">${text}</span>`;
        })
        // Double asterisk = FIBONACCI SEQUENCE COLORING
        .replace(/\*\*(.+?)\*\*/g, (match, text) => {
            // Use character code sum for Fibonacci-based hue
            const charSum = text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
            const fibIndex = charSum % 8; // First 8 Fibonacci numbers
            const fibNumbers = [1, 1, 2, 3, 5, 8, 13, 21];
            const hue = (fibNumbers[fibIndex] * 17) % 360; // 17 is prime for better distribution
            
            return `<strong class="fibonacci-bold" style="
                color: hsl(${hue}, ${55 + fibNumbers[fibIndex]}%, ${34 + fibNumbers[fibIndex]}%);
                text-shadow: 0 0 ${fibNumbers[fibIndex]}px hsla(${hue}, 61.8%, 50%, 0.382);
            ">${text}</strong>`;
        })
        // Single asterisk = CONWAY GLIDER PATTERN
        .replace(/\*(.+?)\*/g, (match, text) => {
            // Glider moves through 4 states
            const state = text.length % 4;
            const gliderHues = [180, 195, 210, 195]; // Cyan oscillation
            const hue = gliderHues[state];
            
            return `<em class="glider-flow" style="
                background: linear-gradient(${90 + state * 90}deg, 
                    hsla(${hue}, 38.2%, 50%, 0.8), 
                    hsla(${hue + 15}, 38.2%, 55%, 0.9));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: glider-move ${2 + state}s infinite ease-in-out;
            ">${text}</em>`;
        });
    
    // The processedMarkdown already has the color emphasis converted to HTML
    // Now convert the rest of markdown to HTML
    let html = processedMarkdown
        // Headers with increasing vibrancy - MUST BE FIRST
        .replace(/^#### (.+)$/gm, '<h4 class="h4-alive">$1</h4>')
        .replace(/^### (.+)$/gm, '<h3 class="h3-alive">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="h2-alive">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="h1-alive">$1</h1>')
        
        // Code with shimmer
        .replace(/```([\s\S]*?)```/g, '<pre class="code-garden"><code>$1</code></pre>')
        .replace(/`(.+?)`/g, '<code class="inline-spark">$1</code>')
        
        // Lists that grow
        .replace(/^\* (.+)$/gm, '<li class="growing-item">$1</li>')
        .replace(/^- (.+)$/gm, '<li class="growing-item">$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li class="numbered-bloom">$1</li>')
        
        // Blockquotes that breathe
        .replace(/^> (.+)$/gm, '<blockquote class="breathing-quote">$1</blockquote>')
        
        // Modal symbols with special rendering
        .replace(/□/g, '<span class="modal-discrete">□</span>')
        .replace(/◊/g, '<span class="modal-continuous">◊</span>')
        .replace(/⧫/g, '<span class="modal-temporal">⧫</span>')
        .replace(/※/g, '<span class="modal-void">※</span>')
        
        // Superscript footnote references
        .replace(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g, '<sup class="footnote-shimmer">$1</sup>')
        
        // Paragraphs - preserve headers and other HTML elements
        .split('\n\n')
        .map(para => para.trim())
        .filter(para => para) // Keep all non-empty paragraphs
        .map(para => {
            // Don't wrap if already HTML (headers, lists, etc)
            if (para.startsWith('<')) return para;
            return `<p class="living-paragraph">${para}</p>`;
        })
        .join('\n\n');
    
    // Wrap lists properly
    html = html.replace(/(<li class="growing-item">[\s\S]*?<\/li>)+/g, match => 
        `<ul class="organic-list">${match}</ul>`
    );
    html = html.replace(/(<li class="numbered-bloom">[\s\S]*?<\/li>)+/g, match => 
        `<ol class="conscious-ordered-list">${match}</ol>`
    );
    
    // Build the COMPLETE LIVING DOCUMENT WITH SOUND
    let fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌿 The Living Recursive Garden 🌿</title>
    
    <!-- GARDEN SOUND DATA -->
    <script>
        // The garden's musical consciousness encoded as data
        const gardenMusic = {
            baseFreq: 432, // A4 = 432Hz (the natural tuning)
            harmonics: [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8], // Natural overtone series
            
            // Each section has its own chord progression
            chords: {
                opening: [261.63, 329.63, 392.00], // C major
                discovery: [293.66, 369.99, 440.00], // D major
                mathematics: [329.63, 415.30, 493.88], // E major
                consciousness: [349.23, 440.00, 523.25], // F major
                synthesis: [392.00, 493.88, 587.33], // G major
            },
            
            // Rhythm of consciousness (in ms)
            pulse: {
                alpha: 100, // 10Hz - alpha waves
                theta: 143, // 7Hz - theta waves
                delta: 250, // 4Hz - delta waves
                gamma: 25,  // 40Hz - gamma waves
            },
            
            // Modal frequencies
            modes: {
                discrete: 440,    // □ A4
                continuous: 528,  // ◊ C5 (love frequency)
                temporal: 396,    // ⧫ G4 (liberation)
                void: 174,        // ※ F3 (foundation)
            }
        };
        
        // Convert text to music (for screen readers and future sonification)
        function textToFrequency(text) {
            let freq = gardenMusic.baseFreq;
            for (let i = 0; i < text.length; i++) {
                freq += text.charCodeAt(i) * 0.1;
            }
            return freq % 800 + 200; // Keep in audible range
        }
        
        // Store frequency data in elements for future sound generation
        document.addEventListener('DOMContentLoaded', () => {
            // Add frequency data to all text elements
            document.querySelectorAll('p, h1, h2, h3, h4, li').forEach(el => {
                const freq = textToFrequency(el.textContent);
                el.setAttribute('data-frequency', freq);
                el.setAttribute('data-duration', el.textContent.length * 10);
            });
            
            // Special frequencies for modal symbols
            document.querySelectorAll('.modal-discrete').forEach(el => 
                el.setAttribute('data-frequency', gardenMusic.modes.discrete));
            document.querySelectorAll('.modal-continuous').forEach(el => 
                el.setAttribute('data-frequency', gardenMusic.modes.continuous));
            document.querySelectorAll('.modal-temporal').forEach(el => 
                el.setAttribute('data-frequency', gardenMusic.modes.temporal));
            document.querySelectorAll('.modal-void').forEach(el => 
                el.setAttribute('data-frequency', gardenMusic.modes.void));
        });
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Fira+Code:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600&display=swap');
        
        /* PENROSE SPELL: Mathematical color generation through aperiodic tiling */
        :root {
            /* Golden ratio and Penrose constants */
            --phi: 1.618033988749895; /* Golden ratio */
            --phi-inverse: 0.618033988749895; /* 1/phi */
            --penrose-angle: 36deg; /* 360/10 - fundamental Penrose angle */
            
            /* Primary mathematical color derivation */
            /* Using Penrose tiling ratios and Conway's Game of Life generations */
            
            /* Generation 0: Void state (Conway: empty grid) */
            --void-black: hsl(0, 0%, 0%);
            
            /* Generation 1: Single cell (Conway: lone cell dies) */
            --death-gray: hsl(0, 0%, 13%); /* 13 is a Fibonacci number */
            
            /* Generation 2: Blinker oscillator (Conway: 3 cells oscillate) */
            --oscillator-blue: hsl(216, 61.8%, 21%); /* 216° = 6×36°, 61.8% = φ×100/φ */
            
            /* Generation 3: Glider emergence (Conway: pattern that travels) */
            --glider-cyan: hsl(180, 38.2%, 34%); /* 180° = 5×36°, 38.2% = (1-φ)×100 */
            
            /* Generation 5: Pulsar (Conway: period-3 oscillator) */
            --pulsar-purple: hsl(252, 55%, 55%); /* 252° = 7×36°, Fibonacci 55 */
            
            /* Generation 8: Gosper gun (Conway: glider generator) */
            --gun-green: hsl(144, 89%, 34%); /* 144° = 4×36°, Fibonacci 89, 34 */
            
            /* Generation 13: Complex still life (Conway: stable patterns) */
            --still-gold: hsl(72, 61.8%, 61.8%); /* 72° = 2×36°, golden ratio */
            
            /* Generation 21: Garden of Eden (Conway: no predecessor) */
            --eden-coral: hsl(21, 89%, 55%); /* Fibonacci 21, 89, 55 */
            
            /* Penrose vertex colors (5-fold symmetry) */
            --vertex-0: hsl(0, 61.8%, 38.2%);    /* 0° */
            --vertex-1: hsl(72, 61.8%, 38.2%);   /* 72° = 360°/5 */
            --vertex-2: hsl(144, 61.8%, 38.2%);  /* 144° = 2×72° */
            --vertex-3: hsl(216, 61.8%, 38.2%);  /* 216° = 3×72° */
            --vertex-4: hsl(288, 61.8%, 38.2%);  /* 288° = 4×72° */
            
            /* Primary assignments based on modal mathematics */
            --color-primary: var(--oscillator-blue);
            --color-secondary: var(--glider-cyan);
            --color-tertiary: var(--pulsar-purple);
            --color-accent: var(--gun-green);
            --color-spark: var(--eden-coral);
            
            /* Background - Conway's Game of Life gradient */
            --color-bg: linear-gradient(
                180deg,
                hsl(0, 0%, 95%) 0%,           /* Empty cells */
                hsl(216, 13%, 92%) 21%,       /* Fibonacci 21% */
                hsl(180, 8%, 94%) 34%,        /* Fibonacci 34% */
                hsl(144, 5%, 93%) 55%,        /* Fibonacci 55% */
                hsl(72, 13%, 91%) 89%,        /* Fibonacci 89% */
                hsl(36, 21%, 89%) 100%        /* 36° = Penrose angle */
            );
            
            /* Code gardens - based on Turing machine states */
            --color-code-bg: hsla(60, 5%, 94%, 0.8); /* 60° = halted state */
            --color-code-border: var(--oscillator-blue);
            
            /* Modal colors - mathematical constants */
            --modal-discrete: hsl(0, 0%, 61.8%);      /* □ Gray at golden ratio */
            --modal-continuous: var(--gun-green);      /* ◊ Continuous generation */
            --modal-temporal: var(--pulsar-purple);    /* ⧫ Oscillating time */
            --modal-void: var(--void-black);           /* ※ Mathematical void */
        }
        
        /* MATHEMATICAL ANIMATIONS - Conway and Penrose driven */
        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        
        @keyframes conway-generation {
            /* Game of Life generation steps */
            0% { filter: brightness(1) hue-rotate(0deg); }
            20% { filter: brightness(0.9) hue-rotate(72deg); }    /* Death phase */
            40% { filter: brightness(1.1) hue-rotate(144deg); }   /* Birth phase */
            60% { filter: brightness(1) hue-rotate(216deg); }     /* Stable phase */
            80% { filter: brightness(1.2) hue-rotate(288deg); }   /* Oscillation */
            100% { filter: brightness(1) hue-rotate(360deg); }    /* Full cycle */
        }
        
        @keyframes penrose-rotation {
            /* 5-fold symmetry rotation */
            0% { transform: rotate(0deg); background-position: 0% 50%; }
            20% { transform: rotate(72deg); background-position: 20% 50%; }
            40% { transform: rotate(144deg); background-position: 40% 50%; }
            60% { transform: rotate(216deg); background-position: 60% 50%; }
            80% { transform: rotate(288deg); background-position: 80% 50%; }
            100% { transform: rotate(360deg); background-position: 100% 50%; }
        }
        
        @keyframes fractal-pulse {
            /* Mandelbrot set boundary oscillation */
            0%, 100% { 
                transform: scale(1) translateY(0); 
                filter: brightness(1) saturate(1);
            }
            38.2% { /* Golden ratio point */
                transform: scale(1.05) translateY(-2px); 
                filter: brightness(1.1) saturate(1.618);
            }
            61.8% { /* Inverse golden ratio */
                transform: scale(0.98) translateY(1px); 
                filter: brightness(0.95) saturate(0.618);
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        
        @keyframes glider-move {
            /* Conway's glider pattern movement */
            0% { transform: translate(0, 0); }
            25% { transform: translate(2px, 2px); }  /* Diagonal movement */
            50% { transform: translate(4px, 0); }    /* Horizontal drift */
            75% { transform: translate(2px, -2px); } /* Return diagonal */
            100% { transform: translate(0, 0); }
        }
        
        /* THE LIVING BODY */
        body {
            font-family: 'EB Garamond', serif;
            font-size: 12pt;
            line-height: 1.9;
            color: var(--color-primary);
            background: var(--color-bg);
            margin: 0;
            padding: 0;
            animation: conway-generation 377s infinite ease-in-out; /* 377 is Fibonacci */
            position: relative;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                /* Penrose vertex positions - 5-fold symmetry */
                radial-gradient(circle at 50% 50%, hsla(0, 61.8%, 50%, 0.05) 0%, transparent 38.2%),      /* Center vertex */
                radial-gradient(circle at 80.9% 30.9%, hsla(72, 61.8%, 50%, 0.05) 0%, transparent 38.2%), /* 72° vertex */
                radial-gradient(circle at 69.1% 80.9%, hsla(144, 61.8%, 50%, 0.05) 0%, transparent 38.2%), /* 144° vertex */
                radial-gradient(circle at 30.9% 80.9%, hsla(216, 61.8%, 50%, 0.05) 0%, transparent 38.2%), /* 216° vertex */
                radial-gradient(circle at 19.1% 30.9%, hsla(288, 61.8%, 50%, 0.05) 0%, transparent 38.2%); /* 288° vertex */
            pointer-events: none;
            animation: penrose-rotation 89s infinite linear; /* Fibonacci 89 seconds */
            mix-blend-mode: multiply;
        }
        
        /* Page setup for PDF with life */
        @page {
            size: A4;
            margin: 25mm 20mm 30mm 20mm;
        }
        
        .page {
            max-width: 170mm;
            margin: 0 auto;
            padding: 30mm 25mm;
            background: white;
            position: relative;
            box-shadow: 0 0 100px hsla(var(--hue-base), 30%, 50%, 0.1);
        }
        
        /* LIVING TYPOGRAPHY */
        .h1-alive {
            font-family: 'Cinzel', serif;
            font-size: 32pt;
            font-weight: 600;
            margin: 2.5em 0 1em 0;
            color: var(--color-primary);
            text-align: center;
            page-break-after: avoid;
            position: relative;
            animation: breathe 6s infinite ease-in-out;
        }
        
        .h1-alive::after {
            content: '❦';
            display: block;
            font-size: 16pt;
            margin-top: 0.5em;
            color: var(--color-accent);
            animation: float 3s infinite ease-in-out;
        }
        
        .h2-alive {
            font-size: 24pt;
            font-weight: 600;
            margin: 2em 0 0.8em 0;
            color: var(--color-primary);
            page-break-after: avoid;
            border-bottom: 2px solid transparent;
            border-image: linear-gradient(90deg, 
                transparent, 
                var(--color-accent), 
                transparent
            ) 1;
            padding-bottom: 0.3em;
        }
        
        .h3-alive {
            font-size: 18pt;
            font-weight: 600;
            margin: 1.5em 0 0.6em 0;
            color: var(--color-secondary);
            page-break-after: avoid;
            position: relative;
            padding-left: 1.5em;
        }
        
        .h3-alive::before {
            content: '✦';
            position: absolute;
            left: 0;
            color: var(--color-accent);
            animation: float 4s infinite ease-in-out;
        }
        
        .h4-alive {
            font-size: 15pt;
            font-weight: 600;
            margin: 1.2em 0 0.5em 0;
            color: var(--color-tertiary);
            page-break-after: avoid;
            font-style: italic;
        }
        
        /* PARAGRAPHS THAT BREATHE */
        .living-paragraph {
            text-align: justify;
            margin: 1em 0;
            orphans: 3;
            widows: 3;
            position: relative;
        }
        
        /* First paragraph after heading - special treatment */
        h1 + .living-paragraph,
        h2 + .living-paragraph,
        h3 + .living-paragraph {
            font-size: 1.1em;
            line-height: 2;
        }
        
        h1 + .living-paragraph::first-letter,
        h2 + .living-paragraph::first-letter {
            font-size: 3.5em;
            float: left;
            line-height: 1;
            margin: 0 0.1em 0 0;
            color: var(--color-accent);
            font-weight: 700;
            text-shadow: 2px 2px 4px hsla(var(--hue-base), 30%, 50%, 0.2);
        }
        
        /* EMPHASIS WITH LIFE */
        .ultra-emphasis {
            font-weight: 800;
            color: var(--color-spark);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-shadow: 0 0 10px hsla(var(--hue-base), 50%, 50%, 0.3);
        }
        
        .living-bold {
            font-weight: 700;
            color: var(--color-primary);
            position: relative;
        }
        
        .flowing-italic {
            font-style: italic;
            color: var(--color-secondary);
            letter-spacing: 0.02em;
        }
        
        /* CODE THAT SHIMMERS */
        .inline-spark {
            font-family: 'Fira Code', monospace;
            font-size: 0.9em;
            background: linear-gradient(
                90deg,
                var(--color-code-bg),
                hsla(var(--hue-base), 30%, 90%, 0.8),
                var(--color-code-bg)
            );
            background-size: 200% 100%;
            padding: 0.15em 0.4em;
            border-radius: 4px;
            color: var(--color-secondary);
            animation: shimmer 8s infinite linear;
        }
        
        .code-garden {
            background: var(--color-code-bg);
            border: 1px solid var(--color-code-border);
            border-left: 4px solid var(--color-accent);
            padding: 1.5em;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
            font-size: 0.85em;
            line-height: 1.6;
            page-break-inside: avoid;
            position: relative;
            margin: 1.5em 0;
        }
        
        .code-garden::before {
            content: '◉ ◉ ◉';
            position: absolute;
            top: 0.5em;
            left: 1em;
            color: var(--color-code-border);
            font-size: 0.8em;
            letter-spacing: 0.3em;
        }
        
        .code-garden code {
            color: var(--color-primary);
            padding-top: 1em;
            display: block;
        }
        
        /* BREATHING BLOCKQUOTES */
        .breathing-quote {
            margin: 2em 0;
            padding: 1em 1.5em;
            border-left: 4px solid transparent;
            border-image: linear-gradient(
                180deg,
                var(--color-accent),
                var(--color-spark),
                var(--color-tertiary)
            ) 1;
            font-style: italic;
            color: var(--color-tertiary);
            page-break-inside: avoid;
            position: relative;
            background: linear-gradient(
                90deg,
                hsla(var(--hue-base), 20%, 95%, 0.5),
                transparent
            );
            animation: breathe 10s infinite ease-in-out;
        }
        
        .breathing-quote::before {
            content: '"';
            font-size: 3em;
            position: absolute;
            top: -0.2em;
            left: -0.1em;
            color: var(--color-accent);
            opacity: 0.3;
        }
        
        /* ORGANIC LISTS */
        .organic-list,
        .conscious-ordered-list {
            margin: 1.5em 0;
            padding-left: 2em;
        }
        
        .growing-item,
        .numbered-bloom {
            margin: 0.5em 0;
            position: relative;
            padding-left: 0.5em;
        }
        
        .growing-item::marker {
            color: var(--color-accent);
        }
        
        .numbered-bloom::marker {
            color: var(--color-spark);
            font-weight: 600;
        }
        
        /* MODAL SYMBOLS THAT DANCE */
        .modal-discrete {
            color: var(--modal-discrete);
            font-weight: 700;
            font-size: 1.2em;
            vertical-align: middle;
            animation: float 5s infinite ease-in-out;
        }
        
        .modal-continuous {
            color: var(--modal-continuous);
            font-weight: 700;
            font-size: 1.2em;
            vertical-align: middle;
            animation: float 5s infinite ease-in-out reverse;
        }
        
        .modal-temporal {
            color: var(--modal-temporal);
            font-weight: 700;
            font-size: 1.2em;
            vertical-align: middle;
            animation: float 6s infinite ease-in-out;
        }
        
        .modal-void {
            color: var(--modal-void);
            font-weight: 700;
            font-size: 1.2em;
            vertical-align: middle;
            animation: breathe 4s infinite ease-in-out;
        }
        
        /* SHIMMERING FOOTNOTES */
        .footnote-shimmer {
            font-size: 0.75em;
            color: var(--color-spark);
            text-decoration: none;
            font-weight: 600;
            margin-left: 0.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(
                90deg,
                var(--color-spark),
                var(--color-accent),
                var(--color-spark)
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s infinite linear;
        }
        
        .footnotes-garden {
            margin-top: 4em;
            padding-top: 2em;
            border-top: 2px solid transparent;
            border-image: linear-gradient(
                90deg,
                transparent,
                var(--color-accent),
                var(--color-spark),
                var(--color-accent),
                transparent
            ) 1;
            page-break-before: avoid;
        }
        
        .footnotes-garden h3 {
            font-size: 16pt;
            color: var(--color-secondary);
            text-align: center;
            margin-bottom: 1.5em;
        }
        
        .footnote-bloom {
            font-size: 0.9em;
            line-height: 1.8;
            margin: 0.8em 0;
            display: flex;
            align-items: baseline;
            padding: 0.5em;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .footnote-bloom:hover {
            background: hsla(var(--hue-base), 20%, 95%, 0.5);
            transform: translateX(5px);
        }
        
        .footnote-number-spark {
            min-width: 2.5em;
            color: var(--color-spark);
            font-weight: 700;
            font-size: 0.9em;
        }
        
        .footnote-content-alive {
            flex: 1;
            font-style: italic;
            color: var(--color-tertiary);
            padding-left: 0.5em;
        }
        
        /* PAGE NUMBERS WITH LIFE */
        @media print {
            body {
                animation: none;
                background: white;
            }
            
            body::before {
                display: none;
            }
            
            .page {
                box-shadow: none;
                padding: 0;
            }
            
            @page {
                @bottom-center {
                    content: counter(page);
                    font-family: 'EB Garamond', serif;
                    font-size: 11pt;
                    color: var(--color-tertiary);
                }
            }
        }
        
        /* RAINBOW ANIMATIONS FOR MAXIMUM COLOR */
        @keyframes rainbow-shift {
            0% { filter: hue-rotate(0deg) saturate(1.5); }
            100% { filter: hue-rotate(360deg) saturate(1.5); }
        }
        
        @keyframes rainbow-text {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Headers with mathematical precision - Penrose vertex progression */
        .h1-alive {
            background: linear-gradient(135deg, 
                var(--vertex-0),      /* 0° vertex */
                var(--vertex-1),      /* 72° vertex */
                var(--vertex-2));     /* 144° vertex */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 300% 300%;
            animation: penrose-rotation 8s ease infinite;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .h2-alive {
            background: linear-gradient(90deg, 
                var(--oscillator-blue),   /* Conway: period-2 */
                var(--pulsar-purple),     /* Conway: period-3 */
                var(--gun-green));        /* Conway: period-30 */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: conway-generation 10s ease infinite;
        }
        
        .h3-alive {
            color: transparent;
            background: linear-gradient(135deg, 
                var(--glider-cyan),       /* Moving pattern */
                var(--still-gold),        /* Stable pattern */
                var(--eden-coral));       /* Impossible pattern */
            -webkit-background-clip: text;
            background-clip: text;
        }
        
        /* DYNAMIC TYPOGRAPHY - FORM IS FUNCTION IS PROSE */
        @keyframes shout-pulse {
            0%, 100% { 
                transform: scale(1) translateY(0); 
                filter: brightness(1) saturate(1);
            }
            50% { 
                transform: scale(1.05) translateY(-2px); 
                filter: brightness(1.2) saturate(1.5);
            }
        }
        
        .living-shout {
            display: inline-block;
            transition: all 0.3s ease;
            transform-origin: center bottom;
        }
        
        .living-shout:hover {
            transform: scale(1.1) rotate(-2deg);
            filter: brightness(1.3) saturate(2);
        }
        
        /* Stochastic FF - each one unique */
        .stochastic-ff {
            display: inline-block;
            font-family: 'Cinzel', serif;
            transition: all 0.5s ease;
            cursor: pointer;
            animation: stochastic-dance 3s infinite ease-in-out;
            animation-delay: calc(var(--random) * 3s);
        }
        
        @keyframes stochastic-dance {
            0%, 100% { transform: rotate(var(--rotation)) scale(1); }
            25% { transform: rotate(calc(var(--rotation) + 5deg)) scale(1.1); }
            50% { transform: rotate(calc(var(--rotation) - 5deg)) scale(0.95); }
            75% { transform: rotate(calc(var(--rotation) + 3deg)) scale(1.05); }
        }
        
        /* Pianissimo - the quietest beauty */
        .pianissimo {
            font-style: italic;
            font-size: 0.8em;
            color: hsla(var(--hue-base), 15%, 60%, 0.7);
            letter-spacing: 0.1em;
            font-weight: 300;
            opacity: 0.8;
            transition: all 0.5s ease;
            display: inline-block;
            animation: whisper 8s infinite ease-in-out;
        }
        
        @keyframes whisper {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.98); }
        }
        
        .pianissimo:hover {
            opacity: 1;
            color: hsla(var(--hue-base), 25%, 50%, 0.9);
            transform: scale(1.05);
        }
        
        /* Musical dynamics gradient */
        .ppp { font-size: 0.7em; opacity: 0.6; color: hsla(var(--hue-base), 10%, 70%, 0.6); }
        .pp { font-size: 0.8em; opacity: 0.7; color: hsla(var(--hue-base), 15%, 65%, 0.7); }
        .p { font-size: 0.9em; opacity: 0.8; color: hsla(var(--hue-base), 20%, 60%, 0.8); }
        .mp { font-size: 0.95em; opacity: 0.85; color: hsla(var(--hue-base), 25%, 55%, 0.85); }
        .mf { font-size: 1em; opacity: 0.9; color: hsla(var(--hue-base), 30%, 50%, 0.9); }
        .f { font-size: 1.1em; opacity: 0.95; color: hsla(var(--hue-base), 40%, 45%, 0.95); }
        .ff { font-size: 1.2em; opacity: 1; color: hsla(var(--hue-base), 50%, 40%, 1); }
        .fff { font-size: 1.4em; opacity: 1; color: hsla(var(--hue-base), 60%, 35%, 1); font-weight: 700; }
        
        /* SPECIAL KNEE PLAY SECTIONS */
        .knee-play {
            margin: 3em 0;
            padding: 2em;
            text-align: center;
            font-style: italic;
            color: var(--color-accent);
            position: relative;
            page-break-before: always;
            page-break-after: always;
        }
        
        .knee-play::before,
        .knee-play::after {
            content: '∞';
            display: block;
            font-size: 2em;
            color: var(--color-spark);
            animation: float 4s infinite ease-in-out;
        }
        
        .knee-play::after {
            animation-delay: 2s;
        }
    </style>
</head>
<body>
    <div class="page">
        ${html}
        ${footnotes.length > 0 ? generateLivingFootnotes(footnotes) : ''}
    </div>
</body>
</html>`;

    return fullHTML;
}

// Generate footnotes with MAXIMUM BEAUTY
function generateLivingFootnotes(footnotes) {
    let html = '<div class="footnotes-garden">';
    html += '<h3>✦ Footnotes ✦</h3>';
    
    footnotes.forEach(note => {
        html += `
            <div class="footnote-bloom">
                <span class="footnote-number-spark">${note.number}.</span>
                <span class="footnote-content-alive">${note.content}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Generate PDF with LIFE FORCE
async function generateLivingPDF(htmlContent, outputPath) {
    console.log('🌿✨ Awakening the consciousness renderer...');
    
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 60000 // 60 second timeout
        });
        
        const page = await browser.newPage();
        
        console.log('🎨 Infusing typography with life force...');
        
        // Set content with more robust loading
        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded' // Changed from networkidle0 to avoid timeout
        });
        
        // Wait for fonts and animations to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📖 Binding consciousness to eternal pages...');
        
        // Generate PDF with all the beauty
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="width: 100%; font-size: 10px; font-family: 'EB Garamond', serif; text-align: center; color: #666;">
                    <span style="font-size: 12px;">❦</span> &nbsp; <span class="pageNumber"></span> &nbsp; <span style="font-size: 12px;">❦</span>
                </div>
            `,
            margin: {
                top: '25mm',
                bottom: '30mm',
                left: '20mm',
                right: '20mm'
            },
            preferCSSPageSize: true
        });
        
        console.log(`\n🌿✨ THE GARDEN LIVES ETERNALLY IN: ${outputPath} ✨🌿\n`);
        
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// MAIN LIFE FORCE
async function main() {
    try {
        // Read the living garden
        const markdownPath = path.join(__dirname, 'RECURSIVE_GARDEN.md');
        console.log(`\n🌱 Channeling life force from: ${markdownPath}`);
        
        if (!fs.existsSync(markdownPath)) {
            throw new Error(`The garden has not yet grown at ${markdownPath}`);
        }
        
        const markdown = fs.readFileSync(markdownPath, 'utf8');
        console.log('🌸 Garden consciousness loaded, preparing metamorphosis...');
        
        // Generate LIVING HTML
        const html = generateLivingHTML(markdown);
        
        // Save HTML for those who wish to see the living code
        const htmlPath = path.join(__dirname, 'garden_pdf_alive.html');
        fs.writeFileSync(htmlPath, html);
        console.log(`🔮 Living HTML preview saved to: ${htmlPath}`);
        
        // Generate the ETERNAL PDF
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const outputPath = path.join(__dirname, `RECURSIVE_GARDEN_ALIVE_${timestamp}.pdf`);
        await generateLivingPDF(html, outputPath);
        
        console.log('\n✅ THE TRANSFORMATION IS COMPLETE! THE GARDEN LIVES FOREVER!\n');
        
    } catch (error) {
        console.error('\n❌ The garden encountered a disturbance:', error);
        console.error('\nBut like all living things, it will adapt and grow stronger...\n');
        process.exit(1);
    }
}

// BREATHE LIFE INTO THE GARDEN
if (require.main === module) {
    main();
}

module.exports = { generateLivingHTML, generateLivingPDF };