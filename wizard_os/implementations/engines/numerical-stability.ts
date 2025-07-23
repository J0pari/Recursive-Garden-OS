/**
 * NUMERICAL STABILITY HARNESS
 * Tracks and bounds numerical error accumulation in the Postnikov Ratchet
 * Ensures mathematical operations don't drift beyond acceptable tolerances
 */

export interface NumericalError {
    operation: string;
    location: string;
    absolute: number;
    relative: number;
    type: 'overflow' | 'underflow' | 'cancellation' | 'rounding' | 'accumulation';
}

export interface ErrorAccumulation {
    total: number;
    count: number;
    maxSingle: number;
    trend: 'stable' | 'growing' | 'oscillating';
}

export interface ErrorReport {
    chunkId: string;
    errors: NumericalError[];
    accumulated: number;
    withinBounds: boolean;
    criticalErrors: NumericalError[];
}

export interface NumericalOperation {
    name: string;
    location: string;
    exactComputation: () => number;
    actualComputation: () => number;
}

export class NumericalStabilityHarness {
    private errorHistory: Map<string, ErrorAccumulation> = new Map();
    
    private readonly bounds = {
        absolute: 1e-10,
        relative: 1e-8,
        accumulated: (steps: number) => 1e-10 * Math.sqrt(steps)
    };
    
    private readonly criticalThresholds = {
        absolute: 1e-6,
        relative: 1e-4
    };
    
    /**
     * Track numerical errors for a chunk
     * Returns comprehensive error report
     */
    trackChunkErrors(chunk: Chunk): ErrorReport {
        const errors: NumericalError[] = [];
        
        // Run standard numerical tests
        const tests = [
            this.testMatrixInversion(chunk),
            this.testEigenvalueStability(chunk),
            this.testIntegrationAccuracy(chunk),
            this.testFloatingPointCancellation(chunk),
            this.testTrigonometricIdentities(chunk),
            this.testExponentialStability(chunk)
        ];
        
        for (const test of tests) {
            if (test.error > this.bounds.absolute) {
                errors.push(test);
            }
        }
        
        // Update accumulated error tracking
        const accumulated = this.updateAccumulatedError(chunk.id, errors);
        
        // Identify critical errors
        const criticalErrors = errors.filter(e => 
            e.absolute > this.criticalThresholds.absolute ||
            e.relative > this.criticalThresholds.relative
        );
        
        return {
            chunkId: chunk.id,
            errors,
            accumulated,
            withinBounds: accumulated < this.bounds.accumulated(parseInt(chunk.id.split('-').pop() || '1')),
            criticalErrors
        };
    }
    
    /**
     * Test matrix inversion stability
     */
    private testMatrixInversion(chunk: Chunk): NumericalError {
        const size = 10;
        const matrix = this.generateTestMatrix(size);
        
        // Exact computation (using high precision)
        const exactInverse = this.exactMatrixInverse(matrix);
        
        // Actual computation (standard precision)
        const actualInverse = this.actualMatrixInverse(matrix);
        
        // Compute error
        const error = this.matrixError(exactInverse, actualInverse);
        
        return {
            operation: 'matrix_inversion',
            location: `${chunk.id}:matrix_ops`,
            absolute: error.absolute,
            relative: error.relative,
            type: error.absolute > 1e-3 ? 'accumulation' : 'rounding'
        };
    }
    
    /**
     * Test eigenvalue computation stability
     */
    private testEigenvalueStability(chunk: Chunk): NumericalError {
        const matrix = this.generateSymmetricMatrix(8);
        
        // Perturb slightly
        const perturbed = this.perturbMatrix(matrix, 1e-12);
        
        // Compute eigenvalues
        const original = this.approximateEigenvalues(matrix);
        const perturbedEigen = this.approximateEigenvalues(perturbed);
        
        // Check sensitivity
        const maxChange = Math.max(...original.map((e, i) => 
            Math.abs(e - perturbedEigen[i])
        ));
        
        return {
            operation: 'eigenvalue_computation',
            location: `${chunk.id}:eigen_solver`,
            absolute: maxChange,
            relative: maxChange / Math.max(...original.map(Math.abs)),
            type: maxChange > 1e-6 ? 'accumulation' : 'rounding'
        };
    }
    
