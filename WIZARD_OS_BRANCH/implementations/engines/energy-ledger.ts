/**
 * ENERGY LEDGER
 * Tracks energy input → existence output efficiency for the Postnikov Ratchet
 * Ensures we're actually converting computational work into climbing progress
 */

export interface EnergyInputs {
    cpuCycles: bigint;
    memoryBytes: number;
    semanticGradient: number;
    networkEvents: number;
}

export interface EnergyOutputs {
    existenceTokens: number;
    averageCoherence: number;
    maxClimbHeight: number;
    bindingEnergy: number;
}

export interface EfficiencyMetrics {
    computational: number;  // tokens per cycle
    semantic: number;       // coherence per gradient
    temporal: number;       // height per event
    spatial: number;        // binding per byte
}

export interface EnergyLedgerEntry {
    chunkId: string;
    phase: 'open' | 'loose' | 'tight';
    timestamp: number;
    inputs: EnergyInputs;
    outputs: EnergyOutputs;
    efficiency: EfficiencyMetrics;
}

export interface ExistenceToken {
    id: string;
    coherence: number;
    level: number;
    bindingEnergy: number;
    created: number;
}

export class EnergyLedger {
    private entries: Map<string, EnergyLedgerEntry> = new Map();
    private baselineEfficiency: number = 0;
    private readonly BASELINE_WINDOW = 10; // Number of chunks to average for baseline
    
    /**
     * Start tracking energy for a chunk in a specific phase
     * Captures initial resource state
     */
    startTracking(chunkId: string, phase: 'open' | 'loose' | 'tight'): void {
        const initialInputs: EnergyInputs = {
            cpuCycles: process.cpuUsage().user + process.cpuUsage().system,
            memoryBytes: process.memoryUsage().heapUsed,
            semanticGradient: 0, // Will be measured during execution
            networkEvents: 0     // Will be counted during execution
        };
        
        this.entries.set(chunkId, {
            chunkId,
            phase,
            timestamp: Date.now(),
            inputs: initialInputs,
            outputs: {
                existenceTokens: 0,
                averageCoherence: 0,
                maxClimbHeight: 0,
                bindingEnergy: 0
            },
            efficiency: {
                computational: 0,
                semantic: 0,
                temporal: 0,
                spatial: 0
            }
        });
    }
    
    /**
     * Update semantic gradient measurement for active chunk
     */
    updateSemanticGradient(chunkId: string, gradient: number): void {
        const entry = this.entries.get(chunkId);
        if (!entry) throw new Error(`No entry for chunk ${chunkId}`);
        
        entry.inputs.semanticGradient = Math.max(entry.inputs.semanticGradient, gradient);
    }
    
    /**
     * Increment network event counter
     */
    recordNetworkEvent(chunkId: string): void {
        const entry = this.entries.get(chunkId);
        if (!entry) throw new Error(`No entry for chunk ${chunkId}`);
        
        entry.inputs.networkEvents++;
    }
    
    /**
     * Record outputs when chunk completes a phase
     */
    recordOutput(chunkId: string, tokens: ExistenceToken[]): void {
        const entry = this.entries.get(chunkId);
        if (!entry) throw new Error(`No entry for chunk ${chunkId}`);
        
        // Calculate final CPU cycles used
        const finalCpu = process.cpuUsage().user + process.cpuUsage().system;
        entry.inputs.cpuCycles = finalCpu - entry.inputs.cpuCycles;
        
        // Calculate final memory delta
        const finalMemory = process.memoryUsage().heapUsed;
        entry.inputs.memoryBytes = Math.abs(finalMemory - entry.inputs.memoryBytes);
        
        // Calculate output metrics
        entry.outputs = {
            existenceTokens: tokens.length,
            averageCoherence: tokens.length > 0 
                ? tokens.reduce((sum, t) => sum + t.coherence, 0) / tokens.length 
                : 0,
            maxClimbHeight: tokens.length > 0
                ? Math.max(...tokens.map(t => t.level))
                : 0,
            bindingEnergy: tokens.length > 0
                ? tokens.reduce((sum, t) => sum + t.bindingEnergy, 0) / tokens.length
                : 0
        };
        
        // Calculate efficiency metrics
        entry.efficiency = this.calculateEfficiency(entry);
        
        // Update baseline if needed
        this.updateBaseline();
    }
    
    /**
     * Calculate efficiency metrics for an entry
     * These ratios show how well we convert inputs to climbing progress
     */
    private calculateEfficiency(entry: EnergyLedgerEntry): EfficiencyMetrics {
        // Prevent division by zero
        const safeDivide = (num: number, den: number): number => {
            if (den === 0) return 0;
            return num / den;
        };
        
        return {
            computational: safeDivide(
                entry.outputs.existenceTokens, 
                Number(entry.inputs.cpuCycles)
            ),
            semantic: safeDivide(
                entry.outputs.averageCoherence,
                entry.inputs.semanticGradient
            ),
            temporal: safeDivide(
                entry.outputs.maxClimbHeight,
                entry.inputs.networkEvents + 1 // +1 to avoid division by zero
            ),
            spatial: safeDivide(
                entry.outputs.bindingEnergy,
                entry.inputs.memoryBytes
            )
        };
    }
    
