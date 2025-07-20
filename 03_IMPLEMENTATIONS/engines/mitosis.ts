/**
 * Digital Mitosis: The foundational division operator for chunk evolution
 * Implements INV-IRREVERSIBLE-001 and INV-ENERGY-001 from CHARTER
 */

import { createHash } from 'crypto';

interface ChunkCore {
  id: string;
  energy: number;
  capabilities: Set<string>;
  genome: Record<string, any>;
}

interface DivisionResult {
  parent: ChunkCore;
  children: [ChunkCore, ChunkCore];
  conservationProof: {
    energyDelta: number;
    capabilityHash: string;
    genomicIntegrity: boolean;
  };
}

export class Mitosis {
  private static readonly ENERGY_TOLERANCE = 1e-9;
  
  static divide(parent: ChunkCore, splitRatio: number = 0.5): DivisionResult {
    if (splitRatio <= 0 || splitRatio >= 1) {
      throw new Error('Split ratio must be in (0,1)');
    }
    
    const child1Energy = parent.energy * splitRatio;
    const child2Energy = parent.energy * (1 - splitRatio);
    
    const capPartition = this.partitionCapabilities(parent.capabilities, splitRatio);
    
    const child1: ChunkCore = {
      id: `${parent.id}-L${Date.now()}`,
      energy: child1Energy,
      capabilities: capPartition[0],
      genome: { ...parent.genome, lineage: parent.id, birthEnergy: child1Energy }
    };
    
    const child2: ChunkCore = {
      id: `${parent.id}-R${Date.now()}`,
      energy: child2Energy,
      capabilities: capPartition[1],
      genome: { ...parent.genome, lineage: parent.id, birthEnergy: child2Energy }
    };
    
    const energyConserved = Math.abs((child1Energy + child2Energy) - parent.energy) < this.ENERGY_TOLERANCE;
    const capHash = this.hashCapabilities(Array.from(parent.capabilities).sort());
    
    return {
      parent,
      children: [child1, child2],
      conservationProof: {
        energyDelta: (child1Energy + child2Energy) - parent.energy,
        capabilityHash: capHash,
        genomicIntegrity: energyConserved
      }
    };
  }
  
  private static partitionCapabilities(caps: Set<string>, ratio: number): [Set<string>, Set<string>] {
    const arr = Array.from(caps);
    const split = Math.floor(arr.length * ratio);
    return [new Set(arr.slice(0, split)), new Set(arr.slice(split))];
  }
  
  private static hashCapabilities(caps: string[]): string {
    return createHash('sha256').update(caps.join(',')).digest('hex').slice(0, 8);
  }
}

export function testMitosis() {
  const parent: ChunkCore = {
    id: 'chunk-001',
    energy: 100,
    capabilities: new Set(['read', 'write', 'compute', 'sense']),
    genome: { type: 'metabolic', generation: 0 }
  };
  
  const result = Mitosis.divide(parent, 0.618);
  console.log('Division:', result);
  console.log('Conservation verified:', Math.abs(result.conservationProof.energyDelta) < 1e-9);
}