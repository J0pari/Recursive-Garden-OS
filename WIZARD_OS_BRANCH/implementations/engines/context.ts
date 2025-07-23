/**
 * Context & Adapter System: The geometric substrate for parallel transport
 * Implements manifold structure for idea evolution
 */

export interface Constraint {
  type: 'equality' | 'inequality' | 'boundary';
  expression: string;
  validate: (state: any) => boolean;
}

export interface Context {
  id: string;
  basis: string[];  // Feature dimensions this context cares about
  constraints: Constraint[];
  metric?: (a: any, b: any) => number;  // Distance function in this context
}

export interface CoreState {
  essence: Record<string, any>;  // Invariant core
  energy: number;
  wobble: number;
}

export interface ViewState {
  projection: Record<string, any>;  // Context-specific view
  contextId: string;
  timestamp: number;
}

export interface PreservationReport {
  invariantId: string;
  preserved: boolean;
  drift: number;
  details?: string;
}

export interface Adapter {
  fromContext: string;
  toContext: string;
  
  forward(core: CoreState, fromCtx: Context, toCtx: Context): ViewState;
  backward?(view: ViewState, fromCtx: Context, toCtx: Context): CoreState;
  
  preservationCheck(
    before: CoreState,
    after: CoreState,
    invariants: string[]
  ): PreservationReport[];
}

export class AdapterRegistry {
  private adapters = new Map<string, Adapter>();
  private contexts = new Map<string, Context>();
  
  registerContext(ctx: Context): void {
    this.contexts.set(ctx.id, ctx);
  }
  
  registerAdapter(adapter: Adapter): void {
    const key = `${adapter.fromContext}->${adapter.toContext}`;
    this.adapters.set(key, adapter);
  }
  
  getAdapter(from: string, to: string): Adapter | undefined {
    return this.adapters.get(`${from}->${to}`);
  }
  
  getContext(id: string): Context | undefined {
    return this.contexts.get(id);
  }
  
  findPath(from: string, to: string): string[] | null {
    // Simple BFS for adapter path
    const queue: string[][] = [[from]];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];
      
      if (current === to) return path;
      if (visited.has(current)) continue;
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