/**
 * V5 Status Panel - Clean, collapsible, draggable status display
 * 
 * CHARTER_GUARD: Create minimal status panel without torsion
 * BOOK_OF_SHADOWS: KIBETH (Smooth Transitions)
 * MORPHISM: INTENT(clean UI) → CHARTER(verified) → BOOK(KIBETH) → CODE
 */

class V5StatusPanel {
    constructor() {
        this.panel = null;
        this.isCollapsed = true;
        this.isDragging = false;
        this.currentX = window.innerWidth - 220;
        this.currentY = 20;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        this.createPanel();
        this.attachEventListeners();
        this.startUpdateLoop();
    }

    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'v5-status-panel';
        this.panel.className = 'v5-status-panel';
        
        // Panel HTML structure
        this.panel.innerHTML = `
            <div class="v5-status-header">
                <span class="v5-status-title">System Status</span>
                <button class="v5-status-toggle">▼</button>
            </div>
            <div class="v5-status-content" style="display: none;">
                <div class="v5-status-item">
                    <span class="v5-status-label">FPS:</span>
                    <span class="v5-status-value" id="v5-fps">60</span>
                </div>
                <div class="v5-status-item">
                    <span class="v5-status-label">Particles:</span>
                    <span class="v5-status-value" id="v5-particles">0</span>
                </div>
                <div class="v5-status-item">
                    <span class="v5-status-label">Workers:</span>
                    <span class="v5-status-value" id="v5-workers">0</span>
                </div>
                <div class="v5-status-item">
                    <span class="v5-status-label">GPU:</span>
                    <span class="v5-status-value" id="v5-gpu">Detecting...</span>
                </div>
                <div class="v5-status-item">
                    <span class="v5-status-label">Modal:</span>
                    <span class="v5-status-value" id="v5-modal">□ ◊</span>
                </div>
                <div class="v5-status-item">
                    <span class="v5-status-label">Coherence:</span>
                    <span class="v5-status-value" id="v5-coherence">0.0</span>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Set initial position
        this.panel.style.left = `${this.currentX}px`;
        this.panel.style.top = `${this.currentY}px`;
        
        // Add to page
        document.body.appendChild(this.panel);
    }

    addStyles() {
        if (document.getElementById('v5-status-panel-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'v5-status-panel-styles';
        styles.textContent = `
            .v5-status-panel {
                position: fixed;
                width: 200px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 12px;
                z-index: 10000;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                transition: opacity 0.3s ease;
                user-select: none;
            }
            
