# GPU/CPU Hybrid Compute Architecture

## Current State Analysis

### Existing Infrastructure
- **MathematicalWorker**: WebWorker wrapper for mathematical computations
- **GlobalMathematicalWorkerManager**: Manages primary and backup workers
- **Worker Methods**: All math goes through workers (Fisher, Riemann, E8, etc.)
- **Problem**: Workers use CPU only, no GPU utilization

### Performance Bottlenecks
1. **Particle Physics**: 5000 particles computed every frame in workers
2. **Chladni Vertices**: 14,400 vertices computed per frame
3. **Christoffel Symbols**: Complex tensor computations on CPU
4. **No Parallelism**: Sequential computation in workers

## GPU Compute Design

### Architecture Principles
- **0-MORPHISM**: GPU compute infrastructure exists
- **1-MORPHISM**: Transform data between CPU and GPU
- **2-MORPHISM**: Optimize data layout for GPU
- **3-MORPHISM**: Implement specific compute shaders

### WebGL 2.0 Compute Strategy

Since WebGL doesn't have compute shaders, we'll use:
1. **Transform Feedback**: For particle physics
2. **Texture-based Computing**: For tensor operations
3. **Fragment Shaders**: For parallel computation
4. **Ping-pong Buffers**: For iterative computations

### Data Layout

#### Texture-based Storage
```javascript
class GPUComputeManager {
    constructor(gl) {
        this.gl = gl;
        this.textures = new Map();
        this.framebuffers = new Map();
        this.programs = new Map();
    }
    
    // Store matrix as texture
    createMatrixTexture(matrix, width, height) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        // Pack matrix into RGBA channels
        const data = new Float32Array(width * height * 4);
        let idx = 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                // Store 4 values per pixel
                data[idx++] = matrix[i * width + j] || 0;
                data[idx++] = matrix[i * width + j + 1] || 0;
                data[idx++] = matrix[i * width + j + 2] || 0;
                data[idx++] = matrix[i * width + j + 3] || 0;
            }
        }
        
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA32F,
            width, height, 0,
            this.gl.RGBA, this.gl.FLOAT, data
        );
        
        return texture;
    }
}
```

### GPU Compute Kernels

#### 1. Christoffel Symbols Computation
```glsl
// Vertex shader (pass-through)
attribute vec2 position;
varying vec2 vTexCoord;

void main() {
    vTexCoord = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}

// Fragment shader (compute Christoffel symbols)
precision highp float;
varying vec2 vTexCoord;
uniform sampler2D metric;      // Metric tensor g_ij
uniform sampler2D metricDeriv; // Derivatives ∂g_ij/∂x^k

void main() {
    ivec2 coord = ivec2(vTexCoord * 256.0);
    int i = coord.x / 16;
    int j = (coord.x % 16);
    int k = coord.y;
    
    // Christoffel symbol: Γ^i_jk = 0.5 * g^il * (∂g_lj/∂x^k + ∂g_lk/∂x^j - ∂g_jk/∂x^l)
    vec4 christoffel = vec4(0.0);
    
    for (int l = 0; l < 8; l++) {
        vec4 g_inv = texture2D(metric, vec2(float(i), float(l)) / 8.0);
        vec4 dg_lj_k = texture2D(metricDeriv, vec2(float(l * 8 + j), float(k)) / 64.0);
        vec4 dg_lk_j = texture2D(metricDeriv, vec2(float(l * 8 + k), float(j)) / 64.0);
        vec4 dg_jk_l = texture2D(metricDeriv, vec2(float(j * 8 + k), float(l)) / 64.0);
        
        christoffel += 0.5 * g_inv * (dg_lj_k + dg_lk_j - dg_jk_l);
    }
    
    gl_FragColor = christoffel;
}
```

#### 2. Particle Physics Transform Feedback
```glsl
// Vertex shader with transform feedback
attribute vec3 position;
attribute vec3 velocity;
attribute float mass;

uniform float dt;
uniform sampler2D christoffelTexture;
uniform vec3 manifoldCenter;

varying vec3 outPosition;
varying vec3 outVelocity;

void main() {
    // Sample Christoffel symbols at particle position
    vec2 texCoord = (position.xy - manifoldCenter.xy) * 0.1 + 0.5;
    vec4 christoffel = texture2D(christoffelTexture, texCoord);
    
    // Geodesic equation: d²x^i/dt² = -Γ^i_jk * dx^j/dt * dx^k/dt
    vec3 acceleration = vec3(0.0);
    acceleration.x = -christoffel.x * velocity.y * velocity.z;
    acceleration.y = -christoffel.y * velocity.x * velocity.z;
    acceleration.z = -christoffel.z * velocity.x * velocity.y;
    
    // Update velocity and position
    outVelocity = velocity + acceleration * dt;
    outPosition = position + outVelocity * dt;
    
    // Output for transform feedback
    gl_Position = vec4(outPosition, 1.0);
}
```

