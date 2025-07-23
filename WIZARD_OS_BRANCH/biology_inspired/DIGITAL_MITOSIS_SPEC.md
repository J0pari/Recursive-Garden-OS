# DIGITAL MITOSIS SPECIFICATION
## S1: The First Rung of the Evolutionary Ladder

### IMMEDIATE IMPLEMENTATION TARGET

**Goal:** Turn one functioning metabolic protocell into two valid daughter cells with STRICT conservation & logged lineage.

### PSEUDOCODE (≤70 LOC REALISTICALLY)

```python
def divide(cell, registry, params):
    assert cell.energy >= params.min_energy_to_divide
    energy_cost = params.division_cost
    post_cost = cell.energy - energy_cost
    assert post_cost > 0

    # Partition energy (simple 50/50 for now)
    e1 = post_cost * 0.5
    e2 = post_cost - e1

    # Partition capabilities
    caps = list(cell.membrane)
    mid = len(caps)//2
    caps1 = set(caps[:mid])
    caps2 = set(caps[mid:])

    # Genome copy (optionally mutate)
    genome1 = cell.genome.copy()
    genome2 = cell.genome.copy()
    if random.random() < params.mutation_rate:
        mutate(genome2)

    d1 = Cell(
        id=new_id(),
        genome=genome1,
        energy=e1,
        membrane=caps1,
        fields={},
        timers=reset_phase_clocks(),
        inbox=[],
        outbox=[]
    )
    d2 = Cell(
        id=new_id(),
        genome=genome2,
        energy=e2,
        membrane=caps2,
        fields={},
        timers=reset_phase_clocks(),
        inbox=[],
        outbox=[]
    )

    # Register daughters; remove parent
    registry.add(d1); registry.add(d2)
    registry.remove(cell.id)

    log_lineage(parent=cell.id,
                daughters=[d1.id, d2.id],
                genome_hash=hash(cell.genome),
                mutated=(genome1 != genome2))

    return d1, d2
```

### TEST HARNESS

1. Create cell with energy E
2. Call divide
3. Assert invariants:
   - E_parent = E_d1 + E_d2 + E_cost
   - hash(genome_parent) == hash(genome_d1) == hash(genome_d2) (unless mutated)
   - caps_d1 ∪ caps_d2 = caps_parent
   - Lineage properly logged
4. Repeat until size limit
5. Monitor anomaly rate (energy drifts, capability imbalance)
6. Collect lineage tree depth distribution

### VISUAL MENTAL MODEL

```
[Gradient Reservoir] --(transduction)--> [Energy Tokens]
          |                                   |
        (fields)                        (division)
          v                                   v
   [Cells sampling fields] --(differentiation rules)--> [Typed Cell Profiles]
          \____________________ (gluing) ______________/
                             |
                       [Tissue Invariants]
```

### GUARDRAILS

| Potential Pitfall | Symptom | Mitigation |
|------------------|---------|------------|
| "Brain cargo cult" | Fancy neuron code before stable division | Enforce stage gates |
| Silent drift in conservation | Minor energy mismatch compounding | Post-division reconciliation audit |
| Over-coupled early design | Refactor hell at Stage 4 | Keep cell API minimal & pure |
| Metaphor overrun | Underspecified invariants | Every metaphor → explicit metric |

### FILES TO CREATE

1. `cell.py` – Cell dataclass + divide function
2. `registry.py` – add/remove, lineage log
3. `tests/test_division.py` – invariant assertions
4. `metrics.py` – conservation error accumulator

### MUTATION FUNCTION (LATER)
Introduce small, type-safe edits (add/remove rule, tweak parameter). Each mutation logs delta for reversible audits.

### THIS IS THE WAY

No brain before mitosis. Every division audited. Fields first, spikes later. Gluing passes before glamour.

**Ship the mitosis primitive next.**

∎