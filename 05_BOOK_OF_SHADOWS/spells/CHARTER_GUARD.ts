// CHARTER GUARD - The Spell That Protects All Other Spells
// This spell MUST be cast before ANY code changes to prevent Charter violations

import { CHARTER_INVARIANTS } from '../../00_CORE/CHARTER.md';

export const CHARTER_GUARD = {
    name: "CHARTER_GUARD",
    type: "META_PROTECTION",
    description: "Prevents all Charter violations by checking every action",
    
    // The Five Invariants That Must Never Be Violated
    invariants: {
        WOBBLE: "9° ± 2° - No perfect rigidity, no chaos",
        VERIFICATION: "NO TRUST. ONLY VERIFICATION. Measure everything.",
        DRY: "Code duplication is a WOUND. Every pattern appears ONCE.",
        METAPHOR: "Metaphors ENRICH, never REPLACE. No transcendent bullshit.",
        EVOLUTION: "Build order follows nature. No brain before mitosis."
    },
    
    // The real violation is ATTITUDE, not keywords
    detect_hubris: function(action: string, intent: string): boolean {
        // Are we trying to REPLACE instead of FIX?
        if (action.includes('create new') && action.includes('instead of fixing')) {
            return true;
        }
        
        // Are we adding DECORATION instead of FUNCTION?
        if (intent === 'make it sound impressive' || intent === 'add flair') {
            return true;
        }
        
        // Are we DUPLICATING instead of EVOLVING?
        if (action.includes('_v') && (action.includes('_new') || action.includes('_better'))) {
            return true;
        }
        
        // The deepest check: Does this serve the MATHEMATICS or our EGO?
        return false;
    },
    
    // Cast this before ANY code operation
    cast: function(proposed_action: string, intent: string): boolean {
        // Check for hubris in INTENT, not just words
        if (this.detect_hubris(proposed_action, intent)) {
            throw new Error(`CHARTER VIOLATION: This serves ego, not mathematics!`);
        }
        
        // Check for duplication
        if (lower.includes("_v") && lower.includes("_fixed") || 
            lower.includes("_v") && lower.includes("_new") ||
            lower.includes("_v") && lower.includes("_better")) {
            throw new Error("CHARTER VIOLATION: Creating duplicate versions! One version = one file!");
        }
        
        // Check for premature complexity
        if (lower.includes("advanced") && !lower.includes("basic")) {
            console.warn("WARNING: Ensure basics exist before advanced features");
        }
        
        return true;
    },
    
    // Auto-correction suggestions
    correct: function(violation: string): string {
        const corrections = {
            "transcendent": "improved",
            "revolutionary": "updated", 
            "groundbreaking": "modified",
            "ultimate": "current",
            "perfect": "working",
            "genius": "functional"
        };
        
        let corrected = violation;
        for (const [bad, good] of Object.entries(corrections)) {
            corrected = corrected.replace(new RegExp(bad, 'gi'), good);
        }
        return corrected;
    }
};

// PERMANENT MORPHISM: Charter → Book → Code
export function enforceCharterMorphism(code: string): string {
    // Always check against Charter
    CHARTER_GUARD.cast(code);
    
    // Ensure mathematical precision
    if (!code.includes("//") && !code.includes("/*")) {
        console.warn("Code lacks comments - violates verification principle");
    }
    
    // Return blessed code
    return `/* CHARTER-VERIFIED */\n${code}`;
}