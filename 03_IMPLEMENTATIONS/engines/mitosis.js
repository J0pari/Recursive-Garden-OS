"use strict";
/**
 * Digital Mitosis: The foundational division operator for chunk evolution
 * Implements INV-IRREVERSIBLE-001 and INV-ENERGY-001 from CHARTER
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mitosis = void 0;
exports.testMitosis = testMitosis;
const crypto_1 = require("crypto");
class Mitosis {
    static ENERGY_TOLERANCE = 1e-9;
    static divide(parent, splitRatio = 0.5) {
        if (splitRatio <= 0 || splitRatio >= 1) {
            throw new Error('Split ratio must be in (0,1)');
        }
        const child1Energy = parent.energy * splitRatio;
        const child2Energy = parent.energy * (1 - splitRatio);
        const capPartition = this.partitionCapabilities(parent.capabilities, splitRatio);
        const child1 = {
            id: `${parent.id}-L${Date.now()}`,
            energy: child1Energy,
            capabilities: capPartition[0],
            genome: { ...parent.genome, lineage: parent.id, birthEnergy: child1Energy }
        };
        const child2 = {
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
    static partitionCapabilities(caps, ratio) {
        const arr = Array.from(caps);
        const split = Math.floor(arr.length * ratio);
        return [new Set(arr.slice(0, split)), new Set(arr.slice(split))];
    }
    static hashCapabilities(caps) {
        return (0, crypto_1.createHash)('sha256').update(caps.join(',')).digest('hex').slice(0, 8);
    }
}
exports.Mitosis = Mitosis;
function testMitosis() {
    const parent = {
        id: 'chunk-001',
        energy: 100,
        capabilities: new Set(['read', 'write', 'compute', 'sense']),
        genome: { type: 'metabolic', generation: 0 }
    };
    const result = Mitosis.divide(parent, 0.618);
    console.log('Division:', result);
    console.log('Conservation verified:', Math.abs(result.conservationProof.energyDelta) < 1e-9);
}
