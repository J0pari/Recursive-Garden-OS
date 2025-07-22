/**
 * V5 Performance Fix - WebWorkers and GPU Awareness
 * 
 * CHARTER_GUARD: Fix V5 performance and remove torsion display
 * BOOK_OF_SHADOWS: SARANETH (Binding/Fixing)
 * MORPHISM: INTENT(smooth graphics) → CHARTER(verified) → BOOK(SARANETH) → CODE
 */

// GPU Detection and Capability Assessment
class GPUDetector {
    constructor() {
        this.capabilities = {
            webgl2: false,
            webgl1: false,
            maxTextureSize: 0,
            maxVertexAttributes: 0,
            renderer: 'unknown',
            vendor: 'unknown',
            powerPreference: 'default',
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }

    detect() {
        const canvas = document.createElement('canvas');
        
        // Try WebGL2 first
        let gl = canvas.getContext('webgl2');
        if (gl) {
            this.capabilities.webgl2 = true;
            this.extractGPUInfo(gl);
        } else {
            // Fall back to WebGL1
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                this.capabilities.webgl1 = true;
                this.extractGPUInfo(gl);
            }
        }

        // Determine power preference based on capabilities
        if (this.capabilities.isMobile) {
            this.capabilities.powerPreference = 'low-power';
        } else if (this.capabilities.renderer.includes('NVIDIA') || 
                   this.capabilities.renderer.includes('AMD') || 
                   this.capabilities.renderer.includes('Radeon')) {
            this.capabilities.powerPreference = 'high-performance';
        }

        return this.capabilities;
    }

    extractGPUInfo(gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            this.capabilities.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            this.capabilities.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
        
        this.capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.capabilities.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    }

    getOptimalSettings() {
        const settings = {
            particleCount: 10000,
            renderScale: 1.0,
            shadowsEnabled: true,
            antialiasing: true,
            workerCount: 4
        };

        if (this.capabilities.isMobile) {
            settings.particleCount = 5000;
            settings.renderScale = 0.75;
            settings.shadowsEnabled = false;
            settings.antialiasing = false;
            settings.workerCount = 2;
        } else if (this.capabilities.powerPreference === 'high-performance') {
            settings.particleCount = 50000;
            settings.renderScale = 1.0;
            settings.shadowsEnabled = true;
            settings.antialiasing = true;
            settings.workerCount = navigator.hardwareConcurrency || 4;
        }

        return settings;
    }
}

// Enhanced WebWorker Pool with dynamic scaling
class EnhancedWorkerPool {
    constructor(gpuCapabilities) {
        this.gpuCapabilities = gpuCapabilities;
        // Get optimal settings from the detector's method
        const detector = new GPUDetector();
        detector.capabilities = gpuCapabilities;
        this.optimalSettings = detector.getOptimalSettings();
        this.workers = [];
        this.taskQueue = [];
        this.busyWorkers = new Set();
        
        // Create worker pool based on hardware
        this.initializeWorkers();
    }

    initializeWorkers() {
        const workerCount = this.optimalSettings.workerCount;
        
        for (let i = 0; i < workerCount; i++) {
            const workerCode = this.generateOptimizedWorkerCode();
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            
            worker.onmessage = (e) => this.handleWorkerMessage(worker, e);
            worker.onerror = (e) => this.handleWorkerError(worker, e);
            
            this.workers.push(worker);
        }
        
    }

