/**
 * VERSION ENFORCER - Makes version duplication IMPOSSIBLE
 * 
 * IMPROVING ISN'T CLONING!
 * When you go to the hospital, they don't shoot you and grow a new you!
 */

const fs = require('fs');
const path = require('path');

class VersionEnforcer {
    constructor() {
        this.versionMap = new Map();
        this.forbiddenPatterns = [
            /_fixed\./,
            /_better\./,
            /_improved\./,
            /_new\./,
            /_transcendent\./,
            /_ultimate\./,
            /_v\d+\./,  // no v5_v2 nonsense
            /Copy of/,
            /\(\d+\)/   // no file (1).html patterns
        ];
    }
    
    /**
     * Scan for existing versions
     */
    scanVersions() {
        const scanDirs = [
            './docs',
            './04_EXPERIMENTS/keats_evolution'
        ];
        
        scanDirs.forEach(dir => {
            if (!fs.existsSync(dir)) return;
            
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const match = file.match(/keats_v(\d+)\.html/);
                if (match) {
                    const version = match[1];
                    const fullPath = path.join(dir, file);
                    
                    if (this.versionMap.has(version)) {
                        console.error(`❌ DUPLICATE VERSION DETECTED!`);
                        console.error(`Version ${version} exists in:`);
                        console.error(`  - ${this.versionMap.get(version)}`);
                        console.error(`  - ${fullPath}`);
                        console.error(`THERE CAN BE ONLY ONE!`);
                        process.exit(1);
                    }
                    
                    this.versionMap.set(version, fullPath);
                }
            });
        });
    }
    
    /**
     * Check if a filename violates version rules
     */
    checkFilename(filename) {
        // Check forbidden patterns
        for (const pattern of this.forbiddenPatterns) {
            if (pattern.test(filename)) {
                throw new Error(`
❌ FORBIDDEN FILENAME: ${filename}
❌ Matches pattern: ${pattern}

IMPROVING ISN'T CLONING!
Fix the original file instead of creating duplicates!
                `);
            }
        }
        
        // Check for version duplication
        const versionMatch = filename.match(/keats_v(\d+)\.html/);
        if (versionMatch) {
            const version = versionMatch[1];
            if (this.versionMap.has(version)) {
                throw new Error(`
❌ VERSION ${version} ALREADY EXISTS!
❌ Location: ${this.versionMap.get(version)}

There can be ONLY ONE V${version}!
Merge your changes into the existing file!
                `);
            }
        }
        
        return true;
    }
    
    /**
     * Enforce version uniqueness for a file operation
     */
    enforceOperation(operation, filename) {
        console.log(`🔍 Version Enforcer: Checking ${operation} on ${filename}`);
        
        try {
            this.checkFilename(filename);
            console.log(`✅ Version check passed for ${filename}`);
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
    
    /**
     * Get the canonical location for a version
     */
    getCanonicalPath(version) {
        // V1-V6 should always be in docs/ for deployment
        return `./docs/keats_v${version}.html`;
    }
    
    /**
     * Merge helper - tells you where to put changes
     */
    getMergeTarget(filename) {
        const versionMatch = filename.match(/v(\d+)/);
        if (versionMatch) {
            const version = versionMatch[1];
            return this.getCanonicalPath(version);
        }
        return null;
    }
}

// Create global enforcer
const enforcer = new VersionEnforcer();
enforcer.scanVersions();

// Export for use
module.exports = VersionEnforcer;

// If run directly, scan and report
if (require.main === module) {
    console.log('\n📊 VERSION INVENTORY:');
    enforcer.versionMap.forEach((path, version) => {
        console.log(`  V${version}: ${path}`);
    });
    
    console.log('\n✅ Version enforcement active!');
    console.log('❌ Forbidden patterns:', enforcer.forbiddenPatterns.map(p => p.toString()).join(', '));
}