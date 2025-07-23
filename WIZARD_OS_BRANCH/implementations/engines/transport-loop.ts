/**
 * Transport Loop: Executes parallel transport around context cycles
 * Measures holonomy (accumulated distortion) from round trips
 */

import { Context, CoreState, ViewState, Adapter, AdapterRegistry } from './context.js';
import { createHash } from 'crypto';

export interface HolonomyReport {
  loopId: string;
  path: string[];
  startState: CoreState;
  endState: CoreState;
  totalDistortion: number;
  stepDistortions: number[];
  invariantDrifts: Map<string, number>;
  timestamp: number;
}

export class TransportLoop {
  constructor(
    private registry: AdapterRegistry,
    private invariantIds: string[] = []
  ) {}
  
  runLoop(
    startCore: CoreState,
    path: string[]
  ): HolonomyReport {
    if (path.length < 2) {
      throw new Error('Path must have at least 2 contexts');
    }
    
    if (path[0] !== path[path.length - 1]) {
      throw new Error('Path must be a closed loop');
    }
    
    let current = { ...startCore };
    const stepDistortions: number[] = [];
    const views: ViewState[] = [];
    
    // Forward transport around loop
    for (let i = 0; i < path.length - 1; i++) {
      const fromId = path[i];
      const toId = path[i + 1];
      
      const adapter = this.registry.getAdapter(fromId, toId);
      if (!adapter) {
        throw new Error(`No adapter found: ${fromId}->${toId}`);
      }
      
      const fromCtx = this.registry.getContext(fromId)!;
      const toCtx = this.registry.getContext(toId)!;
      
      const beforeHash = this.hashState(current);
      const view = adapter.forward(current, fromCtx, toCtx);
      views.push(view);
      
      // If adapter supports backward transform, apply it
      if (adapter.backward) {
        current = adapter.backward(view, fromCtx, toCtx);
      }
      
      const afterHash = this.hashState(current);
      const distortion = beforeHash === afterHash ? 0 : 1; // Simple binary for now
      stepDistortions.push(distortion);
    }
    
    // Measure total holonomy
    const totalDistortion = this.measureDistortion(startCore, current);
    
    // Check invariant preservation
    const invariantDrifts = new Map<string, number>();
    for (const invId of this.invariantIds) {
      const drift = this.measureInvariantDrift(invId, startCore, current);
      invariantDrifts.set(invId, drift);
    }
    
    return {
      loopId: this.generateLoopId(path),
      path,
      startState: startCore,
      endState: current,
      totalDistortion,
      stepDistortions,
      invariantDrifts,
      timestamp: Date.now()
    };
  }
  
  private measureDistortion(a: CoreState, b: CoreState): number {
    // Combine energy, wobble, and essence differences
    const energyDiff = Math.abs(a.energy - b.energy) / Math.max(a.energy, 1);
    const wobbleDiff = Math.abs(a.wobble - b.wobble) / 180; // Normalized to [0,1]
    
    const essenceKeys = new Set([
      ...Object.keys(a.essence),
      ...Object.keys(b.essence)
    ]);
    
    let essenceDiff = 0;
    for (const key of essenceKeys) {
      if (a.essence[key] !== b.essence[key]) {
        essenceDiff += 1;
      }
    }
    essenceDiff /= Math.max(essenceKeys.size, 1);
    
    return (energyDiff + wobbleDiff + essenceDiff) / 3;
  }
  
  private measureInvariantDrift(
    invariantId: string,
    before: CoreState,
    after: CoreState
  ): number {
    // Simplified: just check if core properties changed
    switch (invariantId) {
      case 'INV-ENERGY-001':
        return Math.abs(before.energy - after.energy);
      case 'INV-WOBBLE-001':
        return Math.abs(before.wobble - after.wobble);
      default:
        return 0;
    }
  }
  
  private hashState(state: CoreState): string {
    const str = JSON.stringify({
      energy: state.energy,
      wobble: state.wobble,
      essence: state.essence
    });
    return createHash('sha256').update(str).digest('hex').slice(0, 16);
  }
  
  private generateLoopId(path: string[]): string {
    return createHash('sha256')
      .update(path.join('->'))
      .digest('hex')
      .slice(0, 8);
  }
}

export function sampleHolonomy(
  registry: AdapterRegistry,
  coreState: CoreState,
  contextIds: string[]
): HolonomyReport[] {
  const loop = new TransportLoop(registry);
  const reports: HolonomyReport[] = [];
  
  // Sample various loop permutations
  for (let i = 0; i < contextIds.length; i++) {
    for (let j = i + 1; j < contextIds.length; j++) {
      const path = [contextIds[i], contextIds[j], contextIds[i]];
      try {
        const report = loop.runLoop(coreState, path);
        reports.push(report);
      } catch (e) {
        // Skip if no adapter path exists
      }
    }
  }
  
  return reports;
}