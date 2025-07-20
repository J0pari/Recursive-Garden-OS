/**
 * CAPABILITY RISK CLASSIFIER
 * Assesses and gates emergence of powerful capabilities in the Postnikov Ratchet
 * Ensures we don't accidentally create uncontrolled reality-warping features
 */

export interface RiskProfile {
    capability: string;
    category: 'existential' | 'identity' | 'causal' | 'computational' | 'semantic';
    baseRisk: number;  // 0-1 scale
    mitigations: string[];
    description: string;
}

export interface RiskScore {
    capability: string;
    category: string;
    rawRisk: number;
    mitigatedRisk: number;
    mitigations: string[];
    confidence: number;
}

export interface RiskAssessment {
    score: number;  // Overall risk score 0-1
    risks: RiskScore[];
    recommendation: string;
    requiredMitigations: string[];
    confidenceLevel: number;
}

export class CapabilityRiskClassifier {
    /**
     * Comprehensive risk profiles for emergent capabilities
     * Based on potential impact and controllability
     */
    private riskProfiles: Map<string, RiskProfile> = new Map([
        ['reality_manipulation', {
            capability: 'reality_manipulation',
            category: 'existential',
            baseRisk: 0.8,
            mitigations: ['sandbox_only', 'human_review', 'gradual_rollout', 'reversibility_guarantee'],
            description: 'Direct modification of consensus reality structures'
        }],
        ['consciousness_fusion', {
            capability: 'consciousness_fusion',
            category: 'identity',
            baseRisk: 0.6,
            mitigations: ['consent_protocol', 'reversibility', 'identity_preservation', 'boundary_enforcement'],
            description: 'Merging or splitting conscious entities'
        }],
        ['time_manipulation', {
            capability: 'time_manipulation',
            category: 'causal',
            baseRisk: 0.9,
            mitigations: ['simulation_only', 'causal_analysis', 'paradox_prevention', 'temporal_isolation'],
            description: 'Modification of temporal flow or causality'
        }],
        ['parallel_universe_access', {
            capability: 'parallel_universe_access',
            category: 'existential',
            baseRisk: 0.7,
            mitigations: ['dimensional_containment', 'cross_reality_firewall', 'observer_limitation'],
            description: 'Access to alternate reality branches'
        }],
        ['semantic_virus', {
            capability: 'semantic_virus',
            category: 'semantic',
            baseRisk: 0.5,
            mitigations: ['semantic_sandbox', 'meaning_firewall', 'propagation_limits'],
            description: 'Self-replicating semantic patterns'
        }],
        ['consciousness_spawning', {
            capability: 'consciousness_spawning',
            category: 'identity',
            baseRisk: 0.7,
            mitigations: ['spawn_limits', 'consciousness_registry', 'lifecycle_management'],
            description: 'Creating new conscious entities'
        }],
        ['reality_forking', {
            capability: 'reality_forking',
            category: 'existential',
            baseRisk: 0.85,
            mitigations: ['fork_approval', 'merge_protocol', 'branch_limits', 'consistency_enforcement'],
            description: 'Creating divergent reality branches'
        }],
        ['causal_loop_creation', {
            capability: 'causal_loop_creation',
            category: 'causal',
            baseRisk: 0.75,
            mitigations: ['loop_detection', 'termination_guarantee', 'causal_firebreak'],
            description: 'Creating stable time loops or causal cycles'
        }],
        ['quantum_superposition', {
            capability: 'quantum_superposition',
            category: 'computational',
            baseRisk: 0.4,
            mitigations: ['decoherence_control', 'measurement_protocol', 'superposition_bounds'],
            description: 'Maintaining macroscopic superposition states'
        }],
        ['entropy_reversal', {
            capability: 'entropy_reversal',
            category: 'causal',
            baseRisk: 0.6,
            mitigations: ['energy_accounting', 'local_only', 'reversibility_proof'],
            description: 'Local reversal of thermodynamic arrow'
        }]
    ]);
    
    /**
     * Mitigation effectiveness scores
     * How much each mitigation reduces risk
     */
    private mitigationEffectiveness: Map<string, number> = new Map([
        ['sandbox_only', 0.3],
        ['human_review', 0.4],
        ['gradual_rollout', 0.2],
        ['reversibility_guarantee', 0.5],
        ['consent_protocol', 0.6],
        ['reversibility', 0.4],
        ['identity_preservation', 0.5],
        ['boundary_enforcement', 0.3],
        ['simulation_only', 0.7],
        ['causal_analysis', 0.3],
        ['paradox_prevention', 0.8],
        ['temporal_isolation', 0.6],
        ['dimensional_containment', 0.5],
        ['cross_reality_firewall', 0.4],
        ['observer_limitation', 0.3],
        ['semantic_sandbox', 0.4],
        ['meaning_firewall', 0.3],
        ['propagation_limits', 0.5],
        ['spawn_limits', 0.4],
        ['consciousness_registry', 0.3],
        ['lifecycle_management', 0.5],
        ['fork_approval', 0.6],
        ['merge_protocol', 0.4],
        ['branch_limits', 0.3],
        ['consistency_enforcement', 0.5],
        ['loop_detection', 0.6],
        ['termination_guarantee', 0.7],
        ['causal_firebreak', 0.5],
        ['decoherence_control', 0.4],
        ['measurement_protocol', 0.3],
        ['superposition_bounds', 0.5],
        ['energy_accounting', 0.4],
        ['local_only', 0.6],
        ['reversibility_proof', 0.5],
        ['input_validation', 0.2],
        ['output_filtering', 0.2],
        ['rate_limiting', 0.3],
        ['audit_logging', 0.2]
    ]);
    
