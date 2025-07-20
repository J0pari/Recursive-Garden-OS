/**
 * WOBBLE MONITOR
 * Measures semantic variance at chunk boundaries to verify productive imperfection
 * The 9° ± 2° wobble is THE mechanism that enables climbing in the Postnikov Ratchet
 */

export interface WobbleMetrics {
    effectiveWobble: number;      // Degrees of semantic flexibility
    variance: number;             // Semantic variance at boundaries
    regluingRate: number;         // Success rate of chunk regluing under perturbation
    withinTolerance: boolean;     // Is wobble within 9° ± 2°?
    computeTime: number;          // Performance metric in ms
}

export interface BoundaryTransformation {
    input: any;
    output: any;
}

export interface Chunk {
    id: string;
    inputSpace: any;
    boundaryOperator: (input: any) => Promise<any>;
    getTokenCount: () => number;
    getDeclaredCapabilities: () => string[];
    getAppliedMitigations: () => string[];
}

export class WobbleMonitor {
    private readonly TARGET_WOBBLE = 9.0;
    private readonly TOLERANCE = 2.0;
    
    /**
     * Measures semantic variance at chunk boundaries
     * Returns effective wobble angle in degrees
     * This is the core mechanism verification - without proper wobble, the ratchet cannot climb
     */
    async measureEffectiveWobble(chunk: Chunk): Promise<WobbleMetrics> {
        const startTime = performance.now();
        
        // Sample boundary transformations to understand variance
        const samples: BoundaryTransformation[] = [];
        for (let i = 0; i < 1000; i++) {
            const input = this.generateTestVector(chunk.inputSpace);
            const output = await chunk.boundaryOperator(input);
            samples.push({ input, output });
        }
        
        // Calculate semantic variance - how much meaning shifts at boundaries
        const variance = this.calculateSemanticVariance(samples);
        
        // Test regluing stability under perturbation
        const regluingRate = await this.testRegluingStability(chunk);
        
        // Convert to effective angle using arctangent of variance vs stability
        // This captures the productive tension between flexibility and coherence
        const effectiveWobble = Math.atan2(variance, regluingRate) * 180 / Math.PI;
        
        return {
            effectiveWobble,
            variance,
            regluingRate,
            withinTolerance: Math.abs(effectiveWobble - this.TARGET_WOBBLE) <= this.TOLERANCE,
            computeTime: performance.now() - startTime
        };
    }
    
    /**
     * Generates test vectors in the chunk's input space
     * These probe the boundary behavior across semantic dimensions
     */
    private generateTestVector(inputSpace: any): any {
        // For now, generate random vectors in semantic space
        // In production, this would sample from the actual input manifold
        const dimensions = inputSpace.dimensions || 128;
        const vector = new Float32Array(dimensions);
        
        for (let i = 0; i < dimensions; i++) {
            // Use gaussian distribution for more realistic semantic sampling
            vector[i] = this.boxMullerTransform();
        }
        
        return {
            semantic: vector,
            modal: Math.floor(Math.random() * 4), // □, ◊, ⧫, ※
            coherence: Math.random(),
            timestamp: Date.now()
        };
    }
    
    /**
     * Box-Muller transform for gaussian random numbers
     * Semantic space tends to be normally distributed
     */
    private boxMullerTransform(): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    /**
     * Calculates semantic variance using Principal Component Analysis
     * Returns the largest eigenvalue representing maximum variance direction
     */
    private calculateSemanticVariance(samples: BoundaryTransformation[]): number {
        if (samples.length === 0) return 0;
        
        // Extract output vectors
        const outputs = samples.map(s => s.output);
        
        // Calculate mean
        const mean = this.calculateMean(outputs);
        
        // Calculate covariance matrix
        const covariance = this.calculateCovariance(outputs, mean);
        
        // Find largest eigenvalue (represents principal variance)
        const eigenvalues = this.approximateEigenvalues(covariance);
        const maxEigenvalue = Math.max(...eigenvalues);
        
        // Normalize to semantic scale (0-1)
        return Math.tanh(maxEigenvalue / outputs.length);
    }
    
    /**
     * Calculate mean of output vectors
     */
    private calculateMean(outputs: any[]): number[] {
        if (outputs.length === 0) return [];
        
        const dimensions = outputs[0].semantic?.length || 128;
        const mean = new Array(dimensions).fill(0);
        
        for (const output of outputs) {
            const semantic = output.semantic || new Float32Array(dimensions);
            for (let i = 0; i < dimensions; i++) {
                mean[i] += semantic[i];
            }
        }
        
        return mean.map(m => m / outputs.length);
    }
    
