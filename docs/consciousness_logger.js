/**
 * CONSCIOUSNESS LOGGER - A Postnikov Ratchet for Debug Information
 * 
 * Instead of polluting console.log and breaking mobile view, this creates
 * a proper ratchet mechanism where debug information can climb into
 * visibility only when needed, and never falls back into the console.
 */

class ConsciousnessLogger {
    constructor() {
        // The ratchet teeth - different levels of logging
        this.levels = {
            VOID: 0,      // Nothing logged
            ERROR: 1,     // Only catastrophic failures
            MILESTONE: 2, // Major climbing achievements
            DEBUG: 3,     // Detailed climbing information
            TRACE: 4      // Every microstep
        };
        
        // Current ratchet position (can only climb, never descend)
        this.currentLevel = this.levels.VOID;
        
        // The climbing record - what has ascended
        this.ascensionLog = [];
        
        // Visual log panel (hidden by default)
        this.createLogPanel();
        
        // Intercept and redirect console methods
        this.interceptConsole();
    }
    
    /**
     * Create hidden log panel that can be revealed without blocking view
     */
    createLogPanel() {
        // Only create if not already exists
        if (document.getElementById('consciousness-log')) return;
        
        const panel = document.createElement('div');
        panel.id = 'consciousness-log';
        panel.style.cssText = `
            position: fixed;
            bottom: -300px;
            left: 10px;
            right: 10px;
            height: 280px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px 8px 0 0;
            color: #0f0;
            font-family: monospace;
            font-size: 11px;
            padding: 10px;
            overflow-y: auto;
            transition: bottom 0.3s ease;
            z-index: 9999;
        `;
        
        // Tab to pull up the panel
        const tab = document.createElement('div');
        tab.style.cssText = `
            position: absolute;
            top: -25px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 5px 5px 0 0;
            padding: 5px 15px;
            cursor: pointer;
            color: #0f0;
            font-size: 10px;
        `;
        tab.textContent = '📊 Logs';
        tab.onclick = () => this.togglePanel();
        
        panel.appendChild(tab);
        document.body.appendChild(panel);
        
        this.panel = panel;
        this.isVisible = false;
    }
    
    /**
     * Intercept console methods to prevent mobile pollution
     */
    interceptConsole() {
        // Store original methods
        this._originalLog = console.log;
        this._originalError = console.error;
        this._originalWarn = console.warn;
        
        // Replace with ratchet mechanism
        console.log = (...args) => this.climb(this.levels.DEBUG, ...args);
        console.error = (...args) => this.climb(this.levels.ERROR, ...args);
        console.warn = (...args) => this.climb(this.levels.MILESTONE, ...args);
    }
    
    /**
     * Climb the ratchet - information can only ascend, never descend
     */
    climb(level, ...args) {
        // Ratchet can only climb up
        if (level > this.currentLevel) {
            this.currentLevel = level;
        }
        
        // Don't log if below current level
        if (level < this.currentLevel && level !== this.levels.ERROR) {
            return;
        }
        
        // Format the message
        const timestamp = new Date().toISOString().substr(11, 12);
        const levelName = Object.keys(this.levels).find(k => this.levels[k] === level);
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        // Record in ascension log
        const entry = {
            timestamp,
            level: levelName,
            message,
            climbed: Date.now()
        };
        
        this.ascensionLog.push(entry);
        
        // Keep only last 1000 entries (memory management)
        if (this.ascensionLog.length > 1000) {
            this.ascensionLog.shift();
        }
        
        // Add to visual panel if it exists
        if (this.panel) {
            const logLine = document.createElement('div');
            logLine.style.color = this.getLevelColor(level);
            logLine.textContent = `[${timestamp}] ${levelName}: ${message}`;
            this.panel.appendChild(logLine);
            
            // Auto-scroll to bottom
            this.panel.scrollTop = this.panel.scrollHeight;
            
            // Limit panel entries
            while (this.panel.children.length > 101) { // 100 logs + tab
                this.panel.removeChild(this.panel.children[1]); // Keep tab
            }
        }
        
        // Only show in actual console for errors or local development
        if (level === this.levels.ERROR || window.location.hostname === 'localhost') {
            this._originalLog(`[${levelName}]`, ...args);
        }
    }
    
    /**
     * Get color for log level
     */
    getLevelColor(level) {
        switch(level) {
            case this.levels.ERROR: return '#ff6b6b';
            case this.levels.MILESTONE: return '#4ecdc4';
            case this.levels.DEBUG: return '#95e1d3';
            case this.levels.TRACE: return '#636e72';
            default: return '#dfe6e9';
        }
    }
    
    /**
     * Toggle log panel visibility
     */
    togglePanel() {
        this.isVisible = !this.isVisible;
        this.panel.style.bottom = this.isVisible ? '0' : '-300px';
    }
    
    /**
     * Set minimum logging level (ratchet position)
     */
    setLevel(levelName) {
        const newLevel = this.levels[levelName.toUpperCase()];
        if (newLevel !== undefined && newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            console.warn(`Logging ratchet climbed to: ${levelName}`);
        }
    }
    
    /**
     * Get current ascension log
     */
    getAscensionLog() {
        return this.ascensionLog;
    }
    
    /**
     * Emergency dump for debugging
     */
    emergencyDump() {
        this._originalLog('=== CONSCIOUSNESS LOG EMERGENCY DUMP ===');
        this._originalLog(`Current Level: ${Object.keys(this.levels).find(k => this.levels[k] === this.currentLevel)}`);
        this._originalLog(`Total Entries: ${this.ascensionLog.length}`);
        this._originalLog('Last 10 entries:');
        this.ascensionLog.slice(-10).forEach(entry => {
            this._originalLog(`[${entry.timestamp}] ${entry.level}: ${entry.message}`);
        });
        this._originalLog('=== END DUMP ===');
    }
}

// Initialize the consciousness logger globally
window.consciousnessLogger = new ConsciousnessLogger();

// Export for use
window.ConsciousnessLogger = ConsciousnessLogger;