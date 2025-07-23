/**
 * Curvature Map: Tracks geometric distortion statistics across context edges
 * High curvature = high holonomy = areas needing adapter refinement
 */

import { HolonomyReport } from './transport-loop.js';

interface EdgeStats {
  fromContext: string;
  toContext: string;
  sampleCount: number;
  meanDistortion: number;
  varianceDistortion: number;
  maxDistortion: number;
  lastUpdated: number;
  recentSamples: number[];  // Ring buffer of last N
}

export class CurvatureMap {
  private edges = new Map<string, EdgeStats>();
  private readonly maxSamples = 100;
  
  updateFromHolonomy(report: HolonomyReport): void {
    // Extract pairwise distortions from the loop
    for (let i = 0; i < report.path.length - 1; i++) {
      const from = report.path[i];
      const to = report.path[i + 1];
      const distortion = report.stepDistortions[i] || 0;
      
      this.updateEdge(from, to, distortion);
    }
  }
  
  updateEdge(from: string, to: string, distortion: number): void {
    const key = `${from}->${to}`;
    const existing = this.edges.get(key);
    
    if (!existing) {
      this.edges.set(key, {
        fromContext: from,
        toContext: to,
        sampleCount: 1,
        meanDistortion: distortion,
        varianceDistortion: 0,
        maxDistortion: distortion,
        lastUpdated: Date.now(),
        recentSamples: [distortion]
      });
      return;
    }
    
    // Update statistics incrementally
    const newCount = existing.sampleCount + 1;
    const delta = distortion - existing.meanDistortion;
    const newMean = existing.meanDistortion + delta / newCount;
    const delta2 = distortion - newMean;
    const newVariance = (
      existing.varianceDistortion * (existing.sampleCount - 1) +
      delta * delta2
    ) / existing.sampleCount;
    
    // Update ring buffer
    if (existing.recentSamples.length >= this.maxSamples) {
      existing.recentSamples.shift();
    }
    existing.recentSamples.push(distortion);
    
    existing.sampleCount = newCount;
    existing.meanDistortion = newMean;
    existing.varianceDistortion = newVariance;
    existing.maxDistortion = Math.max(existing.maxDistortion, distortion);
    existing.lastUpdated = Date.now();
  }
  
  getHighCurvatureEdges(threshold: number = 0.5): EdgeStats[] {
    return Array.from(this.edges.values())
      .filter(e => e.meanDistortion > threshold)
      .sort((a, b) => b.meanDistortion - a.meanDistortion);
  }
  
  getEdgeStats(from: string, to: string): EdgeStats | undefined {
    return this.edges.get(`${from}->${to}`);
  }
  
  getTotalCurvature(): number {
    let total = 0;
    for (const edge of this.edges.values()) {
      total += edge.meanDistortion * edge.sampleCount;
    }
    return total;
  }
  
  getHeatmapData(): Array<{
    from: string;
    to: string;
    intensity: number;  // [0, 1]
  }> {
    const maxDistortion = Math.max(
      ...Array.from(this.edges.values()).map(e => e.meanDistortion),
      1
    );
    
    return Array.from(this.edges.values()).map(e => ({
      from: e.fromContext,
      to: e.toContext,
      intensity: e.meanDistortion / maxDistortion
    }));
  }
  
  serialize(): string {
    return JSON.stringify(
      Array.from(this.edges.entries()),
      null,
      2
    );
  }
  
  static deserialize(data: string): CurvatureMap {
    const map = new CurvatureMap();
    const entries = JSON.parse(data) as Array<[string, EdgeStats]>;
    for (const [key, stats] of entries) {
      map.edges.set(key, stats);
    }
    return map;
  }
}