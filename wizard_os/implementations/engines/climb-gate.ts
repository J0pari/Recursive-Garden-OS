/**
 * Climb Gate: Controls progression up the evolutionary ladder
 * Enforces strict criteria before allowing advancement to higher rungs
 */

import { InvariantEngine } from './invariant-engine.js';
import { CurvatureMap } from './curvature-map.js';
import { LineageLog } from './lineage-log.js';

export interface ClimbCriteria {
  minTightChunks: number;
  maxMedianHolonomy: number;
  wobbleTolerance: { min: number; max: number };
  minEnergyEfficiency: number;
  maxRiskScore: number;
  requiredCapabilities?: Set<string>;
  customChecks?: Array<(state: SystemState) => boolean>;
}

export interface SystemState {
  currentRung: number;
  tightChunkCount: number;
  medianHolonomy: number;
  averageWobble: number;
  energyEfficiency: number;
  maxRiskScore: number;
  capabilities: Set<string>;
  metrics: Record<string, number>;
}

export interface ClimbAttempt {
  timestamp: number;
  fromRung: number;
  toRung: number;
  state: SystemState;
  criteriaResults: Map<string, boolean>;
  approved: boolean;
  reason?: string;
}

export class ClimbGate {
  private attempts: ClimbAttempt[] = [];
  private rungCriteria = new Map<number, ClimbCriteria>();
  
  constructor(
    private invariantEngine: InvariantEngine,
    private curvatureMap: CurvatureMap,
    private lineageLog: LineageLog
  ) {
    this.initializeDefaultCriteria();
  }
  
  private initializeDefaultCriteria(): void {
    // S0 -> S1: Basic metabolic stability
    this.rungCriteria.set(1, {
      minTightChunks: 3,
      maxMedianHolonomy: 0.8,
      wobbleTolerance: { min: 7, max: 11 },
      minEnergyEfficiency: 0.7,
      maxRiskScore: 0.3
    });
    
    // S1 -> S2: Emergent structure
    this.rungCriteria.set(2, {
      minTightChunks: 10,
      maxMedianHolonomy: 0.5,
      wobbleTolerance: { min: 8, max: 10 },
      minEnergyEfficiency: 0.8,
      maxRiskScore: 0.2,
      requiredCapabilities: new Set(['mitosis', 'energy-tracking'])
    });
    
    // S2 -> S3: Pattern recognition
    this.rungCriteria.set(3, {
      minTightChunks: 30,
      maxMedianHolonomy: 0.3,
      wobbleTolerance: { min: 8.5, max: 9.5 },
      minEnergyEfficiency: 0.85,
      maxRiskScore: 0.15,
      requiredCapabilities: new Set(['pattern-match', 'context-switch'])
    });
    
    // S3 -> S4: Abstract reasoning
    this.rungCriteria.set(4, {
      minTightChunks: 100,
      maxMedianHolonomy: 0.2,
      wobbleTolerance: { min: 8.8, max: 9.2 },
      minEnergyEfficiency: 0.9,
      maxRiskScore: 0.1,
      requiredCapabilities: new Set(['abstraction', 'symbolic-manipulation'])
    });
    
    // S4 -> S5: Self-modification
    this.rungCriteria.set(5, {
      minTightChunks: 300,
      maxMedianHolonomy: 0.1,
      wobbleTolerance: { min: 8.9, max: 9.1 },
      minEnergyEfficiency: 0.95,
      maxRiskScore: 0.05,
      requiredCapabilities: new Set(['self-inspection', 'code-generation']),
      customChecks: [
        (state) => state.metrics.selfConsistency > 0.99,
        (state) => state.metrics.invariantViolations === 0
      ]
    });
  }
  
  canClimb(state: SystemState, targetRung: number): ClimbAttempt {
    const criteria = this.rungCriteria.get(targetRung);
    if (!criteria) {
      return this.createAttempt(state, targetRung, false, 'No criteria defined for target rung');
    }
    
    if (targetRung !== state.currentRung + 1) {
      return this.createAttempt(state, targetRung, false, 'Can only climb one rung at a time');
    }
    
    const results = new Map<string, boolean>();
    
    // Check tight chunk count
    results.set('minTightChunks', state.tightChunkCount >= criteria.minTightChunks);
    
    // Check holonomy
    results.set('maxMedianHolonomy', state.medianHolonomy <= criteria.maxMedianHolonomy);
    
    // Check wobble tolerance
    results.set('wobbleTolerance', 
      state.averageWobble >= criteria.wobbleTolerance.min &&
      state.averageWobble <= criteria.wobbleTolerance.max
    );
    
    // Check energy efficiency
    results.set('minEnergyEfficiency', state.energyEfficiency >= criteria.minEnergyEfficiency);
    
    // Check risk score
    results.set('maxRiskScore', state.maxRiskScore <= criteria.maxRiskScore);
    
    // Check required capabilities
    if (criteria.requiredCapabilities) {
      const hasAll = Array.from(criteria.requiredCapabilities).every(
        cap => state.capabilities.has(cap)
      );
      results.set('requiredCapabilities', hasAll);
    }
    
    // Run custom checks
    if (criteria.customChecks) {
      criteria.customChecks.forEach((check, i) => {
        results.set(`customCheck${i}`, check(state));
      });
    }
    
    // Verify all invariants
    const invariantResults = this.invariantEngine.checkAll(state.metrics, 'climb-gate');
    for (const [id, pass] of invariantResults) {
      results.set(id, pass);
    }
    
    // All must pass
    const approved = Array.from(results.values()).every(v => v);
    const failedCriteria = Array.from(results.entries())
      .filter(([_, pass]) => !pass)
      .map(([name, _]) => name);
    
    const reason = approved ? 'All criteria satisfied' : 
      `Failed criteria: ${failedCriteria.join(', ')}`;
    
    const attempt = this.createAttempt(state, targetRung, approved, reason, results);
    this.attempts.push(attempt);
    
    // Log to lineage if approved
    if (approved) {
      this.lineageLog.append({
        timestamp: Date.now(),
        type: 'MUTATION',
        parentId: `rung-${state.currentRung}`,
        childIds: [`rung-${targetRung}`],
        invariantProofs: Object.fromEntries(
          Array.from(results.entries()).map(([k, v]) => [k, v])
        ),
        energyBefore: state.energyEfficiency,
        energyAfter: state.energyEfficiency,
        metadata: { climbApproved: true, targetRung }
      });
    }
    
    return attempt;
  }
  
  private createAttempt(
    state: SystemState,
    targetRung: number,
    approved: boolean,
    reason: string,
    results: Map<string, boolean> = new Map()
  ): ClimbAttempt {
    return {
      timestamp: Date.now(),
      fromRung: state.currentRung,
      toRung: targetRung,
      state: { ...state },
      criteriaResults: results,
      approved,
      reason
    };
  }
  
  getRecentAttempts(limit: number = 10): ClimbAttempt[] {
    return this.attempts.slice(-limit);
  }
  
  getSuccessRate(rung?: number): number {
    const relevant = rung 
      ? this.attempts.filter(a => a.toRung === rung)
      : this.attempts;
    
    if (relevant.length === 0) return 0;
    
    const successful = relevant.filter(a => a.approved).length;
    return successful / relevant.length;
  }
  
  getCriteriaForRung(rung: number): ClimbCriteria | undefined {
    return this.rungCriteria.get(rung);
  }
}