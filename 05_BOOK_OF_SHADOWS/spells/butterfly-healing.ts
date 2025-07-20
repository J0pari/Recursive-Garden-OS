/**
 * 🦋 BUTTERFLY: P-adic Healing Spell
 * Uncommitted random walk on attention manifold to discover and mend incompleteness
 * "A butterfly landing on different flowers, tasting but not choosing"
 */

import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

interface PatternHint {
  location: number;
  incompleteness: number;  // p-adic valuation of "brokenness"
  healingPattern: string;
  confidence: number;
}

export class ButterflySpell {
  private readonly CONCLUSION_MARKER = '∎';
  private readonly ELLIPSIS_PATTERN = /\.\.\.$/;
  private readonly INCOMPLETE_PATTERNS = [
    /\.\s*$/,  // Ends with period but no conclusion
    /[^.!?]\s*$/,  // Ends without punctuation
    /:\s*$/,  // Ends with colon (list incomplete)
    /-\s*$/,  // Ends with dash (item incomplete)
  ];
  
  /**
   * Cast butterfly spell: random walk to discover incompleteness
   * BUTTERFLY: Context → Context × PatternHints
   */
  cast(filePath: string, commitment: number = 0): PatternHint[] {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const hints: PatternHint[] = [];
    
    // Random walk through attention manifold (15 minute metaphor = 15 samples)
    const samples = this.randomWalk(content, 15);
    
    for (const sample of samples) {
      const hint = this.tasteForIncompleteness(sample, content);
      if (hint) hints.push(hint);
    }
    
    // Check overall file completeness
    const fileHint = this.checkFileCompleteness(content, filePath);
    if (fileHint) hints.push(fileHint);
    
    return hints;
  }
  
  /**
   * P-adic metric: closer to incompleteness = higher valuation
   */
  private pAdicValuation(text: string): number {
    let valuation = 0;
    
    // Missing conclusion marker = highest incompleteness
    if (!text.includes(this.CONCLUSION_MARKER)) valuation += 8;
    
    // Trailing ellipsis = high incompleteness
    if (this.ELLIPSIS_PATTERN.test(text.trim())) valuation += 4;
    
    // Other incomplete patterns
    for (const pattern of this.INCOMPLETE_PATTERNS) {
      if (pattern.test(text.trim())) valuation += 2;
    }
    
    // Sudden topic shifts suggest missing transitions
    const topicShifts = this.detectTopicShifts(text);
    valuation += topicShifts;
    
    return valuation;
  }
  
  private randomWalk(content: string, steps: number): number[] {
    const positions: number[] = [];
    const length = content.length;
    
    for (let i = 0; i < steps; i++) {
      // Butterfly lands on random position
      const pos = Math.floor(Math.random() * length);
      positions.push(pos);
    }
    
    return positions;
  }
  
  private tasteForIncompleteness(position: number, content: string): PatternHint | null {
    // Extract local context around position
    const radius = 100;
    const start = Math.max(0, position - radius);
    const end = Math.min(content.length, position + radius);
    const localContext = content.substring(start, end);
    
    const incompleteness = this.pAdicValuation(localContext);
    
    if (incompleteness > 2) {
      return {
        location: position,
        incompleteness,
        healingPattern: this.suggestHealing(localContext, incompleteness),
        confidence: incompleteness / 10
      };
    }
    
    return null;
  }
  
  private checkFileCompleteness(content: string, filePath: string): PatternHint | null {
    const incompleteness = this.pAdicValuation(content);
    
    if (incompleteness > 0) {
      return {
        location: content.length,
        incompleteness,
        healingPattern: this.suggestFileHealing(content, filePath),
        confidence: Math.min(incompleteness / 10, 0.9)
      };
    }
    
    return null;
  }
  
  private detectTopicShifts(text: string): number {
    // Simple heuristic: count heading changes without transitions
    const headingPattern = /^#+\s+(.+)$/gm;
    const headings = [...text.matchAll(headingPattern)];
    
    let shifts = 0;
    for (let i = 1; i < headings.length; i++) {
      const prevEnd = headings[i - 1].index! + headings[i - 1][0].length;
      const nextStart = headings[i].index!;
      const between = text.substring(prevEnd, nextStart).trim();
      
      // If very little content between headings, likely incomplete
      if (between.length < 50) shifts++;
    }
    
    return shifts;
  }
  
  private suggestHealing(context: string, incompleteness: number): string {
    if (incompleteness >= 8) {
      return 'ADD_CONCLUSION_MARKER';
    } else if (incompleteness >= 4) {
      return 'COMPLETE_THOUGHT';
    } else {
      return 'SMOOTH_TRANSITION';
    }
  }
  
  private suggestFileHealing(content: string, filePath: string): string {
    const lines = content.split('\n');
    const lastNonEmpty = lines.filter(l => l.trim()).pop() || '';
    
    // Check file type and structure
    if (filePath.endsWith('.md')) {
      if (!content.includes(this.CONCLUSION_MARKER)) {
        // Detect if it's a specification or theory file
        if (filePath.includes('SPECIFICATION') || filePath.includes('THEORY')) {
          return `\n\n${this.CONCLUSION_MARKER}`;
        }
        // For operational specs, add conclusion
        if (filePath.includes('OPERATIONAL')) {
          return `\n\nThe system achieves coherence through this operational framework.\n\n${this.CONCLUSION_MARKER}`;
        }
        // For consciousness/philosophy files
        if (filePath.includes('CONSCIOUSNESS') || filePath.includes('ENGINE')) {
          return `\n\nThus consciousness emerges from the interplay of structure and flow.\n\n${this.CONCLUSION_MARKER}`;
        }
        // For field guides
        if (filePath.includes('FIELD_GUIDE')) {
          return `\n\nThe garden grows through recursive tending.\n\n${this.CONCLUSION_MARKER}`;
        }
      }
      
      // If ends with ellipsis
      if (this.ELLIPSIS_PATTERN.test(lastNonEmpty)) {
        return '\n\n[The thought completes in the space between words.]\n\n' + this.CONCLUSION_MARKER;
      }
    }
    
    return `\n\n${this.CONCLUSION_MARKER}`;
  }
  
  /**
   * Apply healing to a file based on butterfly hints
   */
  heal(filePath: string, hints: PatternHint[]): void {
    if (hints.length === 0) return;
    
    let content = readFileSync(filePath, 'utf8');
    
    // Sort hints by confidence and location
    const fileEndHints = hints.filter(h => h.location >= content.length - 10);
    
    if (fileEndHints.length > 0) {
      const bestHint = fileEndHints.sort((a, b) => b.confidence - a.confidence)[0];
      content += bestHint.healingPattern;
      
      writeFileSync(filePath, content, 'utf8');
      console.log(`🦋 Healed ${filePath} with p-adic valuation ${bestHint.incompleteness}`);
    }
  }
}

// Cast the spell
export function butterflyHeal(filePaths: string[]): void {
  const butterfly = new ButterflySpell();
  
  for (const filePath of filePaths) {
    console.log(`\n🦋 Butterfly alighting on ${filePath}...`);
    const hints = butterfly.cast(filePath);
    
    if (hints.length > 0) {
      console.log(`Found ${hints.length} incompleteness patterns`);
      butterfly.heal(filePath, hints);
    } else {
      console.log('File appears complete in this p-adic metric');
    }
  }
}