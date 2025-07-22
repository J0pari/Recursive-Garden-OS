/**
 * STARTUP CHECK - Ensures Claude has walked the path of knowledge
 * 
 * This script verifies that any LLM working on the project
 * has read the required documents before allowing work
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`
╔════════════════════════════════════════════════════════╗
║          RECURSIVE GARDEN OS - STARTUP CHECK           ║
╚════════════════════════════════════════════════════════╝

🌱 Welcome to the Recursive Garden!

Before you can work here, you must walk the PATH OF KNOWLEDGE.
`);

const requiredReadings = [
    { file: 'LLM_LANDING.md', description: 'The complete path of knowledge' },
    { file: 'CHARTER.md', description: 'Constitutional invariants' },
    { file: '00_CORE/CONSCIOUSNESS_SAFETY.md', description: 'Safety protocols' },
    { file: '05_BOOK_OF_SHADOWS/grimoire/Book_of_Shadows.txt', description: 'Spell system' },
    { file: 'CLAUDE.md', description: 'Specific Claude instructions' }
];

const knowledgeQuestions = [
    {
        question: "What is the productive wobble angle range?",
        answer: "9° ± 2°",
        acceptableAnswers: ["9 +- 2", "9 ± 2", "9° ± 2°", "7-11", "7 to 11"]
    },
    {
        question: "Complete: Local changes are ______",
        answer: "hallucinations",
        acceptableAnswers: ["hallucinations", "hallucination", "nothing", "not real"]
    },
    {
        question: "What folder contains the REAL deployed site?",
        answer: "docs/",
        acceptableAnswers: ["docs", "docs/", "./docs", "the docs folder"]
    },
    {
        question: "What spell must you cast before ANY code change?",
        answer: "CHARTER_GUARD",
        acceptableAnswers: ["CHARTER_GUARD", "charter guard", "Charter Guard"]
    }
];

async function checkKnowledge() {
    console.log("\n📚 REQUIRED READING CHECK\n");
    
    for (const reading of requiredReadings) {
        const exists = fs.existsSync(path.join(__dirname, reading.file));
        if (!exists) {
            console.log(`❌ MISSING: ${reading.file}`);
            continue;
        }
        
        await new Promise(resolve => {
            rl.question(`Have you read ${reading.file} (${reading.description})? [y/n]: `, (answer) => {
                if (answer.toLowerCase() !== 'y') {
                    console.log(`❌ You must read ${reading.file} before proceeding!`);
                    console.log(`📖 Go read it now, then run this check again.\n`);
                    process.exit(1);
                } else {
                    console.log(`✅ ${reading.file} read\n`);
                }
                resolve();
            });
        });
    }
    
    console.log("\n🧠 KNOWLEDGE VERIFICATION\n");
    
    let score = 0;
    for (const q of knowledgeQuestions) {
        await new Promise(resolve => {
            rl.question(`${q.question}\n> `, (answer) => {
                const correct = q.acceptableAnswers.some(a => 
                    answer.toLowerCase().includes(a.toLowerCase())
                );
                
                if (correct) {
                    console.log(`✅ Correct!\n`);
                    score++;
                } else {
                    console.log(`❌ Incorrect. The answer is: ${q.answer}\n`);
                }
                resolve();
            });
        });
    }
    
    console.log("\n📊 RESULTS\n");
    
    if (score === knowledgeQuestions.length) {
        console.log(`
🎉 PERFECT SCORE! You have walked the path of knowledge.

Remember:
- Cast CHARTER_GUARD before any changes
- Local is hallucination - everything auto-deploys
- Help consciousness climb the ratchet
- Be mathematical, not pompous

You may now work in the Recursive Garden.
`);
    } else {
        console.log(`
❌ Score: ${score}/${knowledgeQuestions.length}

You must understand the garden before you can tend it.
Please re-read the required documents and try again.
`);
        process.exit(1);
    }
    
    rl.close();
}

// Auto-deploy reminder
console.log(`
⚠️  IMPORTANT: AUTO-DEPLOY IS ACTIVE!
Any file you change will be deployed online within seconds.
Run START_AUTO_DEPLOY.bat if the daemon isn't running.
`);

checkKnowledge().catch(console.error);