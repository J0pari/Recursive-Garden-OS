/**
 * DEBUG SYSTEM - Only accessible via ctrl+shift+J console
 * NO VISUAL ELEMENTS! NO BLOCKING! PURE SILENCE!
 */

(function() {
    // Debug buffer to capture all console output
    window._debugBuffer = [];
    window._evolutionHistory = [];
    
    // Store original console methods
    const _console = {
        log: console.log.bind(console),
        error: console.error.bind(console),
        warn: console.warn.bind(console),
        info: console.info.bind(console),
        debug: console.debug.bind(console)
    };
    
    // Capture function
    const capture = (type, args) => {
        const entry = {
            type,
            args: Array.from(args).map(arg => {
                try {
                    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                } catch (e) {
                    return '[Unserializable Object]';
                }
            }),
            timestamp: Date.now(),
            stack: new Error().stack.split('\n').slice(3, 5).join('\n')
        };
        
        window._debugBuffer.push(entry);
        
        // Keep only last 500 entries
        if (window._debugBuffer.length > 500) {
            window._debugBuffer.shift();
        }
    };
    
    // Override all console methods with silent capture
    console.log = function() { capture('log', arguments); };
    console.error = function() { capture('error', arguments); };
    console.warn = function() { capture('warn', arguments); };
    console.info = function() { capture('info', arguments); };
    console.debug = function() { capture('debug', arguments); };
    
    // Debug commands ONLY accessible via developer console
    window.debug = {
        // Show recent logs
        show: function(count = 50) {
            _console.log('%c=== DEBUG BUFFER (Last ' + count + ' entries) ===', 'color: #4ecdc4; font-weight: bold');
            const entries = window._debugBuffer.slice(-count);
            entries.forEach(entry => {
                const time = new Date(entry.timestamp).toTimeString().split(' ')[0];
                const color = {
                    log: '#95e1d3',
                    error: '#ff6b6b',
                    warn: '#ffd93d',
                    info: '#74b9ff',
                    debug: '#636e72'
                }[entry.type];
                
                _console.log(`%c[${time}] ${entry.type.toUpperCase()}:`, `color: ${color}`, ...entry.args);
            });
            _console.log('%c=== END DEBUG ===', 'color: #4ecdc4; font-weight: bold');
            return 'Displayed ' + entries.length + ' entries';
        },
        
        // Show evolution history
        evolution: function() {
            _console.log('%c=== EVOLUTION HISTORY ===', 'color: #f368e0; font-weight: bold');
            _console.log(window._evolutionHistory);
            return 'Evolution history displayed';
        },
        
        // Clear buffer
        clear: function() {
            window._debugBuffer = [];
            window._evolutionHistory = [];
            return 'Debug buffer cleared';
        },
        
        // Export as JSON
        export: function() {
            const data = {
                debugBuffer: window._debugBuffer,
                evolutionHistory: window._evolutionHistory,
                timestamp: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `debug_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            return 'Debug data exported';
        },
        
        // Search logs
        search: function(pattern) {
            const regex = new RegExp(pattern, 'i');
            const matches = window._debugBuffer.filter(entry => 
                entry.args.some(arg => regex.test(arg))
            );
            _console.log(`%cFound ${matches.length} matches for "${pattern}"`, 'color: #00d2d3');
            matches.forEach(entry => {
                const time = new Date(entry.timestamp).toTimeString().split(' ')[0];
                _console.log(`[${time}] ${entry.type}:`, ...entry.args);
            });
            return matches.length + ' matches found';
        },
        
        // Get help
        help: function() {
            _console.log('%c=== DEBUG SYSTEM HELP ===', 'color: #48dbfb; font-weight: bold');
            _console.log('%cdebug.show(count)', 'color: #0abde3', '- Show last N debug entries (default: 50)');
            _console.log('%cdebug.evolution()', 'color: #0abde3', '- Show evolution history');
            _console.log('%cdebug.clear()', 'color: #0abde3', '- Clear all debug data');
            _console.log('%cdebug.export()', 'color: #0abde3', '- Export debug data as JSON');
            _console.log('%cdebug.search(pattern)', 'color: #0abde3', '- Search debug logs');
            _console.log('%cdebug.help()', 'color: #0abde3', '- Show this help');
            return 'Help displayed';
        }
    };
    
    // Helpful message ONLY visible in console
    if (window.location.hostname === 'localhost') {
        _console.log('%cDebug system loaded. Type debug.help() for commands.', 'color: #00d2d3');
    }
})();