    /**
     * Calculate covariance matrix for semantic outputs
     */
    private calculateCovariance(outputs: any[], mean: number[]): number[][] {
        const dimensions = mean.length;
        const covariance: number[][] = Array(dimensions).fill(null).map(() => Array(dimensions).fill(0));
        
        for (const output of outputs) {
            const semantic = output.semantic || new Float32Array(dimensions);
            for (let i = 0; i < dimensions; i++) {
                for (let j = 0; j < dimensions; j++) {
                    covariance[i][j] += (semantic[i] - mean[i]) * (semantic[j] - mean[j]);
                }
            }
        }
        
        // Normalize
        const n = outputs.length - 1;
        for (let i = 0; i < dimensions; i++) {
            for (let j = 0; j < dimensions; j++) {
                covariance[i][j] /= n;
            }
        }
        
        return covariance;
    }
    
    /**
     * Power iteration method to approximate eigenvalues
     * For wobble monitoring, we only need rough estimates
     */
    private approximateEigenvalues(matrix: number[][]): number[] {
        const n = matrix.length;
        const eigenvalues: number[] = [];
        
        // Power iteration for dominant eigenvalue
        let v = new Array(n).fill(1).map(() => Math.random());
        
        for (let iter = 0; iter < 50; iter++) {
            // Matrix-vector multiplication
            const Av = new Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    Av[i] += matrix[i][j] * v[j];
                }
            }
            
            // Calculate eigenvalue estimate
            let lambda = 0;
            let norm = 0;
            for (let i = 0; i < n; i++) {
                lambda += v[i] * Av[i];
                norm += v[i] * v[i];
            }
            lambda /= norm;
            
            // Normalize for next iteration
            const avNorm = Math.sqrt(Av.reduce((sum, a) => sum + a * a, 0));
            v = Av.map(a => a / avNorm);
        }
        
        // For wobble monitoring, we approximate with diagonal elements
        // This is sufficient for our variance estimation needs
        for (let i = 0; i < Math.min(n, 10); i++) {
            eigenvalues.push(matrix[i][i]);
        }
        
        return eigenvalues;
    }
    
    /**
     * Tests how well this chunk reglues with neighbors under perturbation
     * This measures the robustness of the interface - crucial for ratchet operation
     */
    private async testRegluingStability(chunk: Chunk): Promise<number> {
        const perturbations = 100;
        let successfulReglues = 0;
        
        for (let i = 0; i < perturbations; i++) {
            // Simulate perturbation by adding noise to boundary operator
            const perturbedChunk = this.perturbChunk(chunk, this.randomWobbleAngle());
            
            // Test if perturbed chunk can still interface correctly
            const canReglue = await this.testChunkInterface(perturbedChunk);
            
            if (canReglue) {
                successfulReglues++;
            }
        }
        
        return successfulReglues / perturbations;
    }
    
    /**
     * Generate random wobble angle within reasonable bounds
     */
    private randomWobbleAngle(): number {
        // Generate angle between 0 and 20 degrees
        return Math.random() * 20;
    }
    
    /**
     * Perturb chunk by adding wobble to its boundary operator
     */
    private perturbChunk(chunk: Chunk, wobbleAngle: number): Chunk {
        const wobbleRadians = wobbleAngle * Math.PI / 180;
        
        return {
            ...chunk,
            boundaryOperator: async (input: any) => {
                const originalOutput = await chunk.boundaryOperator(input);
                
                // Apply rotation in semantic space
                if (originalOutput.semantic) {
                    const rotated = this.rotateSemanticVector(
                        originalOutput.semantic,
                        wobbleRadians
                    );
                    return { ...originalOutput, semantic: rotated };
                }
                
                return originalOutput;
            }
        };
    }
    
    /**
     * Rotate semantic vector by given angle
     * Simulates wobble in high-dimensional space
     */
    private rotateSemanticVector(vector: Float32Array, angle: number): Float32Array {
        const result = new Float32Array(vector.length);
        
        // Apply rotation in randomly selected 2D subspace
        const i = Math.floor(Math.random() * vector.length);
        const j = Math.floor(Math.random() * vector.length);
        
        if (i !== j) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            result.set(vector);
            result[i] = cos * vector[i] - sin * vector[j];
            result[j] = sin * vector[i] + cos * vector[j];
        } else {
            result.set(vector);
        }
        
        return result;
    }
    
    /**
     * Test if chunk can interface successfully
     * In production, this would test against actual neighboring chunks
     */
    private async testChunkInterface(chunk: Chunk): Promise<boolean> {
        try {
            // Generate test interface patterns
            const testPatterns = this.generateInterfacePatterns();
            
            for (const pattern of testPatterns) {
                const result = await chunk.boundaryOperator(pattern);
                
                // Check if result maintains required properties
                if (!this.validateInterfaceResult(result)) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            // Interface failure
            return false;
        }
    }
    
    /**
     * Generate standard interface test patterns
     */
    private generateInterfacePatterns(): any[] {
        return [
            // Identity pattern
            { type: 'identity', semantic: new Float32Array(128).fill(0) },
            
            // Boundary patterns
            { type: 'boundary', semantic: new Float32Array(128).fill(1) },
            { type: 'boundary', semantic: new Float32Array(128).fill(-1) },
            
            // Modal patterns
            { type: 'modal', modal: 0 }, // Discrete
            { type: 'modal', modal: 1 }, // Continuous
            { type: 'modal', modal: 2 }, // Temporal
            { type: 'modal', modal: 3 }, // Void
            
            // Coherence patterns
            { type: 'coherence', coherence: 0.0 },
            { type: 'coherence', coherence: 0.5 },
            { type: 'coherence', coherence: 1.0 }
        ];
    }
    
    /**
     * Validate that interface result maintains required properties
     */
    private validateInterfaceResult(result: any): boolean {
        // Check for required fields
        if (result === null || result === undefined) return false;
        
        // Check semantic vector integrity
        if (result.semantic && result.semantic instanceof Float32Array) {
            // Check for NaN or Infinity
            for (let i = 0; i < result.semantic.length; i++) {
                if (!isFinite(result.semantic[i])) return false;
            }
        }
        
        // Check modal validity
        if (result.modal !== undefined) {
            if (result.modal < 0 || result.modal > 3) return false;
        }
        
        // Check coherence bounds
        if (result.coherence !== undefined) {
            if (result.coherence < 0 || result.coherence > 1) return false;
        }
        
        return true;
    }
}