### Integration with MathematicalWorker

```javascript
class GPUEnhancedMathWorker extends MathematicalWorker {
    constructor() {
        super();
        this.gpuCompute = null;
        this.useGPU = this.checkGPUSupport();
    }
    
    checkGPUSupport() {
        // Check for WebGL2 and required extensions
        const canvas = new OffscreenCanvas(1, 1);
        const gl = canvas.getContext('webgl2');
        if (!gl) return false;
        
        // Check for required extensions
        const requiredExtensions = [
            'EXT_color_buffer_float',
            'OES_texture_float_linear'
        ];
        
        return requiredExtensions.every(ext => gl.getExtension(ext));
    }
    
    async computeChristoffelSymbols(metric, points) {
        if (this.useGPU && points.length > 100) {
            // Use GPU for large datasets
            return this.gpuCompute.computeChristoffel(metric, points);
        } else {
            // Fallback to CPU computation
            return super.computeChristoffelSymbols(metric, points);
        }
    }
    
    async computeParticlePhysics(positions, velocities, params) {
        const particleCount = positions.length / 3;
        
        if (this.useGPU && particleCount > 1000) {
            // GPU path for large particle systems
            return this.gpuCompute.updateParticles(positions, velocities, params);
        } else {
            // CPU path for small systems
            return super.computeParticlePhysics(positions, velocities, params);
        }
    }
}
```

### Load Balancing Strategy

```javascript
class HybridComputeScheduler {
    constructor(workerCount, hasGPU) {
        this.cpuWorkers = new Array(workerCount);
        this.gpuCompute = hasGPU ? new GPUComputeManager() : null;
        this.taskQueue = [];
        this.metrics = {
            cpuLoad: 0,
            gpuLoad: 0,
            cpuTasks: 0,
            gpuTasks: 0
        };
    }
    
    scheduleTask(task) {
        const { type, data, priority } = task;
        
        // Decision matrix for CPU vs GPU
        const useGPU = this.shouldUseGPU(type, data);
        
        if (useGPU && this.gpuCompute) {
            return this.scheduleGPUTask(task);
        } else {
            return this.scheduleCPUTask(task);
        }
    }
    
    shouldUseGPU(type, data) {
        // GPU is better for:
        // - Large matrix operations (>100x100)
        // - Particle systems (>1000 particles)
        // - Parallel tensor operations
        // - Image-like data processing
        
        switch(type) {
            case 'christoffel':
                return data.points > 100;
            case 'particles':
                return data.count > 1000;
            case 'chladni':
                return data.vertices > 5000;
            case 'geodesics':
                return data.paths > 50;
            default:
                return false;
        }
    }
    
    getLoadBalance() {
        const cpuUtilization = this.metrics.cpuLoad / this.cpuWorkers.length;
        const gpuUtilization = this.metrics.gpuLoad;
        
        return {
            cpu: cpuUtilization,
            gpu: gpuUtilization,
            recommendation: gpuUtilization < cpuUtilization ? 'gpu' : 'cpu'
        };
    }
}
```

## Implementation Plan

### Phase 1: GPU Infrastructure (0-MORPHISM)
1. Create GPUComputeManager class
2. Set up WebGL2 context in worker
3. Implement texture-based data storage
4. Create shader compilation pipeline

### Phase 2: Core Computations (1-MORPHISM)
1. Port Christoffel symbols to GPU
2. Implement particle physics with transform feedback
3. Create Chladni pattern GPU kernel
4. Add geodesic computation shaders

### Phase 3: Integration (2-MORPHISM)
1. Extend MathematicalWorker with GPU support
2. Implement load balancing scheduler
3. Add GPU/CPU decision logic
4. Create performance monitoring

### Phase 4: Optimization (3-MORPHISM)
1. Optimize data transfer between CPU/GPU
2. Implement double buffering for GPU
3. Add texture caching
4. Profile and tune thresholds

## Performance Targets

### Current (CPU only)
- Particles: 16ms per frame (60fps barely)
- Chladni: 20ms per frame (50fps)
- Combined: 36ms (27fps)

### Target (GPU/CPU hybrid)
- Particles: 2ms GPU + 1ms CPU coordination
- Chladni: 3ms GPU + 1ms CPU coordination
- Combined: 6ms (166fps capability)

## Memory Management

### GPU Memory Layout
- Christoffel Tensor: 8x8x8 = 512 floats = 2KB
- Metric Tensor: 8x8 = 64 floats = 256B
- Particle Data: 5000 * 4 * 4 = 80KB
- Chladni Vertices: 14400 * 3 * 4 = 172KB
- Total GPU Memory: ~256KB (very manageable)

### CPU Memory
- Keep one copy in workers for fallback
- Use SharedArrayBuffer where supported
- Implement LRU cache for computed values