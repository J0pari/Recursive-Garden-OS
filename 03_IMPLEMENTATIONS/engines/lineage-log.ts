/**
 * Lineage Log: Append-only evolutionary history tracker
 * Implements INV-AUDIT-001 from CHARTER
 */

import { appendFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface LineageEvent {
  timestamp: number;
  type: 'DIVISION' | 'FUSION' | 'MUTATION' | 'EXTINCTION';
  parentId: string;
  childIds?: string[];
  invariantProofs: Record<string, boolean>;
  energyBefore: number;
  energyAfter: number;
  metadata?: any;
}

export class LineageLog {
  private readonly logPath: string;
  
  constructor(logDir: string = './logs') {
    this.logPath = join(logDir, `lineage-${Date.now()}.jsonl`);
  }
  
  append(event: LineageEvent): void {
    const line = JSON.stringify(event) + '\n';
    appendFileSync(this.logPath, line, 'utf8');
  }
  
  query(filter: Partial<LineageEvent>): LineageEvent[] {
    if (!existsSync(this.logPath)) return [];
    
    const lines = readFileSync(this.logPath, 'utf8').split('\n').filter(l => l);
    return lines
      .map(l => JSON.parse(l) as LineageEvent)
      .filter(e => Object.entries(filter).every(([k, v]) => e[k as keyof LineageEvent] === v));
  }
  
  getLineage(chunkId: string): LineageEvent[] {
    const events: LineageEvent[] = [];
    const seen = new Set<string>();
    const queue = [chunkId];
    
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (seen.has(id)) continue;
      seen.add(id);
      
      const parentEvents = this.query({ childIds: [id] } as any);
      events.push(...parentEvents);
      queue.push(...parentEvents.map(e => e.parentId));
    }
    
    return events.sort((a, b) => a.timestamp - b.timestamp);
  }
}