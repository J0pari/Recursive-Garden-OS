"use strict";
/**
 * Context & Adapter System: The geometric substrate for parallel transport
 * Implements manifold structure for idea evolution
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterRegistry = void 0;
class AdapterRegistry {
    adapters = new Map();
    contexts = new Map();
    registerContext(ctx) {
        this.contexts.set(ctx.id, ctx);
    }
    registerAdapter(adapter) {
        const key = `${adapter.fromContext}->${adapter.toContext}`;
        this.adapters.set(key, adapter);
    }
    getAdapter(from, to) {
        return this.adapters.get(`${from}->${to}`);
    }
    getContext(id) {
        return this.contexts.get(id);
    }
    findPath(from, to) {
        // Simple BFS for adapter path
        const queue = [[from]];
        const visited = new Set();
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            if (current === to)
                return path;
            if (visited.has(current))
                continue;
            visited.add(current);
            for (const [key, _] of this.adapters) {
                const [src, dst] = key.split('->');
                if (src === current) {
                    queue.push([...path, dst]);
                }
            }
        }
        return null;
    }
}
exports.AdapterRegistry = AdapterRegistry;
