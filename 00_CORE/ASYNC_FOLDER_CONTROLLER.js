/**
 * ASYNC FOLDER CONTROLLER - Meta-level CPU for folder operations
 * 
 * CHARTER_GUARD: Prevent race conditions at folder structure level
 * BOOK_OF_SHADOWS: SARANETH (Binding order to chaos)
 * MORPHISM: INTENT(no races) → CHARTER(verified) → BOOK(SARANETH) → CODE
 * 
 * This implements async/await at the FOLDER STRUCTURE level
 * Each folder gets a semaphore, operations are queued
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class FolderCPU extends EventEmitter {
    constructor() {
        super();
        // Folder-level semaphores
        this.folderLocks = new Map();
        
        // Operation queue per folder
        this.operationQueues = new Map();
        
        // Global operation order (like CPU instruction pipeline)
        this.globalPipeline = [];
        
        // Folder hierarchy for dependency resolution
        this.folderHierarchy = {
            '00_CORE': { priority: 0, dependencies: [] },
            '01_THEORY': { priority: 1, dependencies: ['00_CORE'] },
            '02_PROOF_PATHS': { priority: 2, dependencies: ['01_THEORY'] },
            '03_IMPLEMENTATIONS': { priority: 3, dependencies: ['02_PROOF_PATHS'] },
            '04_EXPERIMENTS': { priority: 4, dependencies: ['03_IMPLEMENTATIONS'] },
            '05_BOOK_OF_SHADOWS': { priority: 1, dependencies: ['00_CORE'] }, // Parallel to theory
            '06_SOUL_INTERFACE': { priority: 5, dependencies: ['03_IMPLEMENTATIONS', '05_BOOK_OF_SHADOWS'] },
            '07_OBSERVATORY': { priority: 6, dependencies: ['06_SOUL_INTERFACE'] },
            'docs': { priority: 7, dependencies: ['00_CORE'] } // Output folder
        };
        
        // Initialize locks for each folder
        this.initializeFolderLocks();
    }
    
    initializeFolderLocks() {
        for (const folder of Object.keys(this.folderHierarchy)) {
            this.folderLocks.set(folder, {
                locked: false,
                holder: null,
                waitQueue: []
            });
            this.operationQueues.set(folder, []);
        }
    }
    
    /**
     * Acquire lock for folder operation (async mutex)
     */
    async acquireFolderLock(folderName, operationId) {
        const lock = this.folderLocks.get(folderName);
        if (!lock) {
            throw new Error(`Unknown folder: ${folderName}`);
        }
        
        // If not locked, acquire immediately
        if (!lock.locked) {
            lock.locked = true;
            lock.holder = operationId;
            this.emit('lock-acquired', { folder: folderName, operation: operationId });
            return;
        }
        
        // Otherwise, queue and wait
        return new Promise((resolve) => {
            lock.waitQueue.push({
                operationId,
                resolve
            });
            this.emit('lock-queued', { folder: folderName, operation: operationId });
        });
    }
    
    /**
     * Release folder lock and process wait queue
     */
    async releaseFolderLock(folderName, operationId) {
        const lock = this.folderLocks.get(folderName);
        if (!lock || lock.holder !== operationId) {
            throw new Error(`Invalid lock release: ${folderName} by ${operationId}`);
        }
        
        // Process wait queue
        if (lock.waitQueue.length > 0) {
            const next = lock.waitQueue.shift();
            lock.holder = next.operationId;
            this.emit('lock-transferred', { 
                folder: folderName, 
                from: operationId, 
                to: next.operationId 
            });
            next.resolve();
        } else {
            // No waiters, release lock
            lock.locked = false;
            lock.holder = null;
            this.emit('lock-released', { folder: folderName, operation: operationId });
        }
    }
    
    /**
     * Execute operation with proper async ordering
     */
    async executeOperation(operation) {
        const { type, folder, action, data } = operation;
        const operationId = `${type}-${Date.now()}-${Math.random()}`;
        
        try {
            // Check dependencies first
            await this.waitForDependencies(folder);
            
            // Acquire lock
            await this.acquireFolderLock(folder, operationId);
            
            // Log to global pipeline
            this.globalPipeline.push({
                id: operationId,
                folder,
                type,
                timestamp: Date.now(),
                status: 'executing'
            });
            
            // Execute the actual operation
            const result = await action(data);
            
            // Update pipeline
            this.updatePipelineStatus(operationId, 'completed');
            
            return result;
            
        } finally {
            // Always release lock
            await this.releaseFolderLock(folder, operationId);
        }
    }
    
    /**
     * Wait for folder dependencies to be ready
     */
    async waitForDependencies(folderName) {
        const folderInfo = this.folderHierarchy[folderName];
        if (!folderInfo) return;
        
        const dependencies = folderInfo.dependencies;
        
        // Wait for all dependency folders to have no pending operations
        for (const dep of dependencies) {
            while (this.hasPendingOperations(dep)) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    }
    
    /**
     * Check if folder has pending operations
     */
    hasPendingOperations(folderName) {
        const lock = this.folderLocks.get(folderName);
        return lock && (lock.locked || lock.waitQueue.length > 0);
    }
    
    /**
     * Update operation status in pipeline
     */
    updatePipelineStatus(operationId, status) {
        const op = this.globalPipeline.find(o => o.id === operationId);
        if (op) {
            op.status = status;
            op.completedAt = Date.now();
        }
    }
    
    /**
     * Queue a file operation with automatic conflict resolution
     */
    async queueFileOperation(filePath, operation) {
        const folder = this.extractFolder(filePath);
        
        return this.executeOperation({
            type: 'file',
            folder,
            action: operation,
            data: { filePath }
        });
    }
    
    /**
     * Queue a folder operation
     */
    async queueFolderOperation(folderPath, operation) {
        const folder = this.extractFolder(folderPath);
        
        return this.executeOperation({
            type: 'folder',
            folder,
            action: operation,
            data: { folderPath }
        });
    }
    
    /**
     * Extract top-level folder from path
     */
    extractFolder(filePath) {
        const normalized = path.normalize(filePath);
        const parts = normalized.split(path.sep);
        
        // Find first part that matches our folder hierarchy
        for (const part of parts) {
            if (this.folderHierarchy[part]) {
                return part;
            }
        }
        
        // Default to first part or 'unknown'
        return parts[0] || 'unknown';
    }
    
    /**
     * Get current system state (for monitoring)
     */
    getSystemState() {
        const state = {
            locks: {},
            queues: {},
            pipeline: this.globalPipeline.slice(-10) // Last 10 operations
        };
        
        for (const [folder, lock] of this.folderLocks) {
            state.locks[folder] = {
                locked: lock.locked,
                holder: lock.holder,
                queueLength: lock.waitQueue.length
            };
        }
        
        for (const [folder, queue] of this.operationQueues) {
            state.queues[folder] = queue.length;
        }
        
        return state;
    }
    
    /**
     * Deadlock detection (runs periodically)
     */
    detectDeadlocks() {
        // Build dependency graph of current lock holders
        const holders = new Map();
        const waiters = new Map();
        
        for (const [folder, lock] of this.folderLocks) {
            if (lock.locked) {
                holders.set(lock.holder, folder);
            }
            for (const waiter of lock.waitQueue) {
                if (!waiters.has(waiter.operationId)) {
                    waiters.set(waiter.operationId, []);
                }
                waiters.get(waiter.operationId).push(folder);
            }
        }
        
        // Simple cycle detection
        // In a real implementation, use Tarjan's algorithm
        for (const [waiter, folders] of waiters) {
            for (const folder of folders) {
                const lock = this.folderLocks.get(folder);
                if (lock && waiters.has(lock.holder)) {
                    console.warn('⚠️ Potential deadlock detected:', {
                        waiter,
                        waitingFor: folder,
                        heldBy: lock.holder
                    });
                }
            }
        }
    }
}

// Global singleton instance
const folderCPU = new FolderCPU();

// Start deadlock detection
setInterval(() => folderCPU.detectDeadlocks(), 5000);

// Example usage wrapper functions
async function safeReadFile(filePath) {
    return folderCPU.queueFileOperation(filePath, async ({ filePath }) => {
        return await fs.readFile(filePath, 'utf8');
    });
}

async function safeWriteFile(filePath, content) {
    return folderCPU.queueFileOperation(filePath, async ({ filePath }) => {
        await fs.writeFile(filePath, content);
    });
}

async function safeCreateFolder(folderPath) {
    return folderCPU.queueFolderOperation(folderPath, async ({ folderPath }) => {
        await fs.mkdir(folderPath, { recursive: true });
    });
}

// Export the CPU and safe operations
module.exports = {
    folderCPU,
    safeReadFile,
    safeWriteFile,
    safeCreateFolder,
    
    // Direct access for monitoring
    getSystemState: () => folderCPU.getSystemState(),
    
    // Event subscriptions
    on: (event, handler) => folderCPU.on(event, handler)
};