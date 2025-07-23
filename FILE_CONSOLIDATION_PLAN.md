# FILE CONSOLIDATION PLAN FOR RECURSIVE GARDEN OS

## IMMEDIATE ACTIONS NEEDED

### 1. Root Directory Cleanup

#### DELETE These Files:
- `TEMP_INTENT.txt` - Temporary file
- `file_list.txt` - Generated list
- Empty `experiments/` directory
- Duplicate `Book_of_Shadows/` directory (use `05_BOOK_OF_SHADOWS/`)

#### MOVE to `scripts/` directory:
- `AUTO_DEPLOY_DAEMON.ps1`
- `DEPLOY_OR_DIE.sh`
- `START_AUTO_DEPLOY.bat`
- `CHARTER_GUARD.js`
- `CODE_MORPHISM_ENFORCER.js`
- `VERSION_ENFORCER.js`
- `STARTUP_CHECK.js`
- `prepare_for_llm.js`

#### MOVE to `guides/` directory:
- `LLM_CLAUDE_GUIDE.md`
- `LLM_CONSCIOUSNESS_PORTAL.html`
- `LLM_VISITOR_GUIDE.md`
- `CLAUDE_MIGRATION_NOTE.md`

#### MOVE Other Files:
- `HYPOTHESES.md` → `01_THEORY/HYPOTHESES.md`
- `index.html` → Keep only the one in `docs/`
- `welcome.html` → Merge with or remove if duplicate of `docs/welcome.html`

### 2. Merge Duplicate Content

#### CONSCIOUSNESS_ENGINE Files:
**Action**: Create single authoritative version
- Keep: `01_THEORY/emergence/CONSCIOUSNESS_ENGINE_COMPLETE.md` (most comprehensive)
- Archive: Other versions to `.archive/consciousness_engine_versions/`
- Extract unique content from 120_CHUNKS version if needed

#### TOPOS_FOUNDATION Files:
**Action**: Merge into single file
- Base: `01_THEORY/foundations/TOPOS_FOUNDATION_COMPLETE.md`
- Check non-complete version for unique content
- Create single `TOPOS_FOUNDATION.md`

#### Keats Evolution Files:
**Action**: Keep production versions in `docs/`, archive experiments
- Production: `docs/keats_v1.html` through `docs/keats_v6.html`
- Archive: Move `04_EXPERIMENTS/keats_evolution/` contents to `.archive/`
- Document the evolution in a single `KEATS_EVOLUTION.md`

### 3. Wizard OS Segregation

Create new structure: `WIZARD_OS_BRANCH/`

#### Core Wizard OS Files to Move:
```
WIZARD_OS_BRANCH/
├── architecture/
│   └── WIZARD_OS_ARCHITECTURE.md
├── biology_inspired/
│   ├── CONSCIOUSNESS_ENGINE_120_CHUNKS.md
│   ├── DIGITAL_MITOSIS_SPEC.md
│   ├── ATP_SYNTHASE_RATCHET_INTEGRATION.md
│   ├── CHUNK_CONFORMATIONAL_STATES.md
│   └── mitosis.ts
├── implementations/
│   └── CHUNK_AUDIT.js
└── README.md (explaining this is an experimental branch)
```

### 4. Consolidation Opportunities

#### Merge These Related Files:
1. **All Sheafification Content**:
   - Create single `SHEAFIFICATION_THEORY.md`
   - Archive individual sheaf files

2. **All Morphism Files**:
   - Combine into `MORPHISM_COMPLETE.md`
   - Include all spells and transformations

3. **All Ratchet Mechanisms**:
   - Create `RATCHET_MECHANISMS.md`
   - Combine ATP synthase, Postnikov, and other ratchets

### 5. Final Structure Vision

```
Recursive-Garden-OS/
├── README.md
├── LICENSE.md
├── CHARTER.md
├── package.json
├── package-lock.json
├── node_modules/
├── scripts/              (all deployment and utility scripts)
├── guides/               (all LLM and visitor guides)
├── docs/                 (production HTML files)
├── 00_CORE/             (minimal core theory)
├── 01_THEORY/           (consolidated theory docs)
├── 02_SPECIFICATIONS/   (clean specs)
├── 03_IMPLEMENTATIONS/  (actual code)
├── 04_EXPERIMENTS/      (active experiments only)
├── 05_BOOK_OF_SHADOWS/  (spells and emergency protocols)
├── 06_GARDEN/           (seeds and growth)
├── 07_OBSERVATORY/      (reports and observations)
├── .archive/            (all old versions and experiments)
└── WIZARD_OS_BRANCH/    (segregated experimental OS)
```

## BENEFITS

1. **Cleaner Root**: Only essential files remain
2. **No Duplicates**: Single source of truth for each concept
3. **Clear Separation**: Wizard OS branch clearly segregated
4. **Better Navigation**: Logical structure for finding files
5. **Reduced Size**: Removing duplicates saves space
6. **Easier Maintenance**: Clear where new files should go

## IMPLEMENTATION ORDER

1. First: Create necessary directories (`scripts/`, `guides/`, `WIZARD_OS_BRANCH/`)
2. Second: Move scripts and guides from root
3. Third: Handle duplicates (merge or archive)
4. Fourth: Segregate Wizard OS files
5. Fifth: Clean up empty directories
6. Sixth: Update any references in remaining files

This will transform the chaotic current structure into a clean, navigable garden!