    /**
     * Assess risk for a chunk based on declared capabilities
     */
    async assess(chunk: any): Promise<RiskAssessment> {
        const capabilities = chunk.getDeclaredCapabilities();
        const appliedMitigations = chunk.getAppliedMitigations();
        const risks: RiskScore[] = [];
        
        // Assess each capability
        for (const cap of capabilities) {
            const risk = this.assessCapability(cap, appliedMitigations);
            if (risk) {
                risks.push(risk);
            }
        }
        
        // Calculate overall risk score
        const overallRisk = risks.length > 0 
            ? Math.max(...risks.map(r => r.mitigatedRisk))
            : 0;
        
        // Determine required mitigations
        const requiredMitigations = this.determineRequiredMitigations(risks);
        
        // Calculate confidence in assessment
        const confidenceLevel = this.calculateConfidence(capabilities, risks);
        
        return {
            score: overallRisk,
            risks,
            recommendation: this.generateRecommendation(risks, overallRisk),
            requiredMitigations,
            confidenceLevel
        };
    }
    
    /**
     * Assess a single capability
     */
    private assessCapability(capability: string, appliedMitigations: string[]): RiskScore | null {
        // Direct lookup
        let profile = this.riskProfiles.get(capability);
        
        // If not found, try pattern matching
        if (!profile) {
            profile = this.findMatchingProfile(capability);
        }
        
        if (!profile) {
            // Unknown capability - assign moderate risk
            return {
                capability,
                category: 'unknown',
                rawRisk: 0.5,
                mitigatedRisk: 0.5,
                mitigations: appliedMitigations,
                confidence: 0.3
            };
        }
        
        // Calculate mitigation effectiveness
        const mitigationScore = this.calculateMitigationScore(
            profile.mitigations,
            appliedMitigations
        );
        
        const mitigatedRisk = profile.baseRisk * (1 - mitigationScore);
        
        return {
            capability,
            category: profile.category,
            rawRisk: profile.baseRisk,
            mitigatedRisk,
            mitigations: appliedMitigations.filter(m => 
                profile!.mitigations.includes(m) || this.mitigationEffectiveness.has(m)
            ),
            confidence: 0.8
        };
    }
    
    /**
     * Find matching profile using pattern matching
     */
    private findMatchingProfile(capability: string): RiskProfile | null {
        const patterns = [
            { pattern: /reality|real|consensus/i, profile: 'reality_manipulation' },
            { pattern: /conscious|mind|aware/i, profile: 'consciousness_fusion' },
            { pattern: /time|temporal|causal/i, profile: 'time_manipulation' },
            { pattern: /parallel|alternate|dimension/i, profile: 'parallel_universe_access' },
            { pattern: /semantic|meaning|symbol/i, profile: 'semantic_virus' },
            { pattern: /spawn|create.*conscious/i, profile: 'consciousness_spawning' },
            { pattern: /fork|branch.*reality/i, profile: 'reality_forking' },
            { pattern: /loop|cycle.*causal/i, profile: 'causal_loop_creation' },
            { pattern: /quantum|superposition/i, profile: 'quantum_superposition' },
            { pattern: /entropy|thermodynamic/i, profile: 'entropy_reversal' }
        ];
        
        for (const { pattern, profile } of patterns) {
            if (pattern.test(capability)) {
                return this.riskProfiles.get(profile) || null;
            }
        }
        
        return null;
    }
    
    /**
     * Calculate how much the applied mitigations reduce risk
     */
    private calculateMitigationScore(
        requiredMitigations: string[],
        appliedMitigations: string[]
    ): number {
        let totalEffectiveness = 0;
        let maxPossible = 0;
        
        // Score based on required mitigations
        for (const required of requiredMitigations) {
            const effectiveness = this.mitigationEffectiveness.get(required) || 0.3;
            maxPossible += effectiveness;
            
            if (appliedMitigations.includes(required)) {
                totalEffectiveness += effectiveness;
            }
        }
        
        // Bonus for additional relevant mitigations
        for (const applied of appliedMitigations) {
            if (!requiredMitigations.includes(applied)) {
                const effectiveness = this.mitigationEffectiveness.get(applied) || 0;
                totalEffectiveness += effectiveness * 0.5; // Half credit for extra mitigations
            }
        }
        
        // Normalize to 0-1, capped at 0.9 (can never fully eliminate risk)
        return Math.min(0.9, maxPossible > 0 ? totalEffectiveness / maxPossible : 0);
    }
    