    generateOptimizedWorkerCode() {
        return `
            // Optimized WebWorker for V5 mathematical computations
            
            // Cache for frequently used values
            const cache = new Map();
            
            // SIMD-like batch processing for better performance
            function processBatch(data) {
                const { type, batch } = data;
                const results = [];
                
                for (const item of batch) {
                    switch (type) {
                        case 'particle_physics':
                            results.push(computeParticlePhysics(item));
                            break;
                        case 'field_computation':
                            results.push(computeFieldValue(item));
                            break;
                        case 'curvature':
                            results.push(computeCurvature(item));
                            break;
                    }
                }
                
                return results;
            }
            
            function computeParticlePhysics(particle) {
                // Optimized particle physics
                const { x, y, z, vx, vy, vz, field } = particle;
                
                // Use cached field values when possible
                const cacheKey = \`\${Math.floor(x)},\${Math.floor(y)},\${Math.floor(z)}\`;
                let fieldValue = cache.get(cacheKey);
                
                if (!fieldValue) {
                    fieldValue = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(z * 0.1);
                    cache.set(cacheKey, fieldValue);
                }
                
                // Update velocities with field influence
                return {
                    vx: vx + fieldValue * 0.01,
                    vy: vy + fieldValue * 0.01,
                    vz: vz + fieldValue * 0.01
                };
            }
            
            function computeFieldValue(point) {
                const { x, y, z, time } = point;
                // Simplified field computation for performance
                return {
                    value: Math.sin(x * 0.1 + time) * Math.cos(y * 0.1) * Math.sin(z * 0.1),
                    gradient: [
                        Math.cos(x * 0.1 + time) * 0.1,
                        -Math.sin(y * 0.1) * 0.1,
                        Math.cos(z * 0.1) * 0.1
                    ]
                };
            }
            
            function computeCurvature(manifoldPoint) {
                // Simplified curvature for performance
                const { x, y, z } = manifoldPoint;
                return {
                    scalar: Math.sin(x * y * z * 0.001),
                    ricci: 0.5 + 0.5 * Math.cos(x + y + z)
                };
            }
            
            // Message handler
            self.onmessage = function(e) {
                const { id, task } = e.data;
                
                try {
                    let result;
                    
                    if (task.batch) {
                        result = processBatch(task);
                    } else {
                        // Single computation
                        switch (task.type) {
                            case 'particle_physics':
                                result = computeParticlePhysics(task.data);
                                break;
                            case 'field_computation':
                                result = computeFieldValue(task.data);
                                break;
                            case 'curvature':
                                result = computeCurvature(task.data);
                                break;
                            default:
                                throw new Error('Unknown task type: ' + task.type);
                        }
                    }
                    
                    self.postMessage({ id, success: true, result });
                    
                } catch (error) {
                    self.postMessage({ id, success: false, error: error.message });
                }
            };
        `;
    }

    async execute(task) {
        return new Promise((resolve, reject) => {
            const taskId = Math.random().toString(36).substring(7);
            
            // Find available worker
            const availableWorker = this.workers.find(w => !this.busyWorkers.has(w));
            
            if (availableWorker) {
                this.executeOnWorker(availableWorker, taskId, task, resolve, reject);
            } else {
                // Queue task if all workers busy
                this.taskQueue.push({ taskId, task, resolve, reject });
            }
        });
    }

    executeOnWorker(worker, taskId, task, resolve, reject) {
        this.busyWorkers.add(worker);
        
        const timeout = setTimeout(() => {
            reject(new Error('Worker timeout'));
            this.busyWorkers.delete(worker);
            this.processQueue();
        }, 5000);

        const messageHandler = (e) => {
            if (e.data.id === taskId) {
                clearTimeout(timeout);
                worker.removeEventListener('message', messageHandler);
                this.busyWorkers.delete(worker);
                
                if (e.data.success) {
                    resolve(e.data.result);
                } else {
                    reject(new Error(e.data.error));
                }
                
                this.processQueue();
            }
        };

        worker.addEventListener('message', messageHandler);
        worker.postMessage({ id: taskId, task });
    }

    processQueue() {
        if (this.taskQueue.length === 0) return;
        
        const availableWorker = this.workers.find(w => !this.busyWorkers.has(w));
        if (availableWorker) {
            const { taskId, task, resolve, reject } = this.taskQueue.shift();
            this.executeOnWorker(availableWorker, taskId, task, resolve, reject);
        }
    }

    handleWorkerMessage(worker, e) {
        // Handled by individual message handlers
    }

    handleWorkerError(worker, e) {
        this.busyWorkers.delete(worker);
        this.processQueue();
    }

    // Batch processing for better performance
    async executeBatch(type, items) {
        const batchSize = Math.ceil(items.length / this.workers.length);
        const batches = [];
        
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        
        const promises = batches.map(batch => 
            this.execute({ type, batch: batch, batch: true })
        );
        
        const results = await Promise.all(promises);
        return results.flat();
    }

    terminate() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        this.taskQueue = [];
        this.busyWorkers.clear();
    }
}

// Remove torsion field display
function removeTorsionDisplay() {
    // Hide the cross-strata display that shows torsion
    const crossStrataDisplay = document.getElementById('cross-strata-display');
    if (crossStrataDisplay) {
        crossStrataDisplay.style.display = 'none';
    }
    
    // Override the updateCrossStrataDisplay function to prevent torsion updates
    if (window.renderer && window.renderer.updateCrossStrataDisplay) {
        const originalUpdate = window.renderer.updateCrossStrataDisplay;
        window.renderer.updateCrossStrataDisplay = function(sourceLayer, message, connectionType) {
            // Filter out torsion-related messages
            if (message && message.toLowerCase().includes('torsion')) {
                return; // Skip torsion updates
            }
            // Call original for non-torsion updates
            originalUpdate.call(this, sourceLayer, message, connectionType);
        };
    }
}