    /**
     * Get efficiency for a specific chunk
     */
    getChunkEfficiency(chunkId: string): number {
        const entry = this.entries.get(chunkId);
        if (!entry) return 0;
        
        // Return weighted average of efficiency metrics
        return (
            entry.efficiency.computational * 0.4 +
            entry.efficiency.semantic * 0.3 +
            entry.efficiency.temporal * 0.2 +
            entry.efficiency.spatial * 0.1
        );
    }
    
    /**
     * Get global efficiency across recent chunks
     * This is our primary metric for ratchet health
     */
    getGlobalEfficiency(): number {
        const recentEntries = this.getRecentEntries(this.BASELINE_WINDOW);
        
        if (recentEntries.length === 0) return 0;
        
        const avgEfficiency = recentEntries
            .map(e => this.getChunkEfficiency(e.chunkId))
            .reduce((a, b) => a + b, 0) / recentEntries.length;
        
        return avgEfficiency;
    }
    
    /**
     * Get recent entries for analysis
     */
    private getRecentEntries(count: number): EnergyLedgerEntry[] {
        const allEntries = Array.from(this.entries.values());
        return allEntries
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, count);
    }
    
    /**
     * Update baseline efficiency based on recent performance
     */
    private updateBaseline(): void {
        const recentEntries = this.getRecentEntries(this.BASELINE_WINDOW);
        
        if (recentEntries.length >= 5) { // Need at least 5 entries for baseline
            this.baselineEfficiency = recentEntries
                .map(e => this.getChunkEfficiency(e.chunkId))
                .reduce((a, b) => a + b, 0) / recentEntries.length;
        }
    }
    
    /**
     * Get the current baseline efficiency
     */
    getBaselineEfficiency(): number {
        return this.baselineEfficiency;
    }
    
    /**
     * Check if a chunk meets efficiency requirements
     */
    meetsEfficiencyRequirements(chunkId: string): boolean {
        const efficiency = this.getChunkEfficiency(chunkId);
        
        // Must be at least 80% of baseline
        return efficiency >= this.baselineEfficiency * 0.8;
    }
    
    /**
     * Generate efficiency report for a phase
     */
    generatePhaseReport(phase: 'open' | 'loose' | 'tight'): any {
        const phaseEntries = Array.from(this.entries.values())
            .filter(e => e.phase === phase);
        
        if (phaseEntries.length === 0) {
            return { phase, message: 'No entries for this phase' };
        }
        
        const totalInputs = phaseEntries.reduce((acc, e) => ({
            cpuCycles: acc.cpuCycles + e.inputs.cpuCycles,
            memoryBytes: acc.memoryBytes + e.inputs.memoryBytes,
            semanticGradient: acc.semanticGradient + e.inputs.semanticGradient,
            networkEvents: acc.networkEvents + e.inputs.networkEvents
        }), {
            cpuCycles: 0n,
            memoryBytes: 0,
            semanticGradient: 0,
            networkEvents: 0
        });
        
        const totalOutputs = phaseEntries.reduce((acc, e) => ({
            existenceTokens: acc.existenceTokens + e.outputs.existenceTokens,
            totalCoherence: acc.totalCoherence + e.outputs.averageCoherence * e.outputs.existenceTokens,
            maxClimbHeight: Math.max(acc.maxClimbHeight, e.outputs.maxClimbHeight),
            totalBindingEnergy: acc.totalBindingEnergy + e.outputs.bindingEnergy * e.outputs.existenceTokens
        }), {
            existenceTokens: 0,
            totalCoherence: 0,
            maxClimbHeight: 0,
            totalBindingEnergy: 0
        });
        
        return {
            phase,
            chunkCount: phaseEntries.length,
            inputs: totalInputs,
            outputs: {
                ...totalOutputs,
                averageCoherence: totalOutputs.existenceTokens > 0 
                    ? totalOutputs.totalCoherence / totalOutputs.existenceTokens 
                    : 0,
                averageBindingEnergy: totalOutputs.existenceTokens > 0
                    ? totalOutputs.totalBindingEnergy / totalOutputs.existenceTokens
                    : 0
            },
            efficiency: {
                computational: Number(totalInputs.cpuCycles) > 0 
                    ? totalOutputs.existenceTokens / Number(totalInputs.cpuCycles) 
                    : 0,
                semantic: totalInputs.semanticGradient > 0
                    ? (totalOutputs.totalCoherence / totalOutputs.existenceTokens) / totalInputs.semanticGradient
                    : 0,
                temporal: totalInputs.networkEvents > 0
                    ? totalOutputs.maxClimbHeight / totalInputs.networkEvents
                    : 0,
                spatial: totalInputs.memoryBytes > 0
                    ? (totalOutputs.totalBindingEnergy / totalOutputs.existenceTokens) / totalInputs.memoryBytes
                    : 0
            }
        };
    }
    
    /**
     * Detect efficiency anomalies
     */
    detectAnomalies(): Array<{chunkId: string, issue: string}> {
        const anomalies: Array<{chunkId: string, issue: string}> = [];
        const baseline = this.getBaselineEfficiency();
        
        for (const [chunkId, entry] of this.entries) {
            const efficiency = this.getChunkEfficiency(chunkId);
            
            // Check for low efficiency
            if (baseline > 0 && efficiency < baseline * 0.5) {
                anomalies.push({
                    chunkId,
                    issue: `Efficiency ${(efficiency * 100).toFixed(2)}% below 50% of baseline`
                });
            }
            
            // Check for zero outputs
            if (entry.outputs.existenceTokens === 0 && entry.phase === 'tight') {
                anomalies.push({
                    chunkId,
                    issue: 'No existence tokens produced in tight phase'
                });
            }
            
            // Check for excessive resource usage
            if (Number(entry.inputs.cpuCycles) > 1e9) { // More than 1 billion cycles
                anomalies.push({
                    chunkId,
                    issue: 'Excessive CPU usage detected'
                });
            }
        }
        
        return anomalies;
    }
}

