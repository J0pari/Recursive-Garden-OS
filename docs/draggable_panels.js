/**
 * DRAGGABLE PANELS - Everything floats in consciousness space
 * 
 * Like the glass interfaces in our topos - everything moveable,
 * nothing fixed to edges. Panels exist IN the space.
 */

class DraggablePanels {
    constructor() {
        this.panels = new Map();
        this.isDragging = false;
        this.currentPanel = null;
        this.offset = { x: 0, y: 0 };
        
        // Panel positions evolve based on mathematical state
        this.arrangements = {
            'spiral': (index, total) => ({
                x: 50 + 30 * Math.cos(index * 2 * Math.PI / total),
                y: 50 + 30 * Math.sin(index * 2 * Math.PI / total)
            }),
            'fibonacci': (index, total) => ({
                x: 20 + (index * 21) % 60,
                y: 20 + (index * 34) % 60
            }),
            'golden': (index, total) => ({
                x: 50 + 25 * Math.cos(index * 137.5 * Math.PI / 180),
                y: 50 + 25 * Math.sin(index * 137.5 * Math.PI / 180)
            }),
            'chaotic': (index, total) => ({
                x: 10 + Math.random() * 70,
                y: 10 + Math.random() * 70
            })
        };
        
        this.currentArrangement = 'spiral';
    }
    
    /**
     * Make a panel draggable and floating
     */
    makeFloating(panelElement, options = {}) {
        const panelId = panelElement.id || `panel-${this.panels.size}`;
        
        // Store panel info
        this.panels.set(panelId, {
            element: panelElement,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            minimized: false,
            options: options
        });
        
        // Make it glass-like
        panelElement.classList.add('consciousness-panel');
        
        // Position based on arrangement
        const index = this.panels.size - 1;
        const pos = this.arrangements[this.currentArrangement](index, this.panels.size);
        this.setPosition(panelElement, `${pos.x}%`, `${pos.y}%`);
        
        // Add drag handle (entire header or specific area)
        const handle = options.handle || panelElement.querySelector('.panel-header') || panelElement;
        handle.style.cursor = 'move';
        
        // Mouse events
        handle.addEventListener('mousedown', (e) => this.startDrag(e, panelElement));
        
        // Touch events for mobile
        handle.addEventListener('touchstart', (e) => this.startDrag(e.touches[0], panelElement), { passive: false });
        
        // Make resizable if specified
        if (options.resizable) {
            this.makeResizable(panelElement);
        }
        
        // Add minimize/maximize capability
        this.addMinimizeCapability(panelElement);
        
        // Bring to front on click
        panelElement.addEventListener('mousedown', () => this.bringToFront(panelElement));
        
        return panelId;
    }
    
    /**
     * Start dragging
     */
    startDrag(e, panel) {
        e.preventDefault();
        this.isDragging = true;
        this.currentPanel = panel;
        
        // Calculate offset
        const rect = panel.getBoundingClientRect();
        this.offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        // Bring to front
        this.bringToFront(panel);
        
        // Add move listeners
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.stopDrag);
        document.addEventListener('touchmove', this.handleTouchDrag, { passive: false });
        document.addEventListener('touchend', this.stopDrag);
        