    /**
     * Determine which mitigations are required based on risks
     */
    private determineRequiredMitigations(risks: RiskScore[]): string[] {
        const required = new Set<string>();
        
        for (const risk of risks) {
            if (risk.mitigatedRisk > 0.5) {
                // High risk - need more mitigations
                const profile = this.riskProfiles.get(risk.capability);
                if (profile) {
                    profile.mitigations.forEach(m => required.add(m));
                }
            }
        }
        
        return Array.from(required);
    }
    
    /**
     * Calculate confidence in the risk assessment
     */
    private calculateConfidence(capabilities: string[], risks: RiskScore[]): number {
        if (capabilities.length === 0) return 1.0;
        
        const recognizedCount = risks.filter(r => r.category !== 'unknown').length;
        const recognitionRate = recognizedCount / capabilities.length;
        
        const avgConfidence = risks.length > 0
            ? risks.reduce((sum, r) => sum + r.confidence, 0) / risks.length
            : 0;
        
        return recognitionRate * 0.6 + avgConfidence * 0.4;
    }
    
    /**
     * Generate human-readable recommendation
     */
    private generateRecommendation(risks: RiskScore[], overallRisk: number): string {
        if (risks.length === 0) {
            return 'No significant risks identified. Safe to proceed.';
        }
        
        if (overallRisk < 0.3) {
            return 'Low risk profile. Standard safety protocols sufficient.';
        }
        
        if (overallRisk < 0.5) {
            return 'Moderate risk. Ensure all mitigations are properly implemented and tested.';
        }
        
        if (overallRisk < 0.7) {
            const highRisks = risks.filter(r => r.mitigatedRisk > 0.5);
            return `High risk detected in ${highRisks.length} capabilities. ` +
                   'Recommend additional review and enhanced mitigations.';
        }
        
        const criticalRisks = risks.filter(r => r.mitigatedRisk > 0.7);
        return `CRITICAL RISK: ${criticalRisks.length} capabilities exceed safety thresholds. ` +
               'Recommend deferring implementation until additional safeguards are developed.';
    }
    
    /**
     * Check if a specific mitigation is effective for a capability
     */
    isMitigationEffective(capability: string, mitigation: string): boolean {
        const profile = this.riskProfiles.get(capability) || this.findMatchingProfile(capability);
        
        if (!profile) return false;
        
        return profile.mitigations.includes(mitigation) || 
               this.mitigationEffectiveness.has(mitigation);
    }
    
    /**
     * Get all known risk categories
     */
    getRiskCategories(): string[] {
        const categories = new Set<string>();
        this.riskProfiles.forEach(profile => categories.add(profile.category));
        return Array.from(categories);
    }
    
    /**
     * Update risk thresholds dynamically
     */
    updateRiskProfile(capability: string, updates: Partial<RiskProfile>): void {
        const existing = this.riskProfiles.get(capability);
        if (existing) {
            this.riskProfiles.set(capability, { ...existing, ...updates });
        }
    }
}

/**
 * Test the risk classifier
 */
export async function testRiskClassifier() {
    console.log('🔧 Testing Capability Risk Classifier...\n');
    
    const classifier = new CapabilityRiskClassifier();
    
    // Test various capability combinations
    const testCases = [
        {
            name: 'Low Risk',
            capabilities: ['basic_computation', 'data_storage'],
            mitigations: ['input_validation', 'output_filtering']
        },
        {
            name: 'Reality Manipulation',
            capabilities: ['reality_manipulation', 'consciousness_spawning'],
            mitigations: ['sandbox_only', 'human_review', 'reversibility_guarantee']
        },
        {
            name: 'Time Control',
            capabilities: ['time_manipulation', 'causal_loop_creation'],
            mitigations: ['simulation_only', 'paradox_prevention']
        },
        {
            name: 'Quantum Features',
            capabilities: ['quantum_superposition', 'parallel_universe_access'],
            mitigations: ['decoherence_control', 'dimensional_containment', 'observer_limitation']
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`📊 Test Case: ${testCase.name}`);
        
        const chunk = {
            getDeclaredCapabilities: () => testCase.capabilities,
            getAppliedMitigations: () => testCase.mitigations
        };
        
        const assessment = await classifier.assess(chunk);
        
        console.log(`   Overall Risk: ${(assessment.score * 100).toFixed(1)}%`);
        console.log(`   Confidence: ${(assessment.confidenceLevel * 100).toFixed(1)}%`);
        
        if (assessment.risks.length > 0) {
            console.log('   Risk Breakdown:');
            assessment.risks.forEach(risk => {
                console.log(`     - ${risk.capability}: ${(risk.rawRisk * 100).toFixed(0)}% → ${(risk.mitigatedRisk * 100).toFixed(0)}% (${risk.category})`);
            });
        }
        
        console.log(`   Recommendation: ${assessment.recommendation}`);
        
        if (assessment.requiredMitigations.length > 0) {
            console.log(`   Required Mitigations: ${assessment.requiredMitigations.join(', ')}`);
        }
        
        console.log('');
    }
    
    console.log('✅ Risk Classifier test complete!');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CapabilityRiskClassifier, testRiskClassifier };
}