/**
 * PROPERTY SATISFACTION CRITERIA
 * Replaces token count coercion with meaningful completion metrics
 * A chunk is complete when it satisfies properties, not when it hits a token count
 */

import { WobbleMonitor } from './wobble-monitor';
import { SheafHarness } from './sheaf-harness';
import { EnergyLedger } from './energy-ledger';
import { NumericalStabilityHarness } from './numerical-stability';
import { CapabilityRiskClassifier } from './risk-classifier';

export interface PropertyCriterion {
    name: string;
    test: (chunk: any) => Promise<boolean>;
    required: boolean;
    description: string;
}

export interface PropertyResult {
    name: string;
    passed: boolean;
    required: boolean;
    details?: any;
}

export interface CompletionReport {
    complete: boolean;
    results: PropertyResult[];
    tokenCount: number;        // Descriptive only, not prescriptive
    recommendation: string;
    missingRequired: string[];
    satisfactionScore: number;  // 0-1, percentage of properties satisfied
}

export class PropertySatisfactionChecker {
    private wobbleMonitor: WobbleMonitor;
    private sheafHarness: SheafHarness;
    private energyLedger: EnergyLedger;
    private stabilityHarness: NumericalStabilityHarness;
    private riskClassifier: CapabilityRiskClassifier;
    
    private baselineEfficiency: number = 0.1; // Will be updated from actual data
    private riskThreshold: number = 0.3;      // Maximum acceptable risk score
    private existingChunks: any[] = [];       // Will be populated during operation
    
    /**
     * Core property criteria that determine chunk completion
     * These replace arbitrary token counts with meaningful requirements
     */
    private criteria: PropertyCriterion[] = [
        {
            name: 'gluing_coherence',
            description: 'Chunk interfaces must satisfy sheaf cocycle conditions',
            test: async (chunk) => {
                if (this.existingChunks.length === 0) {
                    // First chunk always passes gluing test
                    return true;
                }
                const proof = await this.sheafHarness.verifyChunkCoherence(chunk, this.existingChunks);
                return proof.valid;
            },
            required: true
        },
        {
            name: 'wobble_tolerance',
            description: 'Semantic variance must be within 9° ± 2° for productive climbing',
            test: async (chunk) => {
                const metrics = await this.wobbleMonitor.measureEffectiveWobble(chunk);
                return metrics.withinTolerance;
            },
            required: true
        },
        {
            name: 'energy_efficiency',
            description: 'Energy-to-existence conversion must meet baseline efficiency',
            test: async (chunk) => {
                const efficiency = this.energyLedger.getChunkEfficiency(chunk.id);
                return efficiency > this.baselineEfficiency;
            },
            required: true
        },
        {
            name: 'numerical_stability',
            description: 'Numerical errors must remain within acceptable bounds',
            test: async (chunk) => {
                const report = this.stabilityHarness.trackChunkErrors(chunk);
                return report.withinBounds;
            },
            required: true
        },
        {
            name: 'risk_assessment',
            description: 'Capability risks must be below threshold with mitigations',
            test: async (chunk) => {
                const risk = await this.riskClassifier.assess(chunk);
                return risk.score < this.riskThreshold;
            },
            required: true
        },
        {
            name: 'semantic_density',
            description: 'Code must have sufficient semantic content (not just boilerplate)',
            test: async (chunk) => {
                const density = await this.measureSemanticDensity(chunk);
                return density > 0.7; // 70% meaningful content
            },
            required: false
        },
        {
            name: 'interface_completeness',
            description: 'All declared interfaces must be fully implemented',
            test: async (chunk) => {
                return this.checkInterfaceCompleteness(chunk);
            },
            required: true
        },
        {
            name: 'documentation_coverage',
            description: 'Critical functions must have documentation',
            test: async (chunk) => {
                const coverage = await this.measureDocumentationCoverage(chunk);
                return coverage > 0.8; // 80% of critical functions documented
            },
            required: false
        },
        {
            name: 'test_coverage',
            description: 'Core functionality must have test coverage',
            test: async (chunk) => {
                const coverage = await this.measureTestCoverage(chunk);
                return coverage > 0.6; // 60% test coverage
            },
            required: false
        },
        {
            name: 'coherence_maintenance',
            description: 'Chunk must maintain global system coherence',
            test: async (chunk) => {
                const coherence = await this.measureGlobalCoherence(chunk);
                return coherence > 0.9; // 90% coherence score
            },
            required: true
        }
    ];
    