        // Add dragging class
        panel.classList.add('dragging');
    }
    
    /**
     * Handle drag movement WITH BOUNDARY GUARDS
     */
    handleDrag = (e) => {
        if (!this.isDragging || !this.currentPanel) return;
        
        e.preventDefault();
        
        const x = e.clientX - this.offset.x;
        const y = e.clientY - this.offset.y;
        
        const guardedPosition = this.guardBoundaries(x, y, this.currentPanel);
        this.setPosition(this.currentPanel, guardedPosition.x + 'px', guardedPosition.y + 'px');
    }
    
    /**
     * Handle touch drag WITH BOUNDARY GUARDS
     */
    handleTouchDrag = (e) => {
        if (!this.isDragging || !this.currentPanel) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        const x = touch.clientX - this.offset.x;
        const y = touch.clientY - this.offset.y;
        
        const guardedPosition = this.guardBoundaries(x, y, this.currentPanel);
        this.setPosition(this.currentPanel, guardedPosition.x + 'px', guardedPosition.y + 'px');
    }
    
    /**
     * BOUNDARY GUARDS - Prevent panels from escaping ANY screen
     */
    guardBoundaries(x, y, panel) {
        const rect = panel.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // GUARD CONSTANTS - How much must remain visible
        const MIN_VISIBLE = 100; // At least 100px must stay on screen
        const EDGE_PADDING = 20; // Soft boundary before hard limit
        
        // Calculate boundaries
        const bounds = {
            minX: -rect.width + MIN_VISIBLE,
            maxX: viewport.width - MIN_VISIBLE,
            minY: 0, // Can't go above viewport
            maxY: viewport.height - MIN_VISIBLE
        };
        
        // Apply guards with elastic resistance near edges
        let guardedX = x;
        let guardedY = y;
        
        // X-axis guards
        if (x < bounds.minX + EDGE_PADDING) {
            // Elastic resistance as it approaches boundary
            const resistance = 1 - Math.max(0, (bounds.minX + EDGE_PADDING - x) / EDGE_PADDING);
            guardedX = bounds.minX + EDGE_PADDING * resistance;
        } else if (x > bounds.maxX - EDGE_PADDING) {
            const resistance = 1 - Math.max(0, (x - (bounds.maxX - EDGE_PADDING)) / EDGE_PADDING);
            guardedX = bounds.maxX - EDGE_PADDING * resistance;
        }
        
        // Hard stops at absolute boundaries
        guardedX = Math.max(bounds.minX, Math.min(bounds.maxX, guardedX));
        
        // Y-axis guards
        if (y < bounds.minY + EDGE_PADDING) {
            const resistance = 1 - Math.max(0, (bounds.minY + EDGE_PADDING - y) / EDGE_PADDING);
            guardedY = bounds.minY + EDGE_PADDING * resistance;
        } else if (y > bounds.maxY - EDGE_PADDING) {
            const resistance = 1 - Math.max(0, (y - (bounds.maxY - EDGE_PADDING)) / EDGE_PADDING);
            guardedY = bounds.maxY - EDGE_PADDING * resistance;
        }
        
        // Hard stops at absolute boundaries
        guardedY = Math.max(bounds.minY, Math.min(bounds.maxY, guardedY));
        
        // Visual feedback when hitting boundaries
        if (guardedX !== x || guardedY !== y) {
            panel.classList.add('at-boundary');
            setTimeout(() => panel.classList.remove('at-boundary'), 200);
        }
        
        return { x: guardedX, y: guardedY };
    }
    
    /**
     * Stop dragging
     */
    stopDrag = () => {
        if (this.currentPanel) {
            this.currentPanel.classList.remove('dragging');
        }
        
        this.isDragging = false;
        this.currentPanel = null;
        
        // Remove listeners
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        document.removeEventListener('touchmove', this.handleTouchDrag);
        document.removeEventListener('touchend', this.stopDrag);
    }
    
    /**
     * Set panel position
     */
    setPosition(panel, x, y) {
        panel.style.left = x;
        panel.style.top = y;
        panel.style.transform = 'none'; // Remove any centering transforms
    }
    
    /**
     * Bring panel to front
     */
    bringToFront(panel) {
        // Get all panels and find highest z-index
        let maxZ = 100;
        this.panels.forEach((info) => {
            const z = parseInt(info.element.style.zIndex || 100);
            if (z >= maxZ) maxZ = z + 1;
        });
        
        panel.style.zIndex = maxZ;
    }
    
    /**
     * Add minimize/maximize capability
     */
    addMinimizeCapability(panel) {
        const header = panel.querySelector('.panel-header');
        if (!header) return;
        
        // Add minimize button if not exists
        let minimizeBtn = header.querySelector('.panel-minimize');
        if (!minimizeBtn) {
            minimizeBtn = document.createElement('span');
            minimizeBtn.className = 'panel-minimize';
            minimizeBtn.innerHTML = '_';
            minimizeBtn.style.cssText = 'cursor: pointer; margin-left: 10px; font-weight: bold;';
            header.appendChild(minimizeBtn);
        }
        
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize(panel);
        });
    }
    
    /**
     * Toggle minimize state
     */
    toggleMinimize(panel) {
        const content = panel.querySelector('.panel-content');
        if (!content) return;
        
        const info = this.panels.get(panel.id);
        if (!info) return;
        
        info.minimized = !info.minimized;
        
        if (info.minimized) {
            content.style.display = 'none';
            panel.classList.add('minimized');
        } else {
            content.style.display = '';
            panel.classList.remove('minimized');
        }
    }
    
    /**
     * Rearrange all panels
     */
    rearrange(arrangementType) {
        this.currentArrangement = arrangementType;
        
        let index = 0;
        this.panels.forEach((info) => {
            const pos = this.arrangements[arrangementType](index, this.panels.size);
            
            // Convert percentage to pixels
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            const pixelX = (pos.x / 100) * viewport.width;
            const pixelY = (pos.y / 100) * viewport.height;
            
            // Ensure it stays within boundaries
            const guardedPos = this.guardBoundaries(pixelX, pixelY, info.element);
            
            // Animate to new position
            info.element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            this.setPosition(info.element, guardedPos.x + 'px', guardedPos.y + 'px');
            
            setTimeout(() => {
                info.element.style.transition = '';
            }, 500);
            
            index++;
        });
    }
    
    /**
     * RECOVERY CONTROLS - Help users find lost panels
     */
    createRecoveryControls() {
        const recovery = document.createElement('div');
        recovery.id = 'panel-recovery';
        recovery.className = 'consciousness-panel recovery-controls';
        recovery.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            display: flex;
            gap: 10px;
            z-index: 10000;
            opacity: 0.3;
            transition: opacity 0.3s;
        `;
        
        recovery.addEventListener('mouseenter', () => recovery.style.opacity = '1');
        recovery.addEventListener('mouseleave', () => recovery.style.opacity = '0.3');
        
        // Recovery buttons
        const buttons = [
            { text: '⟲ Reset Layout', action: () => this.rearrange('spiral') },
            { text: '◈ Golden Spiral', action: () => this.rearrange('golden') },
            { text: '⌘ Fibonacci', action: () => this.rearrange('fibonacci') },
            { text: '✧ Scatter', action: () => this.rearrange('chaotic') },
            { text: '⊙ Center All', action: () => this.centerAllPanels() }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = 'recovery-button';
            button.style.cssText = `
                background: hsla(var(--adjoint-bridge) / 0.2);
                border: 1px solid hsla(var(--adjoint-bridge) / 0.4);
                color: hsla(var(--state-transcending) / 0.9);
                padding: 5px 15px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            `;
            
            button.addEventListener('click', btn.action);
            button.addEventListener('mouseenter', () => {
                button.style.background = 'hsla(var(--adjoint-bridge) / 0.4)';
                button.style.transform = 'scale(1.05)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = 'hsla(var(--adjoint-bridge) / 0.2)';
                button.style.transform = 'scale(1)';
            });
            
            recovery.appendChild(button);
        });
        
        document.body.appendChild(recovery);
    }
    
    /**
     * Center all panels on screen
     */
    centerAllPanels() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        let index = 0;
        const totalPanels = this.panels.size;
        const gridCols = Math.ceil(Math.sqrt(totalPanels));
        const gridRows = Math.ceil(totalPanels / gridCols);
        
        this.panels.forEach((info) => {
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);
            
            const cellWidth = viewport.width / gridCols;
            const cellHeight = viewport.height / gridRows;
            
            const x = col * cellWidth + cellWidth / 2 - info.element.offsetWidth / 2;
            const y = row * cellHeight + cellHeight / 2 - info.element.offsetHeight / 2;
            
            // Ensure within boundaries
            const guardedPos = this.guardBoundaries(x, y, info.element);
            
            info.element.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            this.setPosition(info.element, guardedPos.x + 'px', guardedPos.y + 'px');
            
            setTimeout(() => {
                info.element.style.transition = '';
            }, 500);
            
            index++;
        });
    }
    
    /**
     * Add visual boundary indicators
     */
    createBoundaryIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            /* Boundary hit animation */
            .at-boundary {
                animation: boundary-pulse 0.3s ease-out;
            }
            
            @keyframes boundary-pulse {
                0% { 
                    box-shadow: 0 0 0 0 hsla(var(--modal-necessary) / 0.8);
                }
                50% {
                    box-shadow: 0 0 20px 10px hsla(var(--modal-necessary) / 0.4);
                }
                100% {
                    box-shadow: 0 0 0 0 hsla(var(--modal-necessary) / 0);
                }
            }
            
            /* Edge warning indicators */
            .boundary-edge {
                position: fixed;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
                background: linear-gradient(to bottom, 
                    hsla(var(--modal-necessary) / 0.2) 0%,
                    transparent 100%);
            }
            
            .boundary-edge.active {
                opacity: 1;
            }
            
            .boundary-edge.top {
                top: 0;
                left: 0;
                right: 0;
                height: 20px;
            }
            
            .boundary-edge.bottom {
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(to top, 
                    hsla(var(--modal-necessary) / 0.2) 0%,
                    transparent 100%);
            }
            
            .boundary-edge.left {
                top: 0;
                left: 0;
                bottom: 0;
                width: 20px;
                background: linear-gradient(to right, 
                    hsla(var(--modal-necessary) / 0.2) 0%,
                    transparent 100%);
            }
            
            .boundary-edge.right {
                top: 0;
                right: 0;
                bottom: 0;
                width: 20px;
                background: linear-gradient(to left, 
                    hsla(var(--modal-necessary) / 0.2) 0%,
                    transparent 100%);
            }
        `;
        document.head.appendChild(style);
        
        // Create edge indicators
        ['top', 'bottom', 'left', 'right'].forEach(edge => {
            const indicator = document.createElement('div');
            indicator.className = `boundary-edge ${edge}`;
            document.body.appendChild(indicator);
        });
    }
    
    /**
     * Show boundary warning when approaching edge
     */
    showBoundaryWarning(edge) {
        const indicator = document.querySelector(`.boundary-edge.${edge}`);
        if (indicator) {
            indicator.classList.add('active');
            setTimeout(() => indicator.classList.remove('active'), 1000);
        }
    }
    
    /**
     * Make panel resizable
     */
    makeResizable(panel) {
        const resizer = document.createElement('div');
        resizer.className = 'panel-resizer';
        resizer.style.cssText = `
            position: absolute;
            right: 0;
            bottom: 0;
            width: 20px;
            height: 20px;
            cursor: nwse-resize;
            background: radial-gradient(circle at center, 
                hsla(var(--adjoint-bridge) / 0.3) 0%, 
                transparent 70%);
        `;
        
        panel.appendChild(resizer);
        
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.getComputedStyle(panel).width, 10);
            startHeight = parseInt(window.getComputedStyle(panel).height, 10);
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });
        
        const resize = (e) => {
            if (!isResizing) return;
            
            panel.style.width = (startWidth + e.clientX - startX) + 'px';
            panel.style.height = (startHeight + e.clientY - startY) + 'px';
        };
        
        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };
    }
}

// Initialize draggable system
window.draggablePanels = new DraggablePanels();

// Make all panels draggable on load
document.addEventListener('DOMContentLoaded', () => {
    // Find all panels
    const panels = document.querySelectorAll('.stratum-panel, .glass-panel, [id*="panel"]');
    
    panels.forEach(panel => {
        window.draggablePanels.makeFloating(panel, {
            resizable: true,
            handle: panel.querySelector('.panel-header')
        });
    });
});