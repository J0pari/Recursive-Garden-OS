/**
 * PORTAL MORPHISMS - Fix broken connections in the online topos
 * 
 * This ensures ALL demos in the docs folder (the ACTUAL ONLINE TOPOS)
 * have proper morphisms and no local-only hallucinations.
 */

// Check if we're running in the actual deployed environment
const isDeployed = window.location.hostname !== 'localhost' && 
                   window.location.hostname !== '127.0.0.1' &&
                   !window.location.hostname.includes('192.168');

// Fix console.log pollution in all demos
if (isDeployed) {
    // Store original console.log for debugging
    window._originalConsoleLog = console.log;
    
    // Override console.log to prevent mobile pollution
    console.log = function(...args) {
        // Only allow critical errors and portal morphism messages
        const message = args.join(' ');
        if (message.includes('ERROR') || 
            message.includes('Portal Morphism') ||
            message.includes('🌐')) {
            window._originalConsoleLog.apply(console, args);
        }
    };
}

// Ensure all links work properly in the deployed environment
function fixPortalLinks() {
    // Get all anchor tags
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip external links
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return;
        }
        
        // Fix relative paths that might break in deployment
        if (href.includes('../') && isDeployed) {
            console.log(`🌐 Portal Morphism: Fixing relative path ${href}`);
            // Remove ../ references for GitHub Pages
            const fixedHref = href.replace(/\.\.\//g, '');
            link.setAttribute('href', fixedHref);
        }
    });
}

// Ensure all scripts load from correct paths
function fixScriptPaths() {
    // Check for missing scripts and report
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        
        // Add error handler for failed script loads
        script.onerror = function() {
            console.log(`🌐 Portal Morphism ERROR: Failed to load ${src}`);
            
            // Try alternative paths
            if (src.includes('../04_EXPERIMENTS/')) {
                // Try without the ../
                const altSrc = src.replace('../', '');
                console.log(`🌐 Portal Morphism: Trying alternative path ${altSrc}`);
                
                const altScript = document.createElement('script');
                altScript.src = altSrc;
                document.body.appendChild(altScript);
            }
        };
    });
}

// Fix V6's "transcendent" violation
function fixCharterViolations() {
    // Remove any "transcendent" text/classes
    const transcendentElements = document.querySelectorAll('.transcendent, [class*="transcendent"]');
    transcendentElements.forEach(el => {
        console.log('🌐 Portal Morphism: Removing Charter violation (transcendent)');
        el.classList.remove('transcendent');
        
        // Also check text content
        if (el.textContent.toLowerCase().includes('transcendent')) {
            el.textContent = el.textContent.replace(/transcendent/gi, 'topological');
        }
    });
    
    // Fix onclick handlers that might have transcendent references
    const buttons = document.querySelectorAll('button[onclick*="transcendent"]');
    buttons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const fixed = onclick.replace(/transcendent/gi, 'topological');
        btn.setAttribute('onclick', fixed);
    });
}

// Ensure demos marked as "broken" show helpful message
function fixBrokenDemos() {
    // Check if this is V6 (marked as broken)
    if (window.location.pathname.includes('keats_v6.html')) {
        // Add a notice about V6 being experimental
        const notice = document.createElement('div');
        notice.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
        `;
        notice.innerHTML = `
            <strong>⚠️ V6 is Experimental</strong><br>
            <small>This version explores advanced topological features. 
            <a href="keats_v5.html" style="color: white; text-decoration: underline;">
                Use V5 for stable experience
            </a></small>
        `;
        document.body.appendChild(notice);
    }
}

// Apply all morphism fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fixPortalLinks();
        fixScriptPaths();
        fixCharterViolations();
        fixBrokenDemos();
    });
} else {
    // DOM already loaded
    fixPortalLinks();
    fixScriptPaths();
    fixCharterViolations();
    fixBrokenDemos();
}

// Export for use by other scripts
window.PortalMorphisms = {
    isDeployed,
    fixPortalLinks,
    fixScriptPaths,
    fixCharterViolations,
    fixBrokenDemos
};