            .v5-status-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px 8px 0 0;
                cursor: move;
            }
            
            .v5-status-title {
                font-weight: bold;
                color: #10b981;
            }
            
            .v5-status-toggle {
                background: none;
                border: none;
                color: #fff;
                cursor: pointer;
                font-size: 10px;
                padding: 2px 6px;
                transition: transform 0.3s ease;
            }
            
            .v5-status-toggle:hover {
                color: #10b981;
            }
            
            .v5-status-toggle.collapsed {
                transform: rotate(-90deg);
            }
            
            .v5-status-content {
                padding: 12px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .v5-status-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                opacity: 0.9;
            }
            
            .v5-status-label {
                color: #9ca3af;
            }
            
            .v5-status-value {
                color: #10b981;
                font-weight: bold;
            }
            
            .v5-status-panel.dragging {
                opacity: 0.7;
                cursor: move;
            }
            
            /* Scrollbar styling */
            .v5-status-content::-webkit-scrollbar {
                width: 4px;
            }
            
            .v5-status-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .v5-status-content::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.5);
                border-radius: 2px;
            }
        `;
        
        document.head.appendChild(styles);
    }

    attachEventListeners() {
        const header = this.panel.querySelector('.v5-status-header');
        const toggleBtn = this.panel.querySelector('.v5-status-toggle');
        const content = this.panel.querySelector('.v5-status-content');
        
        // Toggle collapse/expand
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.isCollapsed = !this.isCollapsed;
            
            if (this.isCollapsed) {
                content.style.display = 'none';
                toggleBtn.classList.add('collapsed');
            } else {
                content.style.display = 'block';
                toggleBtn.classList.remove('collapsed');
            }
        });
        
        // Dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target === toggleBtn) return;
            
            this.isDragging = true;
            this.dragStartX = e.clientX - this.currentX;
            this.dragStartY = e.clientY - this.currentY;
            this.panel.classList.add('dragging');
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            this.currentX = e.clientX - this.dragStartX;
            this.currentY = e.clientY - this.dragStartY;
            
            // Keep panel on screen
            this.currentX = Math.max(0, Math.min(window.innerWidth - this.panel.offsetWidth, this.currentX));
            this.currentY = Math.max(0, Math.min(window.innerHeight - this.panel.offsetHeight, this.currentY));
            
            this.panel.style.left = `${this.currentX}px`;
            this.panel.style.top = `${this.currentY}px`;
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.panel.classList.remove('dragging');
            }
        });
        
        // Touch support for mobile
        header.addEventListener('touchstart', (e) => {
            if (e.target === toggleBtn) return;
            
            const touch = e.touches[0];
            this.isDragging = true;
            this.dragStartX = touch.clientX - this.currentX;
            this.dragStartY = touch.clientY - this.currentY;
            this.panel.classList.add('dragging');
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            this.currentX = touch.clientX - this.dragStartX;
            this.currentY = touch.clientY - this.dragStartY;
            
            // Keep panel on screen
            this.currentX = Math.max(0, Math.min(window.innerWidth - this.panel.offsetWidth, this.currentX));
            this.currentY = Math.max(0, Math.min(window.innerHeight - this.panel.offsetHeight, this.currentY));
            
            this.panel.style.left = `${this.currentX}px`;
            this.panel.style.top = `${this.currentY}px`;
        });
        
        document.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.panel.classList.remove('dragging');
            }
        });
    }

    updateStatus() {
        // Update FPS
        const fpsElement = document.getElementById('v5-fps');
        if (fpsElement && window.renderer && window.renderer.fps) {
            fpsElement.textContent = window.renderer.fps;
        }
        
        // Update particle count
        const particlesElement = document.getElementById('v5-particles');
        if (particlesElement && window.renderer && window.renderer.particles) {
            const count = window.renderer.particles.geometry.attributes.position.count;
            particlesElement.textContent = count.toLocaleString();
        }
        
        // Update worker count
        const workersElement = document.getElementById('v5-workers');
        if (workersElement && window.v5WorkerPool) {
            workersElement.textContent = window.v5WorkerPool.workers.length;
        }
        
        // Update GPU info
        const gpuElement = document.getElementById('v5-gpu');
        if (gpuElement && window.V5PerformanceFix && !gpuElement.dataset.updated) {
            const detector = new window.V5PerformanceFix.GPUDetector();
            const caps = detector.detect();
            gpuElement.textContent = caps.webgl2 ? 'WebGL2' : (caps.webgl1 ? 'WebGL1' : 'None');
            gpuElement.dataset.updated = 'true';
        }
        
        // Update modal state
        const modalElement = document.getElementById('v5-modal');
        if (modalElement && window.modalMechanics) {
            const state = window.modalMechanics.getCurrentModalState();
            modalElement.textContent = `□${state.necessity.toFixed(1)} ◊${state.possibility.toFixed(1)}`;
        }
        
        // Update coherence
        const coherenceElement = document.getElementById('v5-coherence');
        if (coherenceElement && window.nlpEngine) {
            const coherence = window.nlpEngine.calculateSystemCoherence ? 
                window.nlpEngine.calculateSystemCoherence() : 0.75;
            coherenceElement.textContent = coherence.toFixed(3);
        }
    }

    startUpdateLoop() {
        // Update status every 100ms
        setInterval(() => {
            if (!this.isCollapsed) {
                this.updateStatus();
            }
        }, 100);
    }

    show() {
        this.panel.style.display = 'block';
    }

    hide() {
        this.panel.style.display = 'none';
    }

    destroy() {
        if (this.panel) {
            this.panel.remove();
        }
    }
}

// Auto-initialize status panel
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.v5StatusPanel = new V5StatusPanel();
    });
} else {
    window.v5StatusPanel = new V5StatusPanel();
}

// Export for manual control
window.V5StatusPanel = V5StatusPanel;