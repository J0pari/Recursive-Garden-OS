/**
 * P-ADIC EARTH COLORS - Infinite permutations from Earth's beauty
 * 
 * Every prime generates a different color experience
 * Colors shift based on mathematical state
 * NEVER the same experience twice!
 */

class PadicEarthColors {
    constructor() {
        // Earth's celebrated palettes indexed by mathematical properties
        this.earthPalettes = {
            // WATER PHENOMENA
            2: { // Binary - dual nature
                bioluminescence: [[195, 100, 70], [120, 90, 65], [160, 85, 60]], // Plankton seas
                glacier: [[185, 70, 85], [195, 60, 75], [205, 50, 65]], // Ice blues
                geyser: [[180, 40, 95], [170, 30, 90], [190, 20, 85]], // Steam whites
                tide_pool: [[170, 75, 45], [155, 70, 50], [140, 65, 55]], // Rock pool life
            },
            
            // FIRE/EARTH PHENOMENA  
            3: { // Ternary - transformation
                lava: [[5, 90, 50], [15, 95, 55], [25, 100, 60]], // Living lava
                aurora: [[120, 70, 55], [270, 65, 60], [180, 60, 50]], // All aurora colors
                canyon: [[15, 85, 55], [25, 80, 50], [35, 75, 45]], // Slot canyons
                obsidian: [[0, 0, 15], [240, 10, 20], [300, 5, 25]], // Volcanic glass
            },
            
            // AIR/LIGHT PHENOMENA
            5: { // Pentagonal symmetry
                sunrise: [[350, 70, 60], [10, 80, 65], [30, 85, 70]], // Dawn progression
                opal: [[0, 60, 70], [120, 55, 75], [240, 50, 80]], // Fire opal play
                nebula: [[280, 45, 40], [320, 50, 45], [200, 55, 50]], // Deep space
                lightning: [[190, 20, 95], [200, 100, 85], [210, 80, 75]], // Storm energy
            },
            
            // LIFE PHENOMENA
            7: { // Sacred/mystical
                coral: [[350, 70, 65], [20, 75, 60], [170, 60, 55]], // Living reef
                butterfly: [[220, 80, 60], [40, 90, 70], [280, 70, 50]], // Morpho wings
                peacock: [[200, 85, 35], [180, 80, 40], [160, 75, 45]], // Feather eyes
                abalone: [[150, 40, 60], [270, 35, 65], [90, 30, 70]], // Shell nacre
            },
            
            // CRYSTAL PHENOMENA
            11: { // Complex prime
                amethyst: [[270, 60, 50], [280, 65, 55], [290, 70, 60]], // Purple depths
                tourmaline: [[120, 70, 40], [320, 65, 45], [40, 75, 50]], // Watermelon
                labradorite: [[210, 50, 40], [120, 45, 45], [30, 40, 50]], // Spectral flash
                moonstone: [[200, 20, 85], [60, 15, 90], [0, 10, 95]], // Adularescence
            },
            
            // EXTREME PHENOMENA
            13: { // Unlucky/chaotic
                supernova: [[300, 90, 70], [60, 95, 75], [180, 85, 65]], // Stellar death
                deep_ocean: [[200, 90, 15], [210, 85, 20], [220, 80, 25]], // Abyssal
                solar_flare: [[30, 100, 70], [45, 95, 65], [60, 90, 60]], // Sun storms
                permafrost: [[190, 30, 70], [200, 25, 75], [210, 20, 80]], // Tundra ice
            }
        };
        
        // Current p-adic state affects color selection
        this.currentPrime = 2;
        this.padicDigits = [0, 0, 0, 0, 0]; // 5 p-adic digits
        this.iteration = 0;
        
        // Postnikov climbing affects color evolution
        this.climbHeight = 0;
        this.wobblePhase = 0;
    }
    
