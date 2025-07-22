#!/usr/bin/env node
/**
 * CHARTER_GUARD - The spell that must be cast before ANY code change
 * 
 * This enforces our Alcubierre morphism:
 * INTENT → CHARTER → BOOK_OF_SHADOWS → CODE
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// CHARTER_GUARD: Implementing Charter protection
// BOOK_OF_SHADOWS: CHARTER_GUARD spell
// MORPHISM: INTENT(protect garden) → CHARTER(verify) → BOOK(spell) → CODE

class CharterGuard {
    constructor() {
        this.charterPath = path.join(__dirname, 'CHARTER.md');
        this.bookPath = path.join(__dirname, '05_BOOK_OF_SHADOWS/grimoire/Book_of_Shadows.txt');
        this.morphismPath = path.join(__dirname, 'CODE_MORPHISM_ENFORCER.js');
        
        // Load Charter invariants
        this.invariants = {
            WOBBLE: { min: 7, target: 9, max: 11, current: 9 },
            NO_TRUST: 'ONLY VERIFICATION',
            DRY: 'Code duplication is a WOUND',
            METAPHOR: 'ENRICH never REPLACE',
            EVOLUTION: 'Mitosis before brain'
        };
        
        // Track current intent
        this.currentIntent = null;
        this.selectedSpell = null;
    }
    
    async cast() {
        console.log(`
╔════════════════════════════════════════════════════════╗
║                  CHARTER_GUARD SPELL                    ║
║         Protecting the Garden from Violations           ║
╚════════════════════════════════════════════════════════╝
        `);
        
        // Step 1: Capture intent
        this.currentIntent = await this.captureIntent();
        
        // Step 2: Check Charter compliance
        const charterCheck = await this.checkCharter(this.currentIntent);
        if (!charterCheck.passes) {
            console.log(`\n❌ CHARTER VIOLATION DETECTED!`);
            console.log(`📜 Reason: ${charterCheck.reason}`);
            console.log(`\n🔄 Please revise your intent to comply with the Charter.`);
            process.exit(1);
        }
        
        // Step 3: Select appropriate spell from Book of Shadows
        this.selectedSpell = await this.selectSpell(this.currentIntent);
        
        // Step 4: Generate morphism path
        const morphism = this.generateMorphism();
        
        // Step 5: Create guard token
        this.createGuardToken(morphism);
        
        console.log(`\n✅ CHARTER_GUARD CAST SUCCESSFULLY!`);
        console.log(`🔮 Spell: ${this.selectedSpell}`);
        console.log(`📐 Morphism: ${morphism}`);
        console.log(`\n✨ You may now proceed with your code changes.`);
        console.log(`\n📝 Remember to add these comments to your code:`);
        console.log(`   // CHARTER_GUARD: ${this.currentIntent}`);
        console.log(`   // BOOK_OF_SHADOWS: ${this.selectedSpell}`);
        console.log(`   // MORPHISM: ${morphism}`);
    }
    
    async captureIntent() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('\n📝 What is your INTENT for this change?');
        console.log('(Be specific about what you want to accomplish)');
        
        const intent = await new Promise(resolve => {
            rl.question('Intent: ', answer => {
                rl.close();
                resolve(answer.trim());
            });
        });
        
        if (!intent) {
            console.log('❌ Intent cannot be empty!');
            process.exit(1);
        }
        
        return intent;
    }
    
    async checkCharter(intent) {
        const violations = [];
        
        // Check for hubris
        const hubrisWords = /transcendent|ultimate|perfect|genius|superior|best/i;
        if (hubrisWords.test(intent)) {
            violations.push('Hubris detected - avoid pompous language');
        }
        
        // Check for duplication intent
        if (intent.includes('create new') && intent.includes('version')) {
            violations.push('Creating new versions instead of improving - violates DRY');
        }
        
        // Check for replacement language
        if (intent.includes('replace') && !intent.includes('fix')) {
            violations.push('Replacing instead of enriching - violates METAPHOR invariant');
        }
        
        // Check wobble
        console.log(`\n🎯 Checking productive wobble...`);
        console.log(`   Current: ${this.invariants.WOBBLE.current}°`);
        console.log(`   Target: ${this.invariants.WOBBLE.target}° ± 2°`);
        
        return {
            passes: violations.length === 0,
            reason: violations.join('; ')
        };
    }
    
    async selectSpell(intent) {
        console.log(`\n📖 Consulting Book of Shadows...`);
        
        // Map intent keywords to spells
        const spellMap = {
            'fix': 'SARANETH (Binding/Fixing)',
            'simplify': 'RANNA (Simplification)',
            'organize': 'KIBETH (Smooth Transitions)',
            'protect': 'CHARTER_GUARD (Protection)',
            'transform': 'BELGAER (Transformation)',
            'analyze': 'DYRIM (Analysis)',
            'create': 'MOSRAEL (Creation - use carefully!)'
        };
        
        // Find matching spell
        let selectedSpell = 'CHARTER_GUARD'; // Default
        for (const [keyword, spell] of Object.entries(spellMap)) {
            if (intent.toLowerCase().includes(keyword)) {
                selectedSpell = spell;
                break;
            }
        }
        
        return selectedSpell;
    }
    
    generateMorphism() {
        return `INTENT(${this.currentIntent.substring(0, 20)}...) → CHARTER(verified) → BOOK(${this.selectedSpell}) → CODE`;
    }
    
    createGuardToken(morphism) {
        // Create a token file that proves Charter Guard was cast
        const tokenDir = process.platform === 'win32' ? 'C:\\temp' : '/tmp';
        
        // Create temp dir if it doesn't exist
        if (!fs.existsSync(tokenDir)) {
            fs.mkdirSync(tokenDir, { recursive: true });
        }
        
        const tokenPath = path.join(tokenDir, `charter_guard_cast_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`);
        const tokenContent = {
            timestamp: new Date().toISOString(),
            intent: this.currentIntent,
            spell: this.selectedSpell,
            morphism: morphism,
            wobble: this.invariants.WOBBLE.current
        };
        
        fs.writeFileSync(tokenPath, JSON.stringify(tokenContent, null, 2));
    }
}

// Auto-cast when run directly
if (require.main === module) {
    const guard = new CharterGuard();
    
    // Check for non-interactive mode
    const args = process.argv.slice(2);
    if (args.length > 0 && args[0] === '--intent') {
        // Non-interactive mode for automation
        guard.currentIntent = args.slice(1).join(' ');
        guard.checkCharter(guard.currentIntent).then(check => {
            if (check.passes) {
                guard.selectedSpell = 'SARANETH (Binding/Fixing)';
                const morphism = guard.generateMorphism();
                guard.createGuardToken(morphism);
                console.log('✅ CHARTER_GUARD cast successfully in non-interactive mode');
                process.exit(0);
            } else {
                console.log('❌ Charter violation:', check.reason);
                process.exit(1);
            }
        });
    } else {
        // Interactive mode
        guard.cast().catch(console.error);
    }
}

module.exports = CharterGuard;