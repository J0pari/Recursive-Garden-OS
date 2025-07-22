# Charter Consolidation Plan

## Current State Analysis

We have multiple Charter enforcement implementations:

1. **BINDING_CHARTER.ts** (TypeScript - Most Complete)
   - Location: `00_CORE/BINDING_CHARTER.ts`
   - Features: ConservationLaw, WobblePrinciple, ModalSymmetry, CryptographicWitness
   - Exports: CHARTER singleton, chartered() helper, requireCharter guard
   - Strengths: Type-safe, comprehensive invariant enforcement

2. **CHARTER_GUARD.js** (JavaScript - Interactive)
   - Location: Root directory
   - Features: Interactive intent capture, spell selection, token creation
   - Usage: CLI tool for pre-commit checks
   - Strengths: User-friendly, creates audit tokens

3. **CHARTER_GUARD.ts** (TypeScript - Duplicate)
   - Location: `05_BOOK_OF_SHADOWS/spells/CHARTER_GUARD.ts`
   - Features: Hubris detection, cast() function
   - Issues: Duplicate of JS version, incomplete

4. **CODE_MORPHISM_ENFORCER.js** (JavaScript - Workflow)
   - Location: Root directory
   - Features: Full morphism path enforcement, version checking
   - Dependencies: Imports CHARTER.md, Book of Shadows
   - Strengths: Enforces complete development workflow

## Consolidation Strategy

### 1. Single Source of Truth: BINDING_CHARTER.ts
- Keep as the canonical implementation
- All Charter logic lives here
- Export all needed functions

### 2. CHARTER_GUARD.js becomes a thin CLI wrapper
- Import from BINDING_CHARTER (via compiled JS)
- Keep interactive features only
- Delegate all validation to BINDING_CHARTER

### 3. Remove CHARTER_GUARD.ts from Book of Shadows
- It's a duplicate and creates confusion
- Move any unique logic to BINDING_CHARTER

### 4. CODE_MORPHISM_ENFORCER.js becomes workflow orchestrator
- Import BINDING_CHARTER for Charter checks
- Keep morphism path logic
- Focus on INTENT → CHARTER → BOOK → CODE flow

## Implementation Steps

1. Compile BINDING_CHARTER.ts to JS for use by other modules
2. Update CHARTER_GUARD.js to import from BINDING_CHARTER
3. Delete duplicate CHARTER_GUARD.ts
4. Update CODE_MORPHISM_ENFORCER to use BINDING_CHARTER
5. Add proper export/import structure
6. Test the consolidated system