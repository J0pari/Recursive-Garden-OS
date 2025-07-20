"use strict";
/**
 * Curvature Map: Tracks geometric distortion statistics across context edges
 * High curvature = high holonomy = areas needing adapter refinement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureMap = void 0;
class CurvatureMap {
    edges = new Map();
    maxSamples = 100;
    updateFromHolonomy(report) {
        // Extract pairwise distortions from the loop
        for (let i = 0; i < report.path.length - 1; i++) {
            const from = report.path[i];
            const to = report.path[i + 1];
            const distortion = report.stepDistortions[i] || 0;
            this.updateEdge(from, to, distortion);
        }
    }
    updateEdge(from, to, distortion) {
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
        const newVariance = (existing.varianceDistortion * (existing.sampleCount - 1) +
            delta * delta2) / existing.sampleCount;
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
    getHighCurvatureEdges(threshold = 0.5) {
        return Array.from(this.edges.values())
            .filter(e => e.meanDistortion > threshold)
            .sort((a, b) => b.meanDistortion - a.meanDistortion);
    }
    getEdgeStats(from, to) {
        return this.edges.get(`${from}->${to}`);
    }
    getTotalCurvature() {
        let total = 0;
        for (const edge of this.edges.values()) {
            total += edge.meanDistortion * edge.sampleCount;
        }
        return total;
    }
    getHeatmapData() {
        const maxDistortion = Math.max(...Array.from(this.edges.values()).map(e => e.meanDistortion), 1);
        return Array.from(this.edges.values()).map(e => ({
            from: e.fromContext,
            to: e.toContext,
            intensity: e.meanDistortion / maxDistortion
        }));
    }
    serialize() {
        return JSON.stringify(Array.from(this.edges.entries()), null, 2);
    }
    static deserialize(data) {
        const map = new CurvatureMap();
        const entries = JSON.parse(data);
        for (const [key, stats] of entries) {
            map.edges.set(key, stats);
        }
        return map;
    }
}
exports.CurvatureMap = CurvatureMap;