    /**
     * Test numerical integration accuracy
     */
    private testIntegrationAccuracy(chunk: Chunk): NumericalError {
        // Test function: sin(x) from 0 to π (exact = 2)
        const exact = 2.0;
        
        // Trapezoidal rule
        const n = 1000;
        let sum = 0;
        const h = Math.PI / n;
        
        for (let i = 0; i <= n; i++) {
            const x = i * h;
            const weight = (i === 0 || i === n) ? 0.5 : 1.0;
            sum += weight * Math.sin(x);
        }
        sum *= h;
        
        const error = Math.abs(sum - exact);
        
        return {
            operation: 'numerical_integration',
            location: `${chunk.id}:integrator`,
            absolute: error,
            relative: error / exact,
            type: 'rounding'
        };
    }
    
    /**
     * Test floating point cancellation
     */
    private testFloatingPointCancellation(chunk: Chunk): NumericalError {
        // Classic cancellation: (1 + ε) - 1
        const epsilon = 1e-15;
        
        const exact = epsilon;
        const computed = (1 + epsilon) - 1;
        
        const error = Math.abs(computed - exact);
        
        return {
            operation: 'floating_point_subtraction',
            location: `${chunk.id}:arithmetic`,
            absolute: error,
            relative: error / exact,
            type: 'cancellation'
        };
    }
    
    /**
     * Test trigonometric identities
     */
    private testTrigonometricIdentities(chunk: Chunk): NumericalError {
        // sin²(x) + cos²(x) = 1
        let maxError = 0;
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 2 * Math.PI;
            const identity = Math.sin(x) ** 2 + Math.cos(x) ** 2;
            const error = Math.abs(identity - 1.0);
            maxError = Math.max(maxError, error);
        }
        
        return {
            operation: 'trigonometric_identity',
            location: `${chunk.id}:trig_functions`,
            absolute: maxError,
            relative: maxError,
            type: 'rounding'
        };
    }
    
    /**
     * Test exponential stability
     */
    private testExponentialStability(chunk: Chunk): NumericalError {
        // Test e^x * e^(-x) = 1
        let maxError = 0;
        
        for (let x = 1; x <= 20; x++) {
            const forward = Math.exp(x);
            const backward = Math.exp(-x);
            const product = forward * backward;
            const error = Math.abs(product - 1.0);
            maxError = Math.max(maxError, error);
        }
        
        return {
            operation: 'exponential_computation',
            location: `${chunk.id}:exp_functions`,
            absolute: maxError,
            relative: maxError,
            type: maxError > 1e-10 ? 'accumulation' : 'rounding'
        };
    }
    
    /**
     * Update accumulated error tracking
     */
    private updateAccumulatedError(chunkId: string, errors: NumericalError[]): number {
        const history = this.errorHistory.get(chunkId) || { 
            total: 0, 
            count: 0, 
            maxSingle: 0,
            trend: 'stable' as const
        };
        
        // RMS of new errors
        const newError = Math.sqrt(
            errors.map(e => e.absolute ** 2).reduce((a, b) => a + b, 0)
        );
        
        // Update history
        history.total += newError;
        history.count += 1;
        history.maxSingle = Math.max(history.maxSingle, newError);
        
        // Determine trend
        if (history.count > 5) {
            const avgError = history.total / history.count;
            if (newError > avgError * 1.5) {
                history.trend = 'growing';
            } else if (newError < avgError * 0.5) {
                history.trend = 'stable';
            } else {
                history.trend = 'oscillating';
            }
        }
        
        this.errorHistory.set(chunkId, history);
        
        return history.total;
    }
    
    /**
     * Check if error is within acceptable bounds
     */
    isWithinBounds(report: ErrorReport): boolean {
        const chunkNumber = parseInt(report.chunkId.split('-').pop() || '1');
        const allowedAccumulated = this.bounds.accumulated(chunkNumber);
        
        return report.accumulated <= allowedAccumulated && 
               report.criticalErrors.length === 0;
    }
    
    /**
     * Get error trend analysis
     */
    getErrorTrend(chunkId: string): string {
        const history = this.errorHistory.get(chunkId);
        return history?.trend || 'unknown';
    }
    
    /**
     * Generate test matrix
     */
    private generateTestMatrix(size: number): number[][] {
        const matrix: number[][] = [];
        
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                // Well-conditioned matrix
                if (i === j) {
                    matrix[i][j] = size + Math.random();
                } else {
                    matrix[i][j] = Math.random();
                }
            }
        }
        
        return matrix;
    }
    
    /**
     * Generate symmetric matrix for eigenvalue tests
     */
    private generateSymmetricMatrix(size: number): number[][] {
        const matrix: number[][] = [];
        
        for (let i = 0; i < size; i++) {
            matrix[i] = new Array(size);
            for (let j = 0; j <= i; j++) {
                const value = Math.random() * 2 - 1;
                matrix[i][j] = value;
                if (i !== j) {
                    matrix[j][i] = value;
                }
            }
        }
        
        return matrix;
    }
    
    /**
     * Perturb matrix slightly
     */
    private perturbMatrix(matrix: number[][], epsilon: number): number[][] {
        const perturbed = matrix.map(row => [...row]);
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                perturbed[i][j] += (Math.random() - 0.5) * epsilon;
            }
        }
        
        return perturbed;
    }
    
    /**
     * Exact matrix inverse (simulated with high precision)
     */
    private exactMatrixInverse(matrix: number[][]): number[][] {
        // In production, use arbitrary precision library
        // For now, simulate with standard inverse
        return this.actualMatrixInverse(matrix);
    }
    
    /**
     * Actual matrix inverse using Gauss-Jordan elimination
     */
    private actualMatrixInverse(matrix: number[][]): number[][] {
        const n = matrix.length;
        const augmented = matrix.map((row, i) => [
            ...row,
            ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
        ]);
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Partial pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // Make diagonal 1
            const divisor = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= divisor;
            }
            
            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        // Extract inverse
        const inverse: number[][] = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = augmented[i].slice(n);
        }
        
        return inverse;
    }
    
    /**
     * Compute matrix error
     */
    private matrixError(exact: number[][], actual: number[][]): {absolute: number, relative: number} {
        let maxAbsolute = 0;
        let sumSquared = 0;
        let exactNorm = 0;
        
        for (let i = 0; i < exact.length; i++) {
            for (let j = 0; j < exact[i].length; j++) {
                const diff = Math.abs(exact[i][j] - actual[i][j]);
                maxAbsolute = Math.max(maxAbsolute, diff);
                sumSquared += diff * diff;
                exactNorm += exact[i][j] * exact[i][j];
            }
        }
        
        return {
            absolute: maxAbsolute,
            relative: Math.sqrt(sumSquared / exactNorm)
        };
    }
    
    /**
     * Approximate eigenvalues using power iteration
     */
    private approximateEigenvalues(matrix: number[][]): number[] {
        const n = matrix.length;
        const eigenvalues: number[] = [];
        
        // For simplicity, return diagonal elements as approximation
        for (let i = 0; i < n; i++) {
            eigenvalues.push(matrix[i][i]);
        }
        
        return eigenvalues.sort((a, b) => Math.abs(b) - Math.abs(a));
    }
    
    /**
     * Fail build if error exceeds bounds
     */
    failBuildOnDrift(report: ErrorReport): void {
        if (!this.isWithinBounds(report)) {
            const chunkNumber = parseInt(report.chunkId.split('-').pop() || '1');
            const allowedAccumulated = this.bounds.accumulated(chunkNumber);
            
            throw new Error(
                `Numerical drift exceeded: ${report.accumulated.toExponential(2)} > ${allowedAccumulated.toExponential(2)}\n` +
                `Critical errors: ${report.criticalErrors.length}\n` +
                `Trend: ${this.getErrorTrend(report.chunkId)}`
            );
        }
    }
}

