// Consolidated Mathematical Utilities
// Extracted from keats_v6.html to eliminate duplication

const MathUtils = {
    // Matrix Operations
    matrixMultiply(A, B) {
        const n = A.length;
        const m = B[0].length;
        const p = B.length;
        const result = Array(n).fill().map(() => Array(m).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                for (let k = 0; k < p; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    },

    matrixAdd(A, B) {
        const n = A.length;
        const m = A[0].length;
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    },

    matrixTranspose(A) {
        const n = A.length;
        const m = A[0].length;
        return Array(m).fill().map((_, i) => Array(n).fill().map((_, j) => A[j][i]));
    },

    computeMatrixDeterminant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            const minor = matrix.slice(1).map(row => 
                row.filter((_, index) => index !== j)
            );
            det += (j % 2 === 0 ? 1 : -1) * matrix[0][j] * this.computeMatrixDeterminant(minor);
        }
        return det;
    },

    computeMatrixInverse(matrix) {
        const n = matrix.length;
        const det = this.computeMatrixDeterminant(matrix);
        if (Math.abs(det) < 1e-10) return null;
        
        if (n === 2) {
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        }
        
        // For larger matrices, use Gaussian elimination
        const augmented = matrix.map((row, i) => 
            [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
        );
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // Make diagonal 1
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
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
        
        // Extract inverse from augmented matrix
        return augmented.map(row => row.slice(n));
    },

    computeEigenvalues(matrix) {
        const n = matrix.length;
        if (n === 1) return [matrix[0][0]];
        if (n === 2) {
            const trace = matrix[0][0] + matrix[1][1];
            const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            const discriminant = trace * trace - 4 * det;
            if (discriminant >= 0) {
                const sqrt_disc = Math.sqrt(discriminant);
                return [(trace + sqrt_disc) / 2, (trace - sqrt_disc) / 2];
            } else {
                return [trace / 2, trace / 2]; // Complex eigenvalues approximated as real
            }
        }
        
        // Power iteration for dominant eigenvalue (simplified)
        let v = Array(n).fill(1);
        let eigenvalue = 0;
        
        for (let iter = 0; iter < 100; iter++) {
            // Multiply matrix by vector
            const Av = Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    Av[i] += matrix[i][j] * v[j];
                }
            }
            
            // Normalize
            const norm = Math.sqrt(Av.reduce((sum, x) => sum + x * x, 0));
            v = Av.map(x => x / norm);
            
            // Rayleigh quotient
            let vAv = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    vAv += v[i] * matrix[i][j] * v[j];
                }
            }
            eigenvalue = vAv;
        }
        
        // Return approximation (dominant eigenvalue repeated)
        return Array(n).fill(eigenvalue);
    },

    // Differential Geometry
    computeChristoffelSymbols(metric) {
        const dim = metric.length;
        const christoffel = Array(dim).fill().map(() => 
            Array(dim).fill().map(() => Array(dim).fill(0))
        );
        
        const metricInv = this.computeMatrixInverse(metric);
        if (!metricInv) return christoffel;
        
        // Γ^k_ij = (1/2)g^kl(∂_i g_jl + ∂_j g_il - ∂_l g_ij)
        // Using finite differences for derivatives
        const epsilon = 1e-6;
        
        for (let k = 0; k < dim; k++) {
            for (let i = 0; i < dim; i++) {
                for (let j = 0; j < dim; j++) {
                    let gamma = 0;
                    
                    for (let l = 0; l < dim; l++) {
                        // Approximate partial derivatives
                        const dg_jl_di = 0; // Would need field values
                        const dg_il_dj = 0; 
                        const dg_ij_dl = 0;
                        
                        gamma += 0.5 * metricInv[k][l] * (dg_jl_di + dg_il_dj - dg_ij_dl);
                    }
                    
                    christoffel[k][i][j] = gamma;
                }
            }
        }
        
        return christoffel;
    },

    computeRiemannTensor(christoffel, metric) {
        const dim = metric.length;
        const riemann = Array(dim).fill().map(() => 
            Array(dim).fill().map(() => 
                Array(dim).fill().map(() => Array(dim).fill(0))
            )
        );
        
        // R^i_jkl = ∂_k Γ^i_jl - ∂_l Γ^i_jk + Γ^i_mk Γ^m_jl - Γ^i_ml Γ^m_jk
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                for (let k = 0; k < dim; k++) {
                    for (let l = 0; l < dim; l++) {
                        let R = 0;
                        
                        // Contraction terms
                        for (let m = 0; m < dim; m++) {
                            R += christoffel[i][m][k] * christoffel[m][j][l];
                            R -= christoffel[i][m][l] * christoffel[m][j][k];
                        }
                        
                        riemann[i][j][k][l] = R;
                    }
                }
            }
        }
        
        return riemann;
    },

    computeRicciTensor(riemann, dim) {
        const ricci = Array(dim).fill().map(() => Array(dim).fill(0));
        
        // R_ij = R^k_ikj
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                for (let k = 0; k < dim; k++) {
                    ricci[i][j] += riemann[k][i][k][j];
                }
            }
        }
        
        return ricci;
    },

    computeScalarCurvature(ricci, metricInv) {
        const dim = ricci.length;
        let R = 0;
        
        // R = g^ij R_ij
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                R += metricInv[i][j] * ricci[i][j];
            }
        }
        
        return R;
    },

    // Vector Operations
    vectorNorm(v) {
        return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
    },

    vectorNormalize(v) {
        const norm = this.vectorNorm(v);
        return norm > 0 ? v.map(x => x / norm) : v;
    },

    vectorDot(v1, v2) {
        return v1.reduce((sum, x, i) => sum + x * v2[i], 0);
    },

    vectorCross(v1, v2) {
        if (v1.length !== 3 || v2.length !== 3) {
            throw new Error('Cross product only defined for 3D vectors');
        }
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    },

    // Geodesic solver
    solveGeodesicEquation(initial, target, christoffel, steps = 100) {
        const dim = initial.position.length;
        const dt = 1.0 / steps;
        
        const path = [{
            position: [...initial.position],
            velocity: [...initial.velocity],
            t: 0
        }];
        
        let pos = [...initial.position];
        let vel = [...initial.velocity];
        
        for (let step = 0; step < steps; step++) {
            // Geodesic equation: d²x^i/dt² + Γ^i_jk (dx^j/dt)(dx^k/dt) = 0
            const accel = Array(dim).fill(0);
            
            for (let i = 0; i < dim; i++) {
                for (let j = 0; j < dim; j++) {
                    for (let k = 0; k < dim; k++) {
                        accel[i] -= christoffel[i][j][k] * vel[j] * vel[k];
                    }
                }
            }
            
            // Update velocity and position
            for (let i = 0; i < dim; i++) {
                vel[i] += accel[i] * dt;
                pos[i] += vel[i] * dt;
            }
            
            path.push({
                position: [...pos],
                velocity: [...vel],
                t: (step + 1) * dt
            });
        }
        
        return path;
    }
};

// Export for use in browser
if (typeof window !== 'undefined') {
    window.MathUtils = MathUtils;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathUtils;
}