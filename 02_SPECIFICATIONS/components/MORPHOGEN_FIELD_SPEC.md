# DIGITAL MORPHOGEN PROTOTYPE
## S2: Field Sampling and Diffusion

### FIELD STORE SPECIFICATION

**Structure:** Spatial lattice or graph nodes with scalar fields
```
FieldStore = {
    field_name: value_at_each_node
}
```

### DIFFUSION DYNAMICS

```python
# Diffusion step with decay
value_new(node) = (1 - α) * value(node) + α * mean(value(neighbors)) - decay * value(node)
```

### CELL-FIELD INTERACTION

Cells sample k nearest field nodes (their context intersection).

**Differentiation Rule:**
```python
if fields["gradA"] > θ1 and fields["gradB"] < θ2:
    activate_profile("Type_X")
```

### SHEAF COHERENCE

- Each lattice patch = context
- Field values restrict by simple subset
- Gluing demands overlapping averages match within tolerance ε
- Use as Čech mismatch detector for diffusion bugs

### CONSERVATION CHECK

Total field mass should be conserved (modulo sources/sinks):
```
∑(field_values) = constant + ∫(sources - sinks)dt
```

### THIS COMES AFTER MITOSIS WORKS

Do not implement until S1 complete and stable.

∎