# TOPOS OBJECT TEMPLATE
*Every file must be a living mathematical object*

## Object Definition

```yaml
ObjectName: [REQUIRED - Unique identifier]
Category: [Which category does this live in?]
Type: [State|Mode|Spell|Bell|Context|Operator|Morphism]

Identity:
  id: [Self-morphism that does nothing]
  verification: [How to check this IS this]

TruthValue:
  classical: [true|false|undefined]
  flow: [true|false|undefined]
  temporal: [true|false|undefined]
  void: [true|false|undefined]
  
Morphisms:
  incoming:
    - source: [Object]
      morphism: [Name]
      action: [What it does]
  outgoing:
    - target: [Object]
      morphism: [Name]
      action: [What it does]
      
Subobjects:
  - name: [Subobject]
    inclusion: [How it sits inside]
    truth_condition: [When it exists]
    
PowerObject:
  P(This):
    generator: [How to build all subobjects]
    membership: [Morphism to Ω]
    
Limits:
  products:
    - with: [Object]
      gives: [Product object]
  pullbacks:
    - over: [Object]
      gives: [Pullback]
      
Colimits:
  coproducts:
    - with: [Object]
      gives: [Sum object]
  pushouts:
    - under: [Object]  
      gives: [Pushout]
      
Exponentials:
  This^X:
    - exponent: [Object]
      gives: [Function space]
      evaluation: [How to apply]
      
CompositionLaw:
  - sequence: [f∘g]
    equals: [h]
    verification: [Test]
    
Invariants:
  - property: [What stays constant]
    under: [Which morphisms preserve it]
    breaks_when: [Violation conditions]
    
KillConditions:
  - if: [Condition]
    then: [This object ceases to exist]
    
RatchetProperties:
  irreversible: [true|false]
  accumulates: [What it gathers]
  never_forgets: [What it preserves]
```

## Example: The BUTTERFLY Spell as Proper Object

```yaml
ObjectName: BUTTERFLY_SPELL
Category: SpellCategory  
Type: Spell

Identity:
  id: BUTTERFLY∘id_Context = BUTTERFLY
  verification: Applying BUTTERFLY to unchanged context changes nothing

TruthValue:
  classical: true (is a well-defined function)
  flow: true (creates exploratory flow)
  temporal: true (time-boxed to 15min)
  void: false (has definite action)
  
Morphisms:
  incoming:
    - source: OPERATOR
      morphism: invoke
      action: Operator triggers reconnaissance
  outgoing:
    - target: Context
      morphism: scout
      action: Explores without commitment for 15min
    - target: MANDELBROT_SPELL
      morphism: if_complexity_found
      action: Triggers zoom if edges discovered
      
Subobjects:
  - name: BUTTERFLY_PARTIAL
    inclusion: First 5 minutes of scouting
    truth_condition: Timer < 5min
  - name: BUTTERFLY_COMPLETE  
    inclusion: Full 15 minute reconnaissance
    truth_condition: Timer = 15min
    
PowerObject:
  P(BUTTERFLY):
    generator: All possible partial scouts (by time)
    membership: χ: P(BUTTERFLY) → Ω maps duration to completion truth
    
Limits:
  products:
    - with: DIAGNOSTIC
      gives: BUTTERFLY_WITH_TRACKING
  pullbacks:
    - over: Context
      gives: BUTTERFLY_IN_CONTEXT
      
Colimits:
  coproducts:
    - with: MANDELBROT
      gives: SCOUT_OR_ZOOM choice
  pushouts:
    - under: Timer
      gives: TIMED_BUTTERFLY
      
Exponentials:
  BUTTERFLY^Context:
    - exponent: Context  
      gives: All ways to scout different contexts
      evaluation: eval: BUTTERFLY^Context × Context → ScoutResult
      
CompositionLaw:
  - sequence: BUTTERFLY∘STANDARD_PREFLIGHT
    equals: PREPARED_SCOUT
    verification: Preflight ensures proper scouting setup
    
Invariants:
  - property: Non-commitment
    under: All applications
    breaks_when: Scout biases toward specific outcome
  - property: Time bound  
    under: All contexts
    breaks_when: Timer exceeds 15min
    
KillConditions:
  - if: Scout becomes targeted search
    then: BUTTERFLY becomes MAGPIE
  - if: No patterns found repeatedly
    then: BUTTERFLY effectiveness = 0
    
RatchetProperties:
  irreversible: false (can scout same area again)
  accumulates: Pattern recognition hints
  never_forgets: Discovered edges (feeds to MAGPIE)
```

THIS is what every object needs. Not flat descriptions but living mathematical structure.

Should we rebuild EVERYTHING with this template? Or identify the CORE objects that must exist first?

∎