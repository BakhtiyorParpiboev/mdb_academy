const express = require('express');
const router = express.Router();
const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const executeCode = async (language, code, stdin) => {
    const runId = crypto.randomBytes(16).toString('hex');
    const runDir = path.join(os.tmpdir(), runId);
    await fs.mkdir(runDir, { recursive: true });

    let fileName, compileCmd, runCmd;
    
    switch (language) {
        case 'javascript':
            fileName = 'main.js';
            runCmd = ['node', 'main.js'];
            break;
        case 'python':
            fileName = 'main.py';
            runCmd = ['python3', 'main.py'];
            break;
        case 'c':
            fileName = 'main.c';
            compileCmd = 'gcc main.c -o main';
            runCmd = ['./main'];
            break;
        case 'cpp':
            fileName = 'main.cpp';
            compileCmd = 'g++ main.cpp -o main';
            runCmd = ['./main'];
            break;
        case 'java':
            fileName = 'Main.java';
            compileCmd = 'javac Main.java';
            runCmd = ['java', 'Main'];
            break;
        case 'go':
            fileName = 'main.go';
            runCmd = ['go', 'run', 'main.go'];
            break;
        default:
            throw new Error('Unsupported language');
    }

    const filePath = path.join(runDir, fileName);
    await fs.writeFile(filePath, code);

    try {
        if (compileCmd) {
            await new Promise((resolve, reject) => {
                exec(compileCmd, { cwd: runDir }, (error, stdout, stderr) => {
                    if (error) {
                        reject({ isCompileError: true, output: stderr || (error.message || "Compilation failed") });
                    } else {
                        resolve();
                    }
                });
            });
        }

        return await new Promise((resolve, reject) => {
            const child = spawn(runCmd[0], runCmd.slice(1), { cwd: runDir });
            
            let output = '';
            let errorOutput = '';

            if (stdin) {
                child.stdin.write(stdin);
                child.stdin.end();
            }

            // Timeout after 5 seconds to prevent infinite loops
            const timeout = setTimeout(() => {
                child.kill();
                reject({ isTimeout: true, output: 'Execution timed out (5s limit).' });
            }, 5000);

            child.stdout.on('data', (data) => {
                output += data.toString();
            });

            child.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            child.on('close', (code) => {
                clearTimeout(timeout);
                resolve({
                    success: true,
                    output: errorOutput ? errorOutput : output,
                    isError: code !== 0 || !!errorOutput
                });
            });
            
            child.on('error', (err) => {
            	clearTimeout(timeout);
            	reject({ isCompileError: true, output: `Process error: ${err.message}` });
            });
        });
    } finally {
        fs.rm(runDir, { recursive: true, force: true }).catch(console.error);
    }
};

router.post('/execute', async (req, res) => {
    try {
        const { language, code, stdin } = req.body;
        const result = await executeCode(language, code, stdin || '');
        res.json(result);
    } catch (error) {
        console.error('Execution error:', error);
        if (error.isCompileError || error.isTimeout) {
            res.json({ success: true, isError: true, output: error.output });
        } else {
            res.status(500).json({ error: error.message || 'Server error during execution' });
        }
    }
});

module.exports = router;