    constructor(
        wobbleMonitor: WobbleMonitor,
        sheafHarness: SheafHarness,
        energyLedger: EnergyLedger,
        stabilityHarness: NumericalStabilityHarness,
        riskClassifier: CapabilityRiskClassifier
    ) {
        this.wobbleMonitor = wobbleMonitor;
        this.sheafHarness = sheafHarness;
        this.energyLedger = energyLedger;
        this.stabilityHarness = stabilityHarness;
        this.riskClassifier = riskClassifier;
    }
    
    /**
     * Check if a chunk satisfies all completion criteria
     * This is the new definition of "done" - not token count
     */
    async checkCompletion(chunk: any): Promise<CompletionReport> {
        const results = await Promise.all(
            this.criteria.map(async (criterion) => {
                try {
                    const passed = await criterion.test(chunk);
                    return {
                        name: criterion.name,
                        passed,
                        required: criterion.required,
                        details: { description: criterion.description }
                    };
                } catch (error) {
                    // Test failure counts as not passing
                    return {
                        name: criterion.name,
                        passed: false,
                        required: criterion.required,
                        details: { 
                            description: criterion.description,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        }
                    };
                }
            })
        );
        
        const requiredPassing = results
            .filter(r => r.required)
            .every(r => r.passed);
        
        const missingRequired = results
            .filter(r => r.required && !r.passed)
            .map(r => r.name);
        
        const satisfactionScore = results
            .filter(r => r.passed).length / results.length;
        
        return {
            complete: requiredPassing,
            results,
            tokenCount: chunk.getTokenCount(), // Informational only
            missingRequired,
            satisfactionScore,
            recommendation: this.generateRecommendation(results, chunk.getTokenCount())
        };
    }
    
    /**
     * Generate actionable recommendation based on property satisfaction
     */
    private generateRecommendation(results: PropertyResult[], tokenCount: number): string {
        const failed = results.filter(r => !r.passed);
        const failedRequired = failed.filter(r => r.required);
        
        if (failedRequired.length === 0) {
            return 'Ready for integration - all required properties satisfied';
        }
        
        const recommendations: string[] = [`Failed ${failedRequired.length} required properties:`];
        
        for (const failure of failedRequired) {
            switch (failure.name) {
                case 'gluing_coherence':
                    recommendations.push('- Fix interface mismatches with neighboring chunks');
                    break;
                case 'wobble_tolerance':
                    recommendations.push('- Adjust semantic variance to achieve 9° ± 2° wobble');
                    break;
                case 'energy_efficiency':
                    recommendations.push('- Optimize code to improve existence token generation');
                    break;
                case 'numerical_stability':
                    recommendations.push('- Fix numerical operations causing error accumulation');
                    break;
                case 'risk_assessment':
                    recommendations.push('- Add mitigations for high-risk capabilities');
                    break;
                case 'interface_completeness':
                    recommendations.push('- Implement all declared interface methods');
                    break;
                case 'coherence_maintenance':
                    recommendations.push('- Ensure chunk maintains global system coherence');
                    break;
            }
        }
        
        // Add token count info without making it prescriptive
        if (tokenCount < 18000) {
            recommendations.push(`\nNote: Current token count (${tokenCount}) is below typical range, but completion is determined by properties, not size.`);
        }
        
        return recommendations.join('\n');
    }
    
    /**
     * Measure semantic density of code
     * High density = meaningful code, low density = boilerplate
     */
    private async measureSemanticDensity(chunk: any): Promise<number> {
        const code = chunk.getCode?.() || '';
        
        // Simple heuristic: ratio of meaningful tokens to total tokens
        const meaningfulPatterns = [
            /class\s+\w+/g,
            /function\s+\w+/g,
            /const\s+\w+\s*=/g,
            /interface\s+\w+/g,
            /return\s+[^;]+/g,
            /if\s*\([^)]+\)/g,
            /for\s*\([^)]+\)/g,
            /\w+\.\w+\(/g,  // method calls
            /new\s+\w+/g,   // instantiation
        ];
        
        let meaningfulTokens = 0;
        for (const pattern of meaningfulPatterns) {
            const matches = code.match(pattern);
            meaningfulTokens += matches?.length || 0;
        }
        
        const totalTokens = code.split(/\s+/).length;
        
