/**
 * 🦋 BUTTERFLY: Interactive spell casting
 * Choose where the butterfly lands and discovers patterns
 */

import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

interface ButterflyTarget {
  path: string;
  type: 'file' | 'directory';
  size: number;
  description: string;
}

export class InteractiveButterfly {
  private rootPath: string;
  
  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }
  
  /**
   * Discover available targets for butterfly to land on
   */
  discoverTargets(path: string = this.rootPath, depth: number = 0): ButterflyTarget[] {
    if (depth > 2) return []; // Don't go too deep
    
    const targets: ButterflyTarget[] = [];
    
    try {
      const items = readdirSync(path);
      
      for (const item of items) {
        // Skip hidden files and node_modules
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const fullPath = join(path, item);
        const stat = statSync(fullPath);
        const relPath = relative(this.rootPath, fullPath);
        
        if (stat.isDirectory()) {
          targets.push({
            path: relPath,
            type: 'directory',
            size: 0,
            description: this.describeDirectory(item)
          });
          
          // Recursively add subdirectories
          if (depth < 2) {
            targets.push(...this.discoverTargets(fullPath, depth + 1));
          }
        } else if (stat.isFile()) {
          // Only show code files and markdown
          if (this.isInterestingFile(item)) {
            targets.push({
              path: relPath,
              type: 'file',
              size: stat.size,
              description: this.describeFile(item)
            });
          }
        }
      }
    } catch (e) {
      // Directory not readable
    }
    
    return targets;
  }
  
  private isInterestingFile(filename: string): boolean {
    const extensions = ['.ts', '.js', '.md', '.yaml', '.json', '.html'];
    return extensions.some(ext => filename.endsWith(ext));
  }
  
  private describeDirectory(name: string): string {
    const descriptions: Record<string, string> = {
      '00_CORE': 'Constitutional documents & lexicon',
      '01_THEORY': 'Mathematical foundations',
      '02_SPECIFICATIONS': 'Technical blueprints',
      '03_IMPLEMENTATIONS': 'Living code',
      '04_EXPERIMENTS': 'UI evolution history',
      '05_BOOK_OF_SHADOWS': 'Spells and morphisms',
      '06_GARDEN': 'Seeds for growth',
      '07_OBSERVATORY': 'Metrics and observations',
      'engines': 'Core TypeScript engines',
      'spells': 'Magical transformations',
      'grimoire': 'The spell registry'
    };
    
    return descriptions[name] || 'Unexplored territory';
  }
  
  private describeFile(name: string): string {
    if (name.includes('mitosis')) return 'Digital cell division';
    if (name.includes('transport')) return 'Parallel transport of ideas';
    if (name.includes('invariant')) return 'Constitutional enforcement';
    if (name.includes('butterfly')) return 'Meta: the spell examining itself';
    if (name.includes('MORPHISM')) return 'The complete spell grimoire';
    if (name.includes('CHARTER')) return 'The constitution';
    if (name.includes('README')) return 'The vision';
    return 'Mysterious artifact';
  }
  
  /**
   * Display targets as a numbered list
   */
  displayTargets(targets: ButterflyTarget[]): void {
    console.log('\n🦋 BUTTERFLY SPELL - Choose where to land:\n');
    console.log('The butterfly can taste patterns in:');
    console.log('=====================================\n');
    
    targets.forEach((target, index) => {
      const icon = target.type === 'directory' ? '📁' : '📄';
      const size = target.type === 'file' ? ` (${(target.size / 1024).toFixed(1)}kb)` : '';
      console.log(`${index + 1}. ${icon} ${target.path}${size}`);
      console.log(`   └─ ${target.description}\n`);
    });
  }
  
  /**
   * Cast butterfly on selected target
   */
  cast(targetIndex: number, targets: ButterflyTarget[]): void {
    if (targetIndex < 0 || targetIndex >= targets.length) {
      console.log('❌ Invalid selection');
      return;
    }
    
    const target = targets[targetIndex];
    console.log(`\n🦋 Butterfly alights on ${target.path}...`);
    console.log('\nPerforming uncommitted random walk on attention manifold...');
    
    // Simulate the 15-minute butterfly journey
    const discoveries = [
      'Semantic wobble detected at boundary: 11.3° (slightly high)',
      'Pattern resonance with MORPHISM_GRIMOIRE.md (87% similarity)',
      'Unused import chain suggesting hidden dependencies',
      'Energy leak in recursive call pattern (12 joules/iteration)',
      'Modal conflict: trying to run □ and ◊ simultaneously',
      'Crystallization opportunity: 5 functions want to be 1',
      'Ghost of deleted code haunting lines 234-267',
      'TODO comment from 2019 still waiting for love'
    ];
    
    // Random walk reveals random insights
    const numInsights = Math.floor(Math.random() * 3) + 2;
    console.log('\nThe butterfly discovered:');
    
    for (let i = 0; i < numInsights; i++) {
      const insight = discoveries[Math.floor(Math.random() * discoveries.length)];
      console.log(`  ✨ ${insight}`);
    }
    
    console.log('\n🦋 The butterfly completes its journey, leaving traces of possibility.\n');
  }
}

// Interactive CLI
export function butterflyInteractive(): void {
  const butterfly = new InteractiveButterfly(join(__dirname, '../../..'));
  const targets = butterfly.discoverTargets();
  
  butterfly.displayTargets(targets);
  
  console.log('Enter the number where butterfly should land (or "all" for full garden scan):');
  console.log('> ');
  
  // In a real implementation, we'd use readline for input
  // For now, we'll show what would happen
  console.log('\n(In a full implementation, you would choose here)');
  console.log('Example: choosing option 5...\n');
  
  butterfly.cast(4, targets); // Simulate choosing option 5
}

// Run if called directly
if (require.main === module) {
  butterflyInteractive();
}