/**
 * Test the energy ledger
 */
export async function testEnergyLedger() {
    console.log('🔧 Testing Energy Ledger...\n');
    
    const ledger = new EnergyLedger();
    
    // Simulate chunk execution
    for (let i = 0; i < 5; i++) {
        const chunkId = `test-chunk-${i.toString().padStart(3, '0')}`;
        
        // Start tracking
        ledger.startTracking(chunkId, ['open', 'loose', 'tight'][i % 3] as any);
        
        // Simulate work
        await simulateChunkWork(ledger, chunkId);
        
        // Generate existence tokens
        const tokens = generateTestTokens(10 + i * 2);
        
        // Record outputs
        ledger.recordOutput(chunkId, tokens);
        
        const efficiency = ledger.getChunkEfficiency(chunkId);
        console.log(`Chunk ${chunkId}: efficiency = ${(efficiency * 100).toFixed(2)}%`);
    }
    
    // Global metrics
    console.log(`\n📊 Global Efficiency: ${(ledger.getGlobalEfficiency() * 100).toFixed(2)}%`);
    console.log(`   Baseline: ${(ledger.getBaselineEfficiency() * 100).toFixed(2)}%`);
    
    // Phase report
    const phaseReport = ledger.generatePhaseReport('open');
    console.log('\n📈 Open Phase Report:');
    console.log(`   Chunks: ${phaseReport.chunkCount}`);
    console.log(`   Tokens generated: ${phaseReport.outputs.existenceTokens}`);
    console.log(`   Average coherence: ${phaseReport.outputs.averageCoherence.toFixed(3)}`);
    console.log(`   Max climb height: ${phaseReport.outputs.maxClimbHeight}`);
    
    // Check for anomalies
    const anomalies = ledger.detectAnomalies();
    if (anomalies.length > 0) {
        console.log('\n⚠️  Anomalies detected:');
        anomalies.forEach(a => console.log(`   ${a.chunkId}: ${a.issue}`));
    }
    
    console.log('\n✅ Energy Ledger test complete!');
}

/**
 * Simulate chunk work
 */
async function simulateChunkWork(ledger: EnergyLedger, chunkId: string): Promise<void> {
    // Update semantic gradient
    ledger.updateSemanticGradient(chunkId, Math.random() * 10);
    
    // Record some network events
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        ledger.recordNetworkEvent(chunkId);
    }
    
    // Simulate CPU work
    const start = Date.now();
    let sum = 0;
    while (Date.now() - start < 10) {
        for (let i = 0; i < 1000; i++) {
            sum += Math.sqrt(i);
        }
    }
}

/**
 * Generate test existence tokens
 */
function generateTestTokens(count: number): ExistenceToken[] {
    const tokens: ExistenceToken[] = [];
    
    for (let i = 0; i < count; i++) {
        tokens.push({
            id: `token-${Date.now()}-${i}`,
            coherence: 0.7 + Math.random() * 0.3,
            level: Math.floor(Math.random() * 10) + 1,
            bindingEnergy: Math.random() * 100,
            created: Date.now()
        });
    }
    
    return tokens;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnergyLedger, testEnergyLedger };
}