        return totalTokens > 0 ? Math.min(1, meaningfulTokens / (totalTokens * 0.1)) : 0;
    }
    
    /**
     * Check if all declared interfaces are implemented
     */
    private async checkInterfaceCompleteness(chunk: any): Promise<boolean> {
        const interfaces = chunk.getDeclaredInterfaces?.() || [];
        const implementations = chunk.getImplementations?.() || [];
        
        // Every declared interface must have an implementation
        for (const iface of interfaces) {
            const hasImpl = implementations.some(impl => 
                impl.implements === iface.name &&
                impl.methods.length >= iface.methods.length
            );
            
            if (!hasImpl) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Measure documentation coverage
     */
    private async measureDocumentationCoverage(chunk: any): Promise<number> {
        const functions = chunk.getFunctions?.() || [];
        const documented = functions.filter(f => f.hasDocumentation).length;
        
        return functions.length > 0 ? documented / functions.length : 1;
    }
    
    /**
     * Measure test coverage
     */
    private async measureTestCoverage(chunk: any): Promise<number> {
        const functions = chunk.getFunctions?.() || [];
        const tested = functions.filter(f => f.hasTests).length;
        
        return functions.length > 0 ? tested / functions.length : 0;
    }
    
    /**
     * Measure how well chunk maintains global coherence
     */
    private async measureGlobalCoherence(chunk: any): Promise<number> {
        // Simplified coherence check
        const hasProperExports = chunk.getExports?.().length > 0;
        const hasProperImports = chunk.getImports?.().every(i => i.isValid);
        const maintainsInvariants = chunk.checkInvariants?.() ?? true;
        
        const score = [
            hasProperExports ? 0.4 : 0,
            hasProperImports ? 0.3 : 0,
            maintainsInvariants ? 0.3 : 0
        ].reduce((a, b) => a + b, 0);
        
        return score;
    }
    
    /**
     * Update configuration based on system state
     */
    updateConfiguration(config: {
        baselineEfficiency?: number;
        riskThreshold?: number;
        existingChunks?: any[];
    }): void {
        if (config.baselineEfficiency !== undefined) {
            this.baselineEfficiency = config.baselineEfficiency;
        }
        if (config.riskThreshold !== undefined) {
            this.riskThreshold = config.riskThreshold;
        }
        if (config.existingChunks !== undefined) {
            this.existingChunks = config.existingChunks;
        }
    }
    
    /**
     * Get summary of all criteria
     */
    getCriteriaSummary(): Array<{name: string, required: boolean, description: string}> {
        return this.criteria.map(c => ({
            name: c.name,
            required: c.required,
            description: c.description
        }));
    }
}

/**
 * Test the property satisfaction system
 */
export async function testPropertySatisfaction() {
    console.log('🔧 Testing Property Satisfaction Checker...\n');
    
    // Create mock dependencies
    const wobbleMonitor = new WobbleMonitor();
    const sheafHarness = new SheafHarness();
    const energyLedger = new EnergyLedger();
    const stabilityHarness = new NumericalStabilityHarness();
    const riskClassifier = new (await import('./risk-classifier')).CapabilityRiskClassifier();
    
    const checker = new PropertySatisfactionChecker(
        wobbleMonitor,
        sheafHarness,
        energyLedger,
        stabilityHarness,
        riskClassifier
    );
    
    // Create test chunk
    const testChunk = {
        id: 'test-chunk-001',
        getTokenCount: () => 19500,
        getCode: () => 'class TestClass { constructor() {} method() { return 42; } }',
        getDeclaredInterfaces: () => [{ name: 'ITest', methods: ['method'] }],
        getImplementations: () => [{ implements: 'ITest', methods: ['method'] }],
        getFunctions: () => [
            { name: 'method', hasDocumentation: true, hasTests: true }
        ],
        getExports: () => ['TestClass'],
        getImports: () => [{ module: 'core', isValid: true }],
        checkInvariants: () => true,
        getDeclaredCapabilities: () => ['basic_computation'],
        getAppliedMitigations: () => ['input_validation'],
        inputSpace: { dimensions: 128 },
        boundaryOperator: async (input: any) => ({ 
            semantic: new Float32Array(128), 
            modal: 0,
            coherence: 0.9
        }),
        restrictTo: () => ({
            data: { semantic: new Float32Array(128) },
            domain: {}
        }),
        getNumericalOperations: () => []
    };
    
    // Run completion check
    const report = await checker.checkCompletion(testChunk);
    
    console.log('📊 Completion Report:');
    console.log(`   Complete: ${report.complete ? '✓' : '✗'}`);
    console.log(`   Satisfaction Score: ${(report.satisfactionScore * 100).toFixed(1)}%`);
    console.log(`   Token Count: ${report.tokenCount} (informational)`);
    
    console.log('\n   Property Results:');
    for (const result of report.results) {
        const symbol = result.passed ? '✓' : '✗';
        const required = result.required ? ' (required)' : '';
        console.log(`   ${symbol} ${result.name}${required}`);
    }
    
    if (report.missingRequired.length > 0) {
        console.log(`\n   Missing Required: ${report.missingRequired.join(', ')}`);
    }
    
    console.log(`\n   Recommendation:\n   ${report.recommendation}`);
    
    console.log('\n✅ Property Satisfaction test complete!');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PropertySatisfactionChecker, testPropertySatisfaction };
}