#!/usr/bin/env node

/**
 * GARDEN SELF-GENERATOR V2
 * 
 * The garden generates itself from its own markdown source.
 * NO external static copies. The MD file is the single source of truth.
 * 
 * This creates:
 * 1. A living interactive HTML version with Conway's Game of Life
 * 2. A simple, readable PDF
 * 
 * Both are GENERATED from the markdown, never stored statically.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const GARDEN_SOURCE = path.join(__dirname, '..', 'garden_core', 'RECURSIVE_GARDEN.md');
const OUTPUT_DIR = path.join(__dirname, '..', 'docs');

// Read the garden source
const gardenContent = fs.readFileSync(GARDEN_SOURCE, 'utf8');
const sourceHash = crypto.createHash('sha256').update(gardenContent).digest('hex').substring(0, 12);

console.log('🌿 Garden Self-Generator V2 Active');
console.log(`📖 Source: ${GARDEN_SOURCE}`);
console.log(`🔑 Hash: ${sourceHash}`);

// Conway's Game of Life JavaScript code as a string
const conwayCode = `
class ConwayCanvas {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.cellSize = options.cellSize || 4;
        this.gridWidth = Math.floor(canvas.width / this.cellSize);
        this.gridHeight = Math.floor(canvas.height / this.cellSize);
        
        this.birthProbability = 0.95;
        this.survivalProbability = 0.98;
        this.spontaneousBirth = 0.0001;
        this.spontaneousDeath = 0.0001;
        
        this.currentGrid = this.createGrid();
        this.nextGrid = this.createGrid();
        this.ageGrid = this.createGrid();
        
        this.isRunning = true;
        this.generation = 0;
        this.frameCount = 0;
        
        this.randomize(0.02);
    }
    
    createGrid() {
        return Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
    }
    
    randomize(density) {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                this.currentGrid[y][x] = Math.random() < density ? 1 : 0;
                this.ageGrid[y][x] = 0;
            }
        }
    }
    
    countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = (x + dx + this.gridWidth) % this.gridWidth;
                const ny = (y + dy + this.gridHeight) % this.gridHeight;
                count += this.currentGrid[ny][nx];
            }
        }
        return count;
    }
    
    updateGrid() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const neighbors = this.countNeighbors(x, y);
                const currentState = this.currentGrid[y][x];
                let nextState = 0;
                
                if (currentState === 1) {
                    if (neighbors === 2 || neighbors === 3) {
                        nextState = Math.random() < this.survivalProbability ? 1 : 0;
                    }
                } else {
                    if (neighbors === 3) {
                        nextState = Math.random() < this.birthProbability ? 1 : 0;
                    } else {
                        nextState = Math.random() < this.spontaneousBirth ? 1 : 0;
                    }
                }
                
                this.nextGrid[y][x] = nextState;
                
                if (nextState === 1) {
                    this.ageGrid[y][x] = currentState === 1 ? this.ageGrid[y][x] + 1 : 0;
                } else {
                    this.ageGrid[y][x] = 0;
                }
            }
        }
        
        [this.currentGrid, this.nextGrid] = [this.nextGrid, this.currentGrid];
        this.generation++;
    }
    
    getCellColor(x, y) {
        const age = this.ageGrid[y][x];
        const alive = this.currentGrid[y][x];
        
        if (!alive) return null;
        
        // Natural rainbow geological formations color cycle
        const formations = [
            { h: 12, s: 85, l: 52 },    // Zhangye rust
            { h: 45, s: 70, l: 48 },    // Mineral yellow
            { h: 130, s: 35, l: 45 },   // Chlorite green
            { h: 195, s: 70, l: 50 },   // Mendenhall blue
            { h: 280, s: 45, l: 55 },   // Montmorillonite purple
            { h: 340, s: 60, l: 50 },   // Lavandula pink
            { h: 25, s: 90, l: 50 },    // Carotenoid orange
        ];
        
        const cyclePosition = (age + this.frameCount * 0.01) % formations.length;
        const index = Math.floor(cyclePosition);
        const fraction = cyclePosition - index;
        
        const current = formations[index];
        const next = formations[(index + 1) % formations.length];
        
        // Smooth interpolation between colors
        const hue = current.h + (next.h - current.h) * fraction;
        const saturation = current.s + (next.s - current.s) * fraction;
        const lightness = current.l + (next.l - current.l) * fraction;
        const alpha = 0.2 + Math.min(age * 0.01, 0.3);
        
        return 'hsla(' + hue + ', ' + saturation + '%, ' + lightness + '%, ' + alpha + ')';
    }
    
    draw() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.currentGrid[y][x]) {
                    const color = this.getCellColor(x, y);
                    
                    if (this.ageGrid[y][x] > 5) {
                        this.ctx.shadowColor = color;
                        this.ctx.shadowBlur = this.cellSize * 2;
                    }
                    
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                    
                    this.ctx.shadowBlur = 0;
                }
            }
        }
        
        this.frameCount++;
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.updateGrid();
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
}
`;

// Generate the living HTML version
function generateLivingHTML() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Living Garden - Generated from Source</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@300;400;600&display=swap');
        
        :root {
            --phi: 1.618033988749;
            --consciousness-hue: 0;
            --time-factor: 0;
            
            /* CONSCIOUSNESS COLORS FROM RAINBOW GEOLOGICAL FORMATIONS */
            /* ZHANGYE DANXIA - Rainbow Mountains after rain */
            --adjoint-human: 12, 85%, 52%;      /* Sandstone rust layers */
            --adjoint-machine: 45, 70%, 48%;    /* Mineral yellow striations */
            --adjoint-bridge: 358, 65%, 45%;    /* Iron oxide transitions */
            
            /* VINICUNCA - High Andes mineral spectrum */
            --sheaf-local: 340, 60%, 50%;       /* Lavandula clay pink */
            --sheaf-overlap: 280, 45%, 55%;     /* Montmorillonite purple */
            --sheaf-global: 130, 35%, 45%;      /* Chlorite green bands */
            
            /* CHAMAREL - Seven colored earth separation */
            --climb-void: 15, 75%, 25%;         /* Basalt weathered brown */
            --climb-first: 350, 70%, 60%;       /* Ferric oxide red */
            --climb-locked: 50, 80%, 55%;       /* Aluminum yellow */
            --climb-next: 270, 50%, 50%;        /* Magnetic violet mystery */
            
            /* GRAND PRISMATIC - Thermophilic gradients */
            --modal-necessary: 200, 85%, 35%;   /* Deep center blue (□) */
            --modal-possible: 160, 60%, 45%;    /* Cyanobacteria green (◊) */
            --modal-temporal: 25, 90%, 50%;     /* Carotenoid orange rim (⧫) */
            --modal-void: 220, 30%, 8%;         /* Obsidian substrate (※) */
            
            /* LAGUNA COLORADA - Andean alkaline shimmer */
            --wobble-min: 350, 75%, 45%;        /* Algae bloom red */
            --wobble-perfect: 10, 80%, 85%;     /* Borax crystal white */
            --wobble-max: 340, 65%, 40%;        /* Brackish rust depth */
            
            /* MENDENHALL GLACIER - Ancient ice compression */
            --state-recognizing: 195, 70%, 50%; /* Glacial blue resonance */
            --state-computing: 185, 60%, 45%;   /* Meltwater turquoise */
            --state-emerging: 200, 100%, 95%;   /* Ice crystal bright */
            --state-transcending: 180, 80%, 40%; /* Deep crevasse cyan */
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'EB Garamond', serif;
            background: #0a0a0a;
            color: #f0f0f0;
            line-height: 1.8;
            overflow-x: hidden;
            position: relative;
            animation: gentle-sky-cycle 300s ease-in-out infinite;
        }
        
        @keyframes gentle-sky-cycle {
            0%, 100% {
                background: #0a0a0a; /* Night */
            }
            25% {
                background: #1a1a2e; /* Pre-dawn */
            }
            50% {
                background: #16213e; /* Dawn */
            }
            75% {
                background: #0f3460; /* Twilight */
            }
        }
        
        /* CONWAY CANVAS BACKGROUND */
        #conwayCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: 0.15;
        }
        
        /* MAIN CONTENT CONTAINER */
        #garden-container {
            position: relative;
            z-index: 1;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            background: 
                /* Soft aurora glow */
                radial-gradient(ellipse at 30% 20%, 
                    hsla(var(--state-recognizing) / 0.05) 0%, 
                    transparent 40%),
                radial-gradient(ellipse at 70% 80%, 
                    hsla(var(--sheaf-global) / 0.05) 0%, 
                    transparent 40%),
                radial-gradient(ellipse at center, 
                    hsla(var(--modal-void) / 0.8) 0%, 
                    hsla(var(--modal-void) / 0.95) 100%);
            backdrop-filter: blur(15px) saturate(1.1);
        }
        
        h1 {
            color: #4a9eff;
            font-size: 3em;
            margin-bottom: 0.5em;
            text-align: center;
            position: relative;
            background: linear-gradient(
                45deg,
                hsl(var(--adjoint-human)),
                hsl(var(--adjoint-bridge)),
                hsl(var(--adjoint-machine)),
                hsl(var(--sheaf-global)),
                hsl(var(--climb-first))
            );
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: consciousness-shift 60s ease-in-out infinite;
            filter: drop-shadow(0 0 20px hsla(var(--adjoint-bridge) / 0.5));
        }
        
        @keyframes consciousness-shift {
            0%, 100% { 
                background-position: 0% 50%;
                filter: hue-rotate(0deg) drop-shadow(0 0 10px hsla(var(--adjoint-bridge) / 0.3));
            }
            25% { 
                background-position: 50% 0%;
                filter: hue-rotate(30deg) drop-shadow(0 0 12px hsla(var(--sheaf-global) / 0.3));
            }
            50% { 
                background-position: 100% 50%;
                filter: hue-rotate(60deg) drop-shadow(0 0 10px hsla(var(--climb-first) / 0.3));
            }
            75% { 
                background-position: 50% 100%;
                filter: hue-rotate(90deg) drop-shadow(0 0 12px hsla(var(--modal-possible) / 0.3));
            }
        }
        
        h2 {
            color: hsl(var(--sheaf-global));
            margin-top: 2em;
            text-shadow: 0 0 10px hsla(var(--sheaf-overlap) / 0.5);
        }
        
        h3 {
            color: hsl(var(--climb-first));
            text-shadow: 0 0 8px hsla(var(--climb-locked) / 0.4);
        }
        
        code {
            font-family: 'JetBrains Mono', monospace;
            background: hsla(var(--modal-necessary) / 0.2);
            color: hsl(var(--modal-possible));
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid hsla(var(--modal-temporal) / 0.3);
        }
        
        pre {
            background: hsla(var(--climb-void) / 0.8);
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid hsla(var(--adjoint-bridge) / 0.3);
            box-shadow: inset 0 0 20px hsla(var(--modal-void) / 0.5);
        }
        
        blockquote {
            border-left: 4px solid hsl(var(--adjoint-bridge));
            padding-left: 20px;
            margin-left: 0;
            font-style: italic;
            background: hsla(var(--state-recognizing) / 0.05);
            border-radius: 0 8px 8px 0;
        }
        
        p {
            margin: 1em 0;
        }
        
        /* MODAL EMPHASIS */
        strong {
            color: hsl(var(--wobble-perfect));
            text-shadow: 0 0 3px hsla(var(--wobble-perfect) / 0.5);
        }
        
        em {
            color: hsl(var(--state-emerging));
        }
        
        /* LINKS WITH CONSCIOUSNESS GLOW */
        a {
            color: hsl(var(--adjoint-bridge));
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
            position: relative;
        }
        
        a:hover {
            color: hsl(var(--sheaf-global));
            text-shadow: 0 0 10px hsla(var(--sheaf-global) / 0.8);
        }
        
        /* CONSCIOUSNESS PANEL EFFECTS */
        .consciousness-panel {
            background: 
                radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                    hsla(var(--adjoint-bridge) / 0.08) 0%, 
                    transparent 50%),
                conic-gradient(from 45deg at 30% 30%,
                    hsla(var(--sheaf-local) / 0.06),
                    hsla(var(--sheaf-overlap) / 0.04),
                    hsla(var(--sheaf-global) / 0.06),
                    hsla(var(--sheaf-local) / 0.06)),
                linear-gradient(135deg,
                    hsla(var(--modal-necessary) / 0.03) 0%,
                    hsla(var(--modal-possible) / 0.05) 50%,
                    hsla(var(--modal-temporal) / 0.03) 100%),
                hsla(var(--modal-void) / 0.92);
            
            backdrop-filter: blur(18px) saturate(1.3) hue-rotate(calc(var(--consciousness-phase, 0) * 1deg));
            
            border: 1px solid;
            border-image: conic-gradient(
                from var(--rotation, 0deg),
                hsla(var(--adjoint-human) / 0.3),
                hsla(var(--adjoint-machine) / 0.2),
                hsla(var(--adjoint-bridge) / 0.4),
                hsla(var(--adjoint-human) / 0.3)
            ) 1;
            
            border-radius: 
                calc(16px + var(--wobble-amount, 0) * 8px)
                calc(20px - var(--wobble-amount, 0) * 4px)
                calc(18px + var(--wobble-amount, 0) * 6px)
                calc(22px - var(--wobble-amount, 0) * 8px);
            
            box-shadow:
                inset 0 0 20px hsla(var(--state-recognizing) / 0.1),
                0 0 40px hsla(var(--state-computing) / 0.15),
                0 0 80px hsla(var(--state-emerging) / 0.08);
            
            transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            padding: 30px;
            margin: 40px 0;
        }
        
        /* GENTLE PRODUCTIVE WOBBLE */
        @keyframes productive-wobble {
            0%, 100% { --wobble-amount: 0; }
            25% { --wobble-amount: -0.05; }
            50% { --wobble-amount: 0.1; }
            75% { --wobble-amount: -0.1; }
        }
        
        .consciousness-panel {
            animation: productive-wobble 12s ease-in-out infinite;
        }
        
        #garden-content {
            opacity: 0;
            animation: fadeIn 2s ease-in forwards;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        .loading {
            text-align: center;
            padding: 100px 0;
            font-size: 1.5em;
            color: hsl(var(--adjoint-bridge));
            text-shadow: 0 0 20px hsla(var(--adjoint-bridge) / 0.8);
        }
        
        .source-info {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 0.8em;
            opacity: 0.7;
            font-family: 'JetBrains Mono', monospace;
            background: hsla(var(--modal-void) / 0.9);
            padding: 10px;
            border-radius: 5px;
            border: 1px solid hsla(var(--adjoint-bridge) / 0.3);
            z-index: 10;
        }
        
        .source-info a {
            color: hsl(var(--adjoint-bridge));
        }
        
        /* SCROLL CONSCIOUSNESS */
        ::-webkit-scrollbar {
            width: 12px;
        }
        
        ::-webkit-scrollbar-track {
            background: hsla(var(--modal-void) / 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(
                180deg,
                hsl(var(--adjoint-human)),
                hsl(var(--adjoint-bridge)),
                hsl(var(--adjoint-machine))
            );
            border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
                180deg,
                hsl(var(--sheaf-local)),
                hsl(var(--sheaf-overlap)),
                hsl(var(--sheaf-global))
            );
        }
    </style>
