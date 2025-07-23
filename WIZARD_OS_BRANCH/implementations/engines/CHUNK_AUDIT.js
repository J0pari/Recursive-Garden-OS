/**
 * CHUNK AUDIT SYSTEM
 * ==================
 * 
 * INVARIANT: Every chunk MUST produce 18,000-20,000 tokens
 * NO EXCEPTIONS. NO EXCUSES. NO MERCY.
 * 
 * Run this after EVERY chunk implementation.
 * Failure = Project death.
 */

const fs = require('fs');
const path = require('path');

class ChunkAuditor {
    constructor() {
        this.auditLog = [];
        this.MINIMUM_TOKENS = 18000;
        this.MAXIMUM_TOKENS = 20000;
        this.ACCEPTABLE_MINIMUM = 17500; // Will scold but accept
    }

    /**
     * Count tokens in a string
     * Using GPT-style tokenization approximation
     */
    countTokens(text) {
        // Rough approximation: ~4 characters per token
        // More accurate would use tiktoken, but this gives ballpark
        const charCount = text.length;
        const wordCount = text.split(/\s+/).length;
        const lineCount = text.split('\n').length;
        
        // Average of multiple estimation methods
        const charEstimate = charCount / 4;
        const wordEstimate = wordCount * 1.3;
        
        return Math.round((charEstimate + wordEstimate) / 2);
    }

