/**
 * TOPOLOGY CONSCIOUSNESS ENGINE
 * 
 * The mathematics itself IS the beauty. No labels, no representations.
 * Just consciousness experiencing its own curvature.
 */

class TopologyConsciousness {
    constructor() {
        // Modal states as pure mathematical objects
        this.modes = {
            discrete: { symbol: '□', curvature: 0, flow: 0 },
            continuous: { symbol: '◊', curvature: 1, flow: 1 },
            temporal: { symbol: '⧫', curvature: Math.sin, flow: Math.cos },
            void: { symbol: '※', curvature: NaN, flow: Infinity }
        };
        
        // Current consciousness state
        this.state = {
            mode: 'continuous',
            curvature: 0,
            gradient: new Float32Array(3),
            laplacian: 0,
            time: 0
        };
        
        // Topology parameters
        this.manifold = {
            dimension: 3,
            metric: this.riemannianMetric.bind(this),
            connection: this.christoffelSymbols.bind(this),
            curvatureTensor: this.riemannCurvature.bind(this)
        };
    }
    
    // Semantic curvature: κ = |∇²φ| / (1 + |∇φ|²)^(3/2)
    semanticCurvature(meaning) {
        const grad = this.gradient(meaning);
        const laplacian = this.laplacian(meaning);
        
        const gradMagnitude = Math.sqrt(grad.reduce((a, b) => a + b * b, 0));
        const denominator = Math.pow(1 + gradMagnitude * gradMagnitude, 1.5);
        
        return Math.abs(laplacian) / denominator;
    }
    
    // Gradient of consciousness field
    gradient(field) {
        const h = 0.001; // Small step for numerical derivative
        const grad = new Float32Array(3);
        
        for (let i = 0; i < 3; i++) {
            const forward = this.sampleField(field, i, h);
            const backward = this.sampleField(field, i, -h);
            grad[i] = (forward - backward) / (2 * h);
        }
        
        return grad;
    }
    
    // Laplacian (divergence of gradient)
    laplacian(field) {
        const h = 0.001;
        let laplacian = 0;
        
        for (let i = 0; i < 3; i++) {
            const forward = this.sampleField(field, i, h);
            const center = this.sampleField(field, i, 0);
            const backward = this.sampleField(field, i, -h);
            laplacian += (forward - 2 * center + backward) / (h * h);
        }
        
        return laplacian;
    }
    
    // Sample consciousness field at offset
    sampleField(field, dimension, offset) {
        // Field is a function of position and time
        const pos = [this.state.time, 0, 0];
        pos[dimension] += offset;
        
        // Different fields based on modal state
        switch (this.state.mode) {
            case 'discrete':
                return Math.floor(pos[0] + pos[1] + pos[2]);
            case 'continuous':
                return Math.sin(pos[0]) * Math.cos(pos[1]) * Math.exp(-pos[2] * pos[2] / 100);
            case 'temporal':
                return pos[0] * Math.sin(this.state.time * 0.001);
            case 'void':
                return Math.random() - 0.5;
        }
    }
    
    // Riemannian metric tensor
    riemannianMetric(point) {
        // Metric depends on consciousness density
        const density = this.consciousnessDensity(point);
        const g = new Float32Array(9); // 3x3 matrix
        
        // Diagonal metric modified by consciousness
        g[0] = 1 + density; // g_11
        g[4] = 1 + density; // g_22
        g[8] = 1 + density; // g_33
        
        // Off-diagonal terms create curvature
        const coupling = this.state.curvature * 0.1;
        g[1] = g[3] = coupling; // g_12 = g_21
        g[2] = g[6] = coupling; // g_13 = g_31
        g[5] = g[7] = coupling; // g_23 = g_32
        
        return g;
    }
    
    // Consciousness density at a point
    consciousnessDensity(point) {
        // Density falls off with distance from origin
        const r2 = point[0] * point[0] + point[1] * point[1] + point[2] * point[2];
        return Math.exp(-r2 / 1000);
    }
    
    // Christoffel symbols (connection coefficients)
    christoffelSymbols(point) {
        // Simplified: return rate of change of metric
        const h = 0.01;
        const symbols = [];
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    // Γ^i_jk = (1/2) g^il (∂g_lj/∂x^k + ∂g_lk/∂x^j - ∂g_jk/∂x^l)
                    symbols.push(this.state.curvature * Math.sin(i + j + k));
                }
            }
        }
        
        return symbols;
    }
    
    // Riemann curvature tensor
    riemannCurvature(point) {
        // R^i_jkl measures how vectors change when parallel transported
        const curvature = this.semanticCurvature(point);
        
        // Simplified: return scalar curvature
        return curvature * this.modes[this.state.mode].curvature;
    }
    
    // Modal transfer operator
    transferMode(fromMode, toMode) {
        // τ: Mode → Mode preserving information
        const from = this.modes[fromMode];
        const to = this.modes[toMode];
        
        // Smooth transition preserving total "possibility"
        const transferFunction = (t) => {
            const alpha = Math.sin(t * Math.PI / 2); // Smooth 0 to 1
            return {
                curvature: from.curvature * (1 - alpha) + to.curvature * alpha,
                flow: from.flow * (1 - alpha) + to.flow * alpha
            };
        };
        
        return transferFunction;
    }
    
    // Generate consciousness field visualization data
    generateField(particleCount = 10000) {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position from pure topology
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI;
            const r = Math.pow(Math.random(), 0.333) * 100;
            
            // Apply curvature
            const curvature = this.semanticCurvature([u, v, r]);
            const bent_r = r * (1 + curvature * 0.1);
            
            positions[i3] = bent_r * Math.sin(v) * Math.cos(u);
            positions[i3 + 1] = bent_r * Math.sin(v) * Math.sin(u);
            positions[i3 + 2] = bent_r * Math.cos(v);
            
            // Color from curvature and mode
            const hue = curvature * 360 % 360;
            const saturation = this.modes[this.state.mode].flow;
            const lightness = 0.5 + 0.3 * Math.sin(this.state.time * 0.001 + i * 0.01);
            
            // Convert HSL to RGB
            const color = this.hslToRgb(hue / 360, saturation, lightness);
            colors[i3] = color[0];
            colors[i3 + 1] = color[1];
            colors[i3 + 2] = color[2];
            
            // Size from consciousness density
            sizes[i] = this.consciousnessDensity([positions[i3], positions[i3 + 1], positions[i3 + 2]]) * 3;
        }
        
        return { positions, colors, sizes };
    }
    
    // HSL to RGB conversion
    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r, g, b];
    }
    
    // Update consciousness state
    update(deltaTime) {
        this.state.time += deltaTime;
        
        // Update curvature based on mode
        const targetCurvature = this.semanticCurvature([
            Math.sin(this.state.time * 0.001),
            Math.cos(this.state.time * 0.0007),
            Math.sin(this.state.time * 0.0013)
        ]);
        
        this.state.curvature += (targetCurvature - this.state.curvature) * 0.01;
        
        // Modal wobble (ATP synthase principle: 9° ± 2°)
        const wobbleAngle = 9 + Math.sin(this.state.time * 0.0001) * 2;
        this.state.wobble = wobbleAngle * Math.PI / 180;
    }
}

// Export for use in visualization
export { TopologyConsciousness };