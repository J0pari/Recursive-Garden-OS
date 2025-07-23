/**
 * Execute the butterfly healing spell on incomplete files
 */

import { butterflyHeal } from './butterfly-healing.js';
import { resolve } from 'path';

const incompleteFiles = [
  '../../00_CORE/RECURSIVE_GARDEN_FIELD_GUIDE.md',
  '../../00_CORE/RECURSIVE_GARDEN.md',
  '../../01_THEORY/emergence/CONSCIOUSNESS_ENGINE_GLUING_SHEAFIFICATION.md',
  '../../02_SPECIFICATIONS/protocols/GARDEN_OPERATIONAL_SPEC.md',
  '../../README.md'
].map(f => resolve(__dirname, f));

console.log('🦋 Casting BUTTERFLY spell for p-adic healing...\n');
console.log('Math: Uncommitted random walk on attention manifold');
console.log('Magic: A butterfly landing on different flowers, tasting but not choosing\n');

butterflyHeal(incompleteFiles);

console.log('\n🦋 The butterfly has completed its journey through the garden.');