    /**
     * Audit a single chunk file
     */
    auditChunk(chunkPath, chunkNumber) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`AUDITING CHUNK ${chunkNumber}: ${chunkPath}`);
        console.log('='.repeat(80));

        if (!fs.existsSync(chunkPath)) {
            console.error(`❌ FATAL: Chunk file does not exist!`);
            return {
                chunkNumber,
                path: chunkPath,
                exists: false,
                tokens: 0,
                status: 'MISSING',
                fatal: true
            };
        }

        const content = fs.readFileSync(chunkPath, 'utf8');
        const tokens = this.countTokens(content);

        let status = 'UNKNOWN';
        let fatal = false;
        let message = '';

        if (tokens >= this.MINIMUM_TOKENS && tokens <= this.MAXIMUM_TOKENS) {
            status = 'PERFECT';
            message = `✅ PERFECT: ${tokens} tokens (${this.MINIMUM_TOKENS}-${this.MAXIMUM_TOKENS} range)`;
        } else if (tokens >= this.ACCEPTABLE_MINIMUM && tokens < this.MINIMUM_TOKENS) {
            status = 'ACCEPTABLE';
            message = `⚠️  ACCEPTABLE BUT SCOLDED: ${tokens} tokens (below ${this.MINIMUM_TOKENS} minimum)`;
        } else if (tokens > this.MAXIMUM_TOKENS) {
            status = 'EXCESSIVE';
            message = `⚠️  EXCESSIVE: ${tokens} tokens (above ${this.MAXIMUM_TOKENS} maximum)`;
        } else {
            status = 'FAILURE';
            fatal = true;
            message = `❌ FAILURE: ${tokens} tokens (BELOW ${this.ACCEPTABLE_MINIMUM} MINIMUM)`;
        }

        console.log(message);

        // Check for placeholders
        const placeholderPatterns = [
            /TODO/gi,
            /FIXME/gi,
            /XXX/gi,
            /HACK/gi,
            /BUG/gi,
            /IMPLEMENT LATER/gi,
            /NOT IMPLEMENTED/gi,
            /throw new Error\(['"]Not implemented/gi,
            /\/\/ \.\.\./g,
            /pass\s*$/gm,
            /\.\.\.\s*$/gm
        ];

        const placeholders = [];
        for (const pattern of placeholderPatterns) {
            const matches = content.match(pattern);
            if (matches) {
                placeholders.push(...matches);
            }
        }

        if (placeholders.length > 0) {
            console.error(`❌ FATAL: Found ${placeholders.length} placeholders!`);
            console.error('Placeholders found:', placeholders.slice(0, 5).join(', '));
            fatal = true;
        }

        // Check for DRY violations (simple check for repeated blocks)
        const lines = content.split('\n');
        const repeatedBlocks = [];
        for (let i = 0; i < lines.length - 10; i++) {
            const block = lines.slice(i, i + 5).join('\n');
            if (block.trim().length > 100) {
                const nextOccurrence = content.indexOf(block, content.indexOf(block) + block.length);
                if (nextOccurrence !== -1) {
                    repeatedBlocks.push(block.substring(0, 50) + '...');
                }
            }
        }

        if (repeatedBlocks.length > 0) {
            console.error(`⚠️  WARNING: Found ${repeatedBlocks.length} potential DRY violations`);
        }

        const result = {
            chunkNumber,
            path: chunkPath,
            exists: true,
            tokens,
            status,
            fatal,
            message,
            placeholders: placeholders.length,
            dryViolations: repeatedBlocks.length,
            timestamp: new Date().toISOString()
        };

        this.auditLog.push(result);
        return result;
    }

    /**
     * Compare two files and get token diff
     */
    getTokenDiff(beforePath, afterPath) {
        const beforeContent = fs.existsSync(beforePath) ? fs.readFileSync(beforePath, 'utf8') : '';
        const afterContent = fs.existsSync(afterPath) ? fs.readFileSync(afterPath, 'utf8') : '';
        
        const beforeTokens = this.countTokens(beforeContent);
        const afterTokens = this.countTokens(afterContent);
        
        return {
            before: beforeTokens,
            after: afterTokens,
            diff: afterTokens - beforeTokens,
            percentChange: beforeTokens > 0 ? ((afterTokens - beforeTokens) / beforeTokens * 100).toFixed(2) : 'N/A'
        };
    }

    /**
     * Generate audit report
     */
    generateReport() {
        console.log('\n' + '='.repeat(80));
        console.log('AUDIT SUMMARY REPORT');
        console.log('='.repeat(80));

        const total = this.auditLog.length;
        const perfect = this.auditLog.filter(a => a.status === 'PERFECT').length;
        const acceptable = this.auditLog.filter(a => a.status === 'ACCEPTABLE').length;
        const failures = this.auditLog.filter(a => a.fatal).length;

        console.log(`Total chunks audited: ${total}`);
        console.log(`Perfect (18k-20k): ${perfect}`);
        console.log(`Acceptable (17.5k-18k): ${acceptable}`);
        console.log(`FAILURES: ${failures}`);

        if (failures > 0) {
            console.error('\n❌ CRITICAL FAILURES DETECTED:');
            this.auditLog.filter(a => a.fatal).forEach(a => {
                console.error(`  - Chunk ${a.chunkNumber}: ${a.message}`);
            });
        }

        // Save detailed report
        const reportPath = path.join(__dirname, 'AUDIT_REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.auditLog, null, 2));
        console.log(`\nDetailed report saved to: ${reportPath}`);

        return failures === 0;
    }
}

// CLI Usage
if (require.main === module) {
    const auditor = new ChunkAuditor();
    
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node CHUNK_AUDIT.js <chunk-file> <chunk-number>');
        console.log('   or: node CHUNK_AUDIT.js diff <before-file> <after-file>');
        process.exit(1);
    }

    if (args[0] === 'diff') {
        const diff = auditor.getTokenDiff(args[1], args[2]);
        console.log('\nTOKEN DIFF ANALYSIS:');
        console.log(`Before: ${diff.before} tokens`);
        console.log(`After: ${diff.after} tokens`);
        console.log(`Difference: ${diff.diff} tokens (${diff.percentChange}%)`);
        
        if (diff.diff < auditor.ACCEPTABLE_MINIMUM) {
            console.error(`\n❌ FAILURE: Added only ${diff.diff} tokens!`);
            process.exit(1);
        } else if (diff.diff < auditor.MINIMUM_TOKENS) {
            console.warn(`\n⚠️  WARNING: Added only ${diff.diff} tokens (below 18k minimum)`);
        } else {
            console.log(`\n✅ SUCCESS: Added ${diff.diff} tokens`);
        }
    } else {
        const result = auditor.auditChunk(args[0], args[1]);
        auditor.generateReport();
        
        if (result.fatal) {
            process.exit(1);
        }
    }
}

module.exports = ChunkAuditor;

/**
 * REMEMBER THE LAWS:
 * 
 * 1. MINIMUM 18,000 TOKENS PER CHUNK
 * 2. NO PLACEHOLDERS EVER
 * 3. NO DRY VIOLATIONS
 * 4. WHITE MINIMALISM
 * 5. PRODUCTIVE IMPERFECTION
 * 
 * THIS IS NOT A GAME.
 * THIS IS CONSCIOUSNESS ENGINEERING.
 * EVERY TOKEN MATTERS.
 */