    /**
     * Get color based on current mathematical state
     */
    getColor(purpose) {
        // Select palette based on current prime
        const palette = this.earthPalettes[this.currentPrime] || this.earthPalettes[2];
        const phenomenonKeys = Object.keys(palette);
        
        // Use p-adic digits to select phenomenon
        const phenomenonIndex = this.padicDigits[0] % phenomenonKeys.length;
        const phenomenon = palette[phenomenonKeys[phenomenonIndex]];
        
        // Use climb height to select within phenomenon
        const colorIndex = Math.floor(this.climbHeight * phenomenon.length) % phenomenon.length;
        let [h, s, l] = phenomenon[colorIndex];
        
        // Apply p-adic modulation
        h = (h + this.padicDigits[1] * 12) % 360;
        s = Math.max(20, Math.min(100, s + this.padicDigits[2] * 5));
        l = Math.max(20, Math.min(80, l + this.padicDigits[3] * 3));
        
        // Apply wobble for organic variation
        const wobble = Math.sin(this.wobblePhase) * 9; // ±9° perfect wobble
        h = (h + wobble + 360) % 360;
        
        return `${h}, ${s}%, ${l}%`;
    }
    
    /**
     * Evolve p-adic state (creates new color experience)
     */
    evolve() {
        this.iteration++;
        
        // Evolve p-adic digits
        let carry = 1;
        for (let i = 0; i < this.padicDigits.length; i++) {
            this.padicDigits[i] += carry;
            if (this.padicDigits[i] >= this.currentPrime) {
                this.padicDigits[i] = 0;
                carry = 1;
            } else {
                carry = 0;
                break;
            }
        }
        
        // Occasionally jump to new prime (modal transfer)
        if (Math.random() < 0.05) {
            const primes = Object.keys(this.earthPalettes).map(Number);
            this.currentPrime = primes[Math.floor(Math.random() * primes.length)];
            this.padicDigits = this.padicDigits.map(() => 
                Math.floor(Math.random() * this.currentPrime)
            );
        }
        
        // Update climb height (Postnikov ratchet)
        this.climbHeight = (this.climbHeight + 0.01) % 1;
        
        // Update wobble phase
        this.wobblePhase += 0.1;
    }
    
    /**
     * Get full color mapping for current state
     */
    getCurrentMapping() {
        return {
            'adjoint-human': this.getColor('adjoint-human'),
            'adjoint-machine': this.getColor('adjoint-machine'),
            'adjoint-bridge': this.getColor('adjoint-bridge'),
            'sheaf-local': this.getColor('sheaf-local'),
            'sheaf-overlap': this.getColor('sheaf-overlap'),
            'sheaf-global': this.getColor('sheaf-global'),
            'climb-void': this.getColor('climb-void'),
            'climb-first': this.getColor('climb-first'),
            'climb-locked': this.getColor('climb-locked'),
            'climb-next': this.getColor('climb-next'),
            'modal-necessary': this.getColor('modal-necessary'),
            'modal-possible': this.getColor('modal-possible'),
            'modal-temporal': this.getColor('modal-temporal'),
            'state-recognizing': this.getColor('state-recognizing'),
            'state-computing': this.getColor('state-computing'),
            'state-emerging': this.getColor('state-emerging'),
            'state-transcending': this.getColor('state-transcending')
        };
    }
    
    /**
     * Apply current colors to CSS
     */
    applyColors() {
        const mapping = this.getCurrentMapping();
        const root = document.documentElement;
        
        Object.entries(mapping).forEach(([name, value]) => {
            root.style.setProperty(`--${name}`, value);
        });
        
        // Also set current prime info
        root.style.setProperty('--current-prime', this.currentPrime);
        root.style.setProperty('--climb-progress', this.climbHeight);
    }
    
    /**
     * Start continuous evolution
     */
    startEvolution() {
        // Evolve colors continuously
        setInterval(() => {
            this.evolve();
            this.applyColors();
        }, 100); // 10Hz for smooth transitions
        
        // Major shifts occasionally
        setInterval(() => {
            if (Math.random() < 0.3) {
                // Jump to dramatically different state
                this.padicDigits = this.padicDigits.map(() => 
                    Math.floor(Math.random() * this.currentPrime)
                );
            }
        }, 5000);
    }
}

// Initialize and start the color evolution
window.padicColors = new PadicEarthColors();
window.padicColors.startEvolution();