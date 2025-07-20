"use strict";
/**
 * Invariant Engine: Central enforcement of constitutional invariants
 * All modules submit proofs here for verification
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvariantEngine = void 0;
class InvariantEngine {
    invariants = new Map();
    proofLog = [];
    violationCallbacks = new Map();
    constructor() {
        this.registerCoreInvariants();
    }
    registerCoreInvariants() {
        // INV-WOBBLE-001: Semantic wobble 9° ± 2°
        this.register({
            id: 'INV-WOBBLE-001',
            description: 'Semantic wobble SHALL maintain 9° ± 2° at all chunk boundaries',
            validate: (proof) => {
                const wobble = proof.metrics.wobble || 0;
                return wobble >= 7 && wobble <= 11;
            }
        });
        // INV-ENERGY-001: Energy conservation
        this.register({
            id: 'INV-ENERGY-001',
            description: 'Energy conservation: E_in = E_out + E_transformed + E_cost',
            errorTolerance: 1e-9,
            validate: (proof) => {
                const delta = proof.metrics.energyDelta || Infinity;
                return Math.abs(delta) < (this.invariants.get('INV-ENERGY-001')?.errorTolerance || 1e-9);
            }
        });
        // INV-SHEAF-001: Cocycle conditions
        this.register({
            id: 'INV-SHEAF-001',
            description: 'Chunk interfaces MUST satisfy cocycle conditions',
            validate: (proof) => {
                return proof.metrics.cocycleError === 0;
            }
        });
        // INV-PROPERTY-001: Property satisfaction set
        this.register({
            id: 'INV-PROPERTY-001',
            description: 'Chunks advance only after satisfying ALL required properties',
            validate: (proof) => {
                const required = ['gluingCoherence', 'wobbleTolerance', 'energyEfficiency', 'numericalStability', 'riskAssessment'];
                return required.every(prop => proof.metrics[prop] === 1);
            }
        });
        // INV-AUDIT-001: Measurability
        this.register({
            id: 'INV-AUDIT-001',
            description: 'Every operation must be measurable',
            validate: (proof) => {
                return proof.timestamp > 0 && proof.submitter.length > 0;
            }
        });
    }
    register(spec) {
        this.invariants.set(spec.id, spec);
    }
    submitProof(proof) {
        const spec = this.invariants.get(proof.invariantId);
        if (!spec) {
            throw new Error(`Unknown invariant: ${proof.invariantId}`);
        }
        // Validate the proof
        const isValid = spec.validate(proof);
        proof.pass = isValid;
        // Log it
        this.proofLog.push(proof);
        // Trigger callbacks on violation
        if (!isValid) {
            const callbacks = this.violationCallbacks.get(proof.invariantId) || [];
            callbacks.forEach(cb => cb(proof));
        }
        return isValid;
    }
    onViolation(invariantId, callback) {
        if (!this.violationCallbacks.has(invariantId)) {
            this.violationCallbacks.set(invariantId, []);
        }
        this.violationCallbacks.get(invariantId).push(callback);
    }
    getRecentProofs(invariantId, limit = 100) {
        let proofs = this.proofLog;
        if (invariantId) {
            proofs = proofs.filter(p => p.invariantId === invariantId);
        }
        return proofs.slice(-limit);
    }
    getViolations(since) {
        return this.proofLog.filter(p => !p.pass && (!since || p.timestamp > since));
    }
    checkAll(metrics, submitter) {
        const results = new Map();
        for (const [id, spec] of this.invariants) {
            const proof = {
                invariantId: id,
                timestamp: Date.now(),
                submitter,
                pass: false,
                metrics
            };
            const pass = this.submitProof(proof);
            results.set(id, pass);
        }
        return results;
    }
    getHealthReport() {
        const invariantHealth = new Map();
        for (const [id] of this.invariants) {
            const proofs = this.getRecentProofs(id);
            const passes = proofs.filter(p => p.pass).length;
            const rate = proofs.length > 0 ? passes / proofs.length : 1;
            invariantHealth.set(id, rate);
        }
        const violations = this.proofLog.filter(p => !p.pass).length;
        return {
            totalProofs: this.proofLog.length,
            violations,
            violationRate: this.proofLog.length > 0 ? violations / this.proofLog.length : 0,
            invariantHealth
        };
    }
}
exports.InvariantEngine = InvariantEngine;
