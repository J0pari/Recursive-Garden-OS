"use strict";
/**
 * Lineage Log: Append-only evolutionary history tracker
 * Implements INV-AUDIT-001 from CHARTER
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineageLog = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class LineageLog {
    logPath;
    constructor(logDir = './logs') {
        this.logPath = (0, path_1.join)(logDir, `lineage-${Date.now()}.jsonl`);
    }
    append(event) {
        const line = JSON.stringify(event) + '\n';
        (0, fs_1.appendFileSync)(this.logPath, line, 'utf8');
    }
    query(filter) {
        if (!(0, fs_1.existsSync)(this.logPath))
            return [];
        const lines = (0, fs_1.readFileSync)(this.logPath, 'utf8').split('\n').filter(l => l);
        return lines
            .map(l => JSON.parse(l))
            .filter(e => Object.entries(filter).every(([k, v]) => e[k] === v));
    }
    getLineage(chunkId) {
        const events = [];
        const seen = new Set();
        const queue = [chunkId];
        while (queue.length > 0) {
            const id = queue.shift();
            if (seen.has(id))
                continue;
            seen.add(id);
            const parentEvents = this.query({ childIds: [id] });
            events.push(...parentEvents);
            queue.push(...parentEvents.map(e => e.parentId));
        }
        return events.sort((a, b) => a.timestamp - b.timestamp);
    }
}
exports.LineageLog = LineageLog;
