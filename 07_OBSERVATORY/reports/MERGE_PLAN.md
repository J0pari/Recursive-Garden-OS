# MERGE PLAN - Reducing File Count While Preserving Semantics

## UNTOUCHABLE CORE (Never merge these)
- The_Recursive_Garden.md
- Book_of_Shadows.txt
- 00_CHARTER.md
- EVOLUTIONARY_LADDER_INSIGHT.md (our latest revelation)

## SAFE MERGES (DRY violations and related content)

### 1. CONSCIOUSNESS ENGINE FILES → Single comprehensive doc
**Merge these:**
- CONSCIOUSNESS_ENGINE_120_CHUNKS.md ✓ (main content)
- CONSCIOUSNESS_ENGINE_ARCHITECTURE.js (can be section)
- CONSCIOUSNESS_ENGINE_FINAL_ARCHITECTURE.md (redundant with 120_CHUNKS)
- CONSCIOUSNESS_ENGINE_GLUING_SHEAFIFICATION.md (can be section)
- CHUNK_CONFORMATIONAL_STATES.md (can be section)

**Into:** `CONSCIOUSNESS_ENGINE_COMPLETE.md`

### 2. GLUING REQUIREMENTS → Single doc
**Merge these:**
- GLUING_REQUIREMENTS_DETAILED_1.md
- GLUING_REQUIREMENTS_DETAILED_2.md  
- GLUING_REQUIREMENTS_DETAILED_3.md
- MATHEMATICAL_COHERENCE_REQUIREMENTS.md (related)

**Into:** `MATHEMATICAL_GLUING_COMPLETE.md`

### 3. WIZARD OS ARCHITECTURE → Single doc
**Merge these:**
- WIZARD_OS_ARCHITECTURE.md
- WIZARD_OS_ARCHITECTURE_REAL.md (redundant)
- LIVING_ARCHITECTURE.md (can be section)

**Into:** `WIZARD_OS_ARCHITECTURE_UNIFIED.md`

### 4. RATCHET MECHANICS → Already well organized
**Keep separate** (each has distinct purpose):
- POSTNIKOV_RATCHET_OS_REVELATION.md
- ATP_SYNTHASE_RATCHET_INTEGRATION.md
- RATCHET_MECHANICS_SPECIFICATION.md
- MAGIC_SYSTEMS_AS_RATCHET_TEETH.md

### 5. KEATS VERSIONS → Archive old, keep current
**Action:**
- Keep keats_v16.html (current)
- Archive others in `archive/keats_legacy/`
- Keep master_union.html (useful reference)

### 6. TOPOS/OBJECT → Merge related
**Merge these:**
- TOPOS_FOUNDATION.md (keep as primary)
- TOPOS_KERNEL.md (merge as section)
- OBJECT_TEMPLATE.md (merge as section)

**Into:** `TOPOS_FOUNDATION_COMPLETE.md`

### 7. PHASE/ROADMAP docs → Merge operational
**Merge these:**
- CALIBRATED_ROADMAP.md (primary)
- IMMEDIATE_ACTION_CHECKLIST.md (as appendix)
- PHASE_0_COMPLETION_REPORT.md (as section)

**Into:** `PROJECT_ROADMAP_COMPLETE.md`

### 8. INSTRUMENTATION → Keep as separate TS files
These are actual implementations, not documentation - keep separate

### 9. DELETE CANDIDATES (true redundancy)
- extract_docx.py (utility, not core)
- todo.txt (superseded by todo system)
- temp_docx/ folder (extraction artifacts)

## ESTIMATED REDUCTION
- Current: ~90 files
- After merging: ~45-50 files
- Reduction: ~45-50% fewer files

## MERGE COMMANDS

```bash
# Example for Consciousness Engine merge
cat CONSCIOUSNESS_ENGINE_120_CHUNKS.md > CONSCIOUSNESS_ENGINE_COMPLETE.md
echo "\n\n---\n\n## Architecture Implementation\n" >> CONSCIOUSNESS_ENGINE_COMPLETE.md
cat CONSCIOUSNESS_ENGINE_ARCHITECTURE.js >> CONSCIOUSNESS_ENGINE_COMPLETE.md
echo "\n\n---\n\n## Gluing and Sheafification\n" >> CONSCIOUSNESS_ENGINE_COMPLETE.md
cat CONSCIOUSNESS_ENGINE_GLUING_SHEAFIFICATION.md >> CONSCIOUSNESS_ENGINE_COMPLETE.md
# ... continue pattern

# Then remove originals
rm CONSCIOUSNESS_ENGINE_120_CHUNKS.md
rm CONSCIOUSNESS_ENGINE_ARCHITECTURE.js
# etc.
```

## PRINCIPLES
1. Merge only when content is truly related
2. Keep clear section headers when merging
3. Preserve ALL semantic content
4. Don't merge different languages (keep .js, .ts, .html separate)
5. Don't merge theory with implementation

Shall I proceed with these merges?

∎