// Enhanced render loop with GPU-aware optimizations
function createOptimizedRenderLoop(renderer, workerPool) {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    
    // Adaptive quality settings
    let dynamicQuality = {
        particleSize: 1.0,
        updateFrequency: 1,
        frameSkip: 0
    };
    
    function adjustQuality(currentFps) {
        if (currentFps < 30 && dynamicQuality.frameSkip < 2) {
            // Reduce quality if FPS too low
            dynamicQuality.particleSize *= 0.9;
            dynamicQuality.updateFrequency = 2;
            dynamicQuality.frameSkip = 1;
        } else if (currentFps > 50 && dynamicQuality.frameSkip > 0) {
            // Increase quality if FPS high
            dynamicQuality.particleSize = Math.min(1.5, dynamicQuality.particleSize * 1.1);
            dynamicQuality.updateFrequency = 1;
            dynamicQuality.frameSkip = 0;
        }
    }
    
    async function animate() {
        requestAnimationFrame(animate);
        
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        // FPS calculation
        frameCount++;
        if (frameCount % 60 === 0) {
            fps = 1000 / (deltaTime / 60);
            adjustQuality(fps);
            renderer.fps = Math.round(fps);
        }
        
        // Skip frames if needed for performance
        if (frameCount % (dynamicQuality.frameSkip + 1) !== 0) {
            return;
        }
        
        // Batch particle updates through WebWorkers
        if (renderer.particles && frameCount % dynamicQuality.updateFrequency === 0) {
            const positions = renderer.particles.geometry.attributes.position.array;
            const particleData = [];
            
            // Prepare batch data
            for (let i = 0; i < positions.length; i += 3) {
                particleData.push({
                    x: positions[i],
                    y: positions[i + 1],
                    z: positions[i + 2],
                    vx: 0, vy: 0, vz: 0,
                    field: 1.0
                });
            }
            
            // Process in WebWorkers
            try {
                const updates = await workerPool.executeBatch('particle_physics', particleData);
                
                // Apply updates
                for (let i = 0; i < updates.length; i++) {
                    const update = updates[i];
                    const idx = i * 3;
                    positions[idx] += update.vx;
                    positions[idx + 1] += update.vy;
                    positions[idx + 2] += update.vz;
                }
                
                renderer.particles.geometry.attributes.position.needsUpdate = true;
            } catch (error) {
            }
        }
        
        // Update particle size based on dynamic quality
        if (renderer.particleMaterial) {
            renderer.particleMaterial.size = renderer.baseParticleSize * dynamicQuality.particleSize;
        }
        
        // Render
        if (renderer.renderScene) {
            renderer.renderScene();
        }
        
        lastTime = currentTime;
    }
    
    animate();
}

// Initialize performance fixes
function initializeV5PerformanceFixes() {
    
    // 1. Detect GPU capabilities
    const gpuDetector = new GPUDetector();
    const gpuCapabilities = gpuDetector.detect();
    
    // 2. Create optimized WebWorker pool
    const workerPool = new EnhancedWorkerPool(gpuCapabilities);
    window.v5WorkerPool = workerPool;
    
    // 3. Remove torsion display
    removeTorsionDisplay();
    
    // 4. Apply GPU-aware Three.js settings
    if (window.renderer) {
        const settings = gpuCapabilities.getOptimalSettings();
        
        // Update renderer settings
        if (window.renderer && window.renderer.renderer) {
            window.renderer.renderer.setPixelRatio(settings.renderScale * window.devicePixelRatio);
            window.renderer.renderer.shadowMap.enabled = settings.shadowsEnabled;
            window.renderer.renderer.antialias = settings.antialiasing;
        }
        
        // Update particle count
        if (window.renderer.particleCount !== settings.particleCount) {
            // This would require recreating the particle system
        }
        
        // Create optimized render loop
        createOptimizedRenderLoop(window.renderer, workerPool);
    }
    
    // 5. Add performance monitoring
    setInterval(() => {
        if (window.renderer && window.renderer.fps) {
            if (window.renderer.fps < 30) {
            }
        }
    }, 5000);
    
}

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeV5PerformanceFixes);
} else {
    initializeV5PerformanceFixes();
}

// Export for manual initialization
window.V5PerformanceFix = {
    GPUDetector,
    EnhancedWorkerPool,
    initializeV5PerformanceFixes,
    removeTorsionDisplay
};