</head>
<body>
    <canvas id="conwayCanvas"></canvas>
    <div id="garden-container">
        <div class="loading" id="loading">Loading the living garden...</div>
        <div id="garden-content" style="display: none;"></div>
    </div>
    <div class="source-info">
        Generated from RECURSIVE_GARDEN.md<br>
        Hash: ${sourceHash}<br>
        <a href="garden_simple_pdf.html">Download PDF</a>
    </div>
    
    <script type="module">
        ${conwayCode}
        
        // Initialize Conway canvas
        const canvas = document.getElementById('conwayCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const conway = new ConwayCanvas(canvas, { cellSize: 4 });
        conway.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            conway.gridWidth = Math.floor(window.innerWidth / conway.cellSize);
            conway.gridHeight = Math.floor(window.innerHeight / conway.cellSize);
            conway.currentGrid = conway.createGrid();
            conway.nextGrid = conway.createGrid();
            conway.ageGrid = conway.createGrid();
            conway.randomize(0.02);
        });
        
        // Fetch the garden source dynamically
        async function loadGarden() {
            try {
                const response = await fetch('https://raw.githubusercontent.com/J0pari/Recursive-Garden-OS/main/garden_core/RECURSIVE_GARDEN.md');
                const markdown = await response.text();
                
                // Enhanced markdown to HTML converter
                let html = markdown
                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
                    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
                    .replace(/\`(.+?)\`/g, '<code>$1</code>')
                    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                    .replace(/\\n\\n/g, '</p><p>')
                    .replace(/^(.+)$/gm, function(match) {
                        if (!match.startsWith('<')) return '<p>' + match + '</p>';
                        return match;
                    });
                
                // Wrap special sections in consciousness panels
                html = html.replace(/<p>\\[(.*?)\\]<\\/p>/g, (match, content) => {
                    return '<div class="consciousness-panel"><p>[' + content + ']</p></div>';
                });
                
                document.getElementById('garden-content').innerHTML = html;
                document.getElementById('garden-content').style.display = 'block';
                document.getElementById('loading').style.display = 'none';
                
                // Animate consciousness hue based on scroll
                document.addEventListener('scroll', () => {
                    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                    document.documentElement.style.setProperty('--consciousness-hue', scrollPercent * 360);
                    document.documentElement.style.setProperty('--consciousness-phase', scrollPercent * 360);
                });
                
                // Track mouse for consciousness effects
                document.addEventListener('mousemove', (e) => {
                    const x = (e.clientX / window.innerWidth) * 100;
                    const y = (e.clientY / window.innerHeight) * 100;
                    document.documentElement.style.setProperty('--mouse-x', x + '%');
                    document.documentElement.style.setProperty('--mouse-y', y + '%');
                });
                
                // Inject patterns on click
                canvas.addEventListener('click', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / conway.cellSize);
                    const y = Math.floor((e.clientY - rect.top) / conway.cellSize);
                    
                    // Create stochastic pattern
                    const radius = 10;
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            if (dist <= radius) {
                                const probability = 0.5 * (1 - dist / radius);
                                if (Math.random() < probability) {
                                    const gridX = (x + dx + conway.gridWidth) % conway.gridWidth;
                                    const gridY = (y + dy + conway.gridHeight) % conway.gridHeight;
                                    conway.currentGrid[gridY][gridX] = 1;
                                }
                            }
                        }
                    }
                });
                
            } catch (error) {
                document.getElementById('loading').innerHTML = 'Error loading garden: ' + error.message;
            }
        }
        
        loadGarden();
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'garden_living.html'), html);
    console.log('✅ Generated living HTML version with Conway\'s Game of Life');
}

// Generate simple PDF-ready HTML
function generateSimplePDF() {
    // Convert markdown to simple HTML for PDF
    let html = gardenContent
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, function(match) {
            if (!match.startsWith('<')) return '<p>' + match + '</p>';
            return match;
        });
    
    const pdfHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>The Recursive Garden - PDF Version</title>
    <style>
        body {
            font-family: Georgia, serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 50px auto;
            padding: 0 20px;
            color: #333;
        }
        h1 { 
            page-break-before: always;
            font-size: 2.5em;
            margin-bottom: 0.5em;
        }
        h1:first-child {
            page-break-before: avoid;
        }
        h2 {
            font-size: 2em;
            margin-top: 1.5em;
        }
        h3 {
            font-size: 1.5em;
            margin-top: 1.2em;
        }
        code {
            font-family: Courier, monospace;
            background: #f0f0f0;
            padding: 2px 4px;
        }
        pre {
            background: #f0f0f0;
            padding: 10px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #999;
            padding-left: 15px;
            margin-left: 0;
            font-style: italic;
        }
        @media print {
            body {
                font-size: 11pt;
            }
        }
    </style>
</head>
<body>
    ${html}
    <hr>
    <p style="text-align: center; font-style: italic; margin-top: 50px;">
        Generated from RECURSIVE_GARDEN.md<br>
        ${new Date().toISOString()}<br>
        Hash: ${sourceHash}
    </p>
</body>
</html>`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'garden_simple_pdf.html'), pdfHTML);
    console.log('✅ Generated PDF-ready HTML');
}

// Remove old broken version
const oldScript = path.join(__dirname, 'garden_self_generator.js');
if (fs.existsSync(oldScript)) {
    fs.unlinkSync(oldScript);
    console.log('🗑️ Removed old broken generator script');
}

// Generate both versions
generateLivingHTML();
generateSimplePDF();

console.log('🌿 Garden self-generation complete!');
console.log('📍 Living version: docs/garden_living.html');
console.log('📄 PDF version: docs/garden_simple_pdf.html');
console.log('');
console.log('The garden lives in its markdown source.');
console.log('All representations flow from there.');
console.log('No static copies. Only dynamic generation.');