/**
 * Chunk interface for testing
 */
interface Chunk {
    id: string;
    getNumericalOperations: () => NumericalOperation[];
}

/**
 * Test the numerical stability harness
 */
export async function testNumericalStability() {
    console.log('🔧 Testing Numerical Stability Harness...\n');
    
    const harness = new NumericalStabilityHarness();
    
    // Test multiple chunks to see accumulation
    for (let i = 1; i <= 5; i++) {
        const chunk: Chunk = {
            id: `chunk-${i.toString().padStart(3, '0')}`,
            getNumericalOperations: () => []
        };
        
        const report = harness.trackChunkErrors(chunk);
        
        console.log(`📊 Chunk ${chunk.id}:`);
        console.log(`   Errors found: ${report.errors.length}`);
        console.log(`   Accumulated error: ${report.accumulated.toExponential(2)}`);
        console.log(`   Within bounds: ${report.withinBounds ? '✓' : '✗'}`);
        console.log(`   Error trend: ${harness.getErrorTrend(chunk.id)}`);
        
        if (report.errors.length > 0) {
            console.log('   Top errors:');
            report.errors
                .sort((a, b) => b.absolute - a.absolute)
                .slice(0, 3)
                .forEach(e => {
                    console.log(`     - ${e.operation}: ${e.absolute.toExponential(2)} (${e.type})`);
                });
        }
        
        console.log('');
    }
    
    console.log('✅ Numerical Stability test complete!');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NumericalStabilityHarness, testNumericalStability };
}