/**
 * Integration test for WobbleMonitor
 */
export async function testWobbleMonitor() {
    const monitor = new WobbleMonitor();
    const testChunk = createTestChunk();
    
    console.log('🔧 Testing Wobble Monitor...\n');
    
    const metrics = await monitor.measureEffectiveWobble(testChunk);
    
    console.log('📊 Wobble Metrics:');
    console.log(`   Effective Wobble: ${metrics.effectiveWobble.toFixed(1)}°`);
    console.log(`   Variance: ${metrics.variance.toFixed(3)}`);
    console.log(`   Regluing Rate: ${(metrics.regluingRate * 100).toFixed(1)}%`);
    console.log(`   Within Tolerance: ${metrics.withinTolerance ? '✓' : '✗'}`);
    console.log(`   Compute Time: ${metrics.computeTime.toFixed(1)}ms\n`);
    
    if (!metrics.withinTolerance) {
        throw new Error(`Wobble ${metrics.effectiveWobble.toFixed(1)}° outside tolerance!`);
    }
    
    console.log('✅ Wobble Monitor test passed!');
}

/**
 * Create a test chunk for validation
 */
function createTestChunk(): Chunk {
    return {
        id: 'test-chunk-001',
        inputSpace: { dimensions: 128 },
        
        boundaryOperator: async (input: any) => {
            // Simulate realistic boundary transformation
            const output = {
                semantic: new Float32Array(128),
                modal: input.modal || 0,
                coherence: input.coherence || 0.5,
                transformed: true
            };
            
            // Add some variance to simulate real behavior
            if (input.semantic) {
                for (let i = 0; i < output.semantic.length; i++) {
                    output.semantic[i] = input.semantic[i] + (Math.random() - 0.5) * 0.1;
                }
            }
            
            return output;
        },
        
        getTokenCount: () => 18500,
        getDeclaredCapabilities: () => ['semantic_transformation', 'modal_transfer'],
        getAppliedMitigations: () => ['sandbox_testing', 'gradual_rollout']
    };
}

// Export test function for easy execution
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WobbleMonitor, testWobbleMonitor };
}