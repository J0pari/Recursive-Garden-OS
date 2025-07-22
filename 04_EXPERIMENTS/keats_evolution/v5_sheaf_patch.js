/**
 * V5 SHEAFIFICATION PATCH
 * 
 * This patch properly connects V5's UI sliders to mathematical transformations
 * creating the UI→ENGINE→UI→ENGINE morphisms the user requested.
 * 
 * To apply: Include this script after v5_sheafification.js in keats_v5.html
 */

// Wait for V5 to fully initialize
function applyV5Sheafification() {
    // Check if renderer and engine exist
    if (!window.renderer || !window.engine) {
        console.warn('Waiting for V5 initialization...');
        setTimeout(applyV5Sheafification, 500);
        return;
    }
    
    // Create sheafification instance
    const sheafifier = new V5Sheafification(window.renderer, window.engine);
    
    // Extend renderer with new methods needed by sheafification
    extendRenderer(window.renderer);
    
    // Extend engine with new methods needed by sheafification
    extendEngine(window.engine);
    
    // Apply the sheafification
    sheafifier.sheafify();
    
    // Update UI to show sheafification is active
    const statusElement = document.querySelector('.system-status');
    if (statusElement) {
        statusElement.innerHTML += '<div class="sheaf-status">✓ UI→ENGINE→UI morphisms active</div>';
    }
}

/**
 * Extend the renderer with methods that properly handle mathematical feedback
 */
function extendRenderer(renderer) {
    // Update particle field based on field theory computation
    renderer.updateParticleField = function(fieldData) {
        const { field, density, energy } = fieldData;
        
        // Update particle positions based on field
        if (this.particles && this.particles.geometry) {
            const positions = this.particles.geometry.attributes.position.array;
            const fieldSize = Math.sqrt(field.length);
            
            for (let i = 0; i < this.particleCount; i++) {
                const idx = i * 3;
                
                // Sample field at particle position
                const x = (positions[idx] + 50) / 100;
                const y = (positions[idx + 1] + 50) / 100;
                
                const fieldX = Math.floor(x * fieldSize);
                const fieldY = Math.floor(y * fieldSize);
                const fieldIdx = fieldY * fieldSize + fieldX;
                
                if (fieldIdx >= 0 && fieldIdx < field.length) {
                    // Modulate Z position by field value
                    positions[idx + 2] += field[fieldIdx] * 0.1;
                }
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update metrics display
        this.updateMetrics({
            fieldEnergy: energy.toFixed(3),
            particleDensity: density
        });
    };
    
    // Deform manifold based on Riemannian geometry
    renderer.deformManifold = function(geometryData) {
        const { metric, curvature, scalarCurvature } = geometryData;
        
        // Apply metric deformation to space
        if (this.particles) {
            // Update vertex shader uniforms for curved space
            if (this.particles.material.uniforms) {
                this.particles.material.uniforms.curvature = { value: curvature };
                this.particles.material.uniforms.metric = { value: metric };
            }
            
            // Deform particle cloud based on curvature
            this.manifoldCurvature = curvature;
            this.targetSemanticAmplification = 1.0 + Math.abs(scalarCurvature) * 0.1;
        }
        
        this.updateMetrics({
            curvature: curvature.toFixed(2),
            scalarCurvature: scalarCurvature.toFixed(3)
        });
    };
    
    // Update flow field visualization
    renderer.updateFlowField = function(flowData) {
        const { field, intensity, curl } = flowData;
        
        // Apply flow to particle velocities
        if (this.particles && this.particleVelocities) {
            const positions = this.particles.geometry.attributes.position.array;
            
            for (let i = 0; i < this.particleCount; i++) {
                const idx = i * 3;
                const x = (positions[idx] + 50) / 100;
                const y = (positions[idx + 1] + 50) / 100;
                
                const fieldX = Math.floor(x * 256);
                const fieldY = Math.floor(y * 256);
                const fieldIdx = fieldY * 256 + fieldX;
                
                if (fieldIdx >= 0 && fieldIdx < field.x.length) {
                    this.particleVelocities[idx] = field.x[fieldIdx] * 0.1;
                    this.particleVelocities[idx + 1] = field.y[fieldIdx] * 0.1;
                }
            }
        }
        
        this.flowIntensity = intensity;
        this.updateMetrics({
            flowIntensity: intensity.toFixed(2),
            curl: curl.toFixed(3)
        });
    };
    
    // Constrain phase space based on modal necessity
    renderer.constrainPhaseSpace = function(constraintData) {
        const { necessity, constraints, phaseSpace } = constraintData;
        
        // Apply constraints to particle motion bounds
        if (this.particles) {
            this.motionConstraints = {
                radius: constraints.radius * 100, // Scale to world units
                strength: necessity
            };
        }
        
        this.updateMetrics({
            necessity: (necessity * 100).toFixed(0) + '%',
            constraintRadius: constraints.radius.toFixed(2)
        });
    };
    
    // Expand phase space based on modal possibility
    renderer.expandPhaseSpace = function(potentialData) {
        const { possibility, potentials, phaseSpace } = potentialData;
        
        // Apply potentials to particle exploration range
        if (this.particles) {
            this.explorationBounds = {
                radius: potentials.radius * 100, // Scale to world units
                strength: possibility
            };
        }
        
        this.updateMetrics({
            possibility: (possibility * 100).toFixed(0) + '%',
            potentialRadius: potentials.radius.toFixed(2)
        });
    };
}

/**
 * Extend the engine with methods that properly handle semantic feedback
 */
function extendEngine(engine) {
    // Update coherence based on semantic field computation
    engine.updateCoherence = function(coherenceData) {
        const { matrix, sensitivity, eigenvalue } = coherenceData;
        
        // Apply coherence to text processing
        if (this.textProcessor) {
            this.textProcessor.coherenceMatrix = matrix;
            this.textProcessor.sensitivity = sensitivity;
            
            // Update semantic connections
            this.semanticCoherence = eigenvalue;
            this.updateSemanticHighlighting(eigenvalue);
        }
        
        // Update consciousness parameters
        if (this.consciousness) {
            this.consciousness.coherenceScore = eigenvalue;
            this.consciousness.contextSensitivity = sensitivity;
        }
        
        this.updateMetrics({
            coherence: eigenvalue.toFixed(3),
            sensitivity: (sensitivity * 100).toFixed(0) + '%'
        });
    };
    
    // Evolve system based on evolution module
    engine.evolve = function(evolutionData) {
        const { rate, fitness, generation, trajectory } = evolutionData;
        
        // Apply evolution to system parameters
        if (this.consciousness) {
            this.consciousness.evolutionRate = rate;
            this.consciousness.fitness = fitness;
            
            // Adapt processing based on fitness
            this.adaptiveProcessing = {
                enabled: true,
                rate: rate,
                direction: trajectory.direction
            };
        }
        
        // Trigger consciousness evolution
        if (Math.random() < rate * 0.1) {
            this.evolveConsciousnessManifold();
        }
        
        this.updateMetrics({
            learningRate: (rate * 100).toFixed(0) + '%',
            fitness: fitness.toFixed(2),
            generation: generation
        });
    };
    
    // Update semantic highlighting based on coherence
    engine.updateSemanticHighlighting = function(coherence) {
        // This would update text display to show semantic connections
        // For now, just log the update
        if (coherence > 0.7) {
            console.log(`High semantic coherence detected: ${coherence.toFixed(3)}`);
        }
    };
    
    // Update metrics display
    engine.updateMetrics = function(metrics) {
        // Send metrics to UI display
        if (window.updateMetricsDisplay) {
            window.updateMetricsDisplay(metrics);
        }
    };
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyV5Sheafification);
} else {
    applyV5Sheafification();
}