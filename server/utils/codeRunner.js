const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Helper function to compile C++ code
const compileCpp = (filepath, outPath) => {
    return new Promise((resolve, reject) => {
        exec(`g++ ${filepath} -o ${outPath}`, (error, stdout, stderr) => {
            if (error) {
                console.log('Compilation error:', error);
                console.log('Compilation stderr:', stderr);
                reject({
                    type: 'compilation_error',
                    error,
                    stderr,
                    message: 'Code compilation failed'
                });
                return;
            }
            if (stderr) {
                console.log('Compilation stderr:', stderr);
                reject({
                    type: 'compilation_error',
                    stderr,
                    message: 'Code compilation failed'
                });
                return;
            }
            resolve('Compilation successful');
        });
    });
};

// Alternative implementation using spawn for better process control
const executeCompiledCppWithSpawn = (outPath, inputPath, jobId, timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
        // Use spawn to run the executable directly with better process control
        const childProcess = spawn(`./${jobId}.out`, [], {
            cwd: outputPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: true // Create a new process group
        });
        
        let stdout = '';
        let stderr = '';
        
        // Handle stdout data
        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        // Handle stderr data
        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        // Handle process exit
        childProcess.on('close', (code) => {
            // Clear the timeout since execution completed
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            if (code !== 0) {
                reject({
                    type: 'execution_error',
                    error: `Process exited with code ${code}`,
                    stderr,
                    message: 'Code execution failed'
                });
                return;
            }
            
            if (stderr) {
                console.log('Execution stderr:', stderr);
                resolve({ output: stdout, warnings: stderr });
                return;
            }
            
            console.log(stdout);
            resolve({ output: stdout });
        });
        
        // Handle process error
        childProcess.on('error', (error) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            reject({
                type: 'execution_error',
                error,
                message: 'Failed to start process'
            });
        });
        
        // Write input to the process
        if (fs.existsSync(inputPath)) {
            const inputData = fs.readFileSync(inputPath, 'utf8');
            childProcess.stdin.write(inputData);
        }
        childProcess.stdin.end();
        
        // Set up timeout that kills the entire process group
        const timeoutId = setTimeout(() => {
            console.log(`Killing process group for job: ${jobId} due to timeout`);
            
            try {
                // Kill the entire process group (negative PID)
                process.kill(-childProcess.pid, 'SIGKILL');
            } catch (killError) {
                console.log(`Failed to kill process group:`, killError.message);
                // Fallback to killing individual process
                childProcess.kill('SIGKILL');
            }
            
            reject({
                type: 'time_limit_exceeded',
                status: false,
                output: "Time Limit Exceeded",
                message: `Code execution timed out after ${timeoutMs}ms`,
                executionTime: timeoutMs
            });
        }, timeoutMs);
    });
};
const executeCompiledCpp = (outPath, inputPath, jobId, timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`cd ${outputPath} && ./${jobId}.out < ${inputPath}`, (error, stdout, stderr) => {
            // Clear the timeout since execution completed
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            if (error) {
                console.log('Execution error:', error);
                console.log('Execution stderr:', stderr);
                reject({
                    type: 'execution_error',
                    error,
                    stderr,
                    message: 'Code execution failed'
                });
                return;
            }
            if (stderr) {
                console.log('Execution stderr:', stderr);
                // Note: stderr might contain warnings, not necessarily errors
                // So we can still resolve with stdout but include stderr info
                resolve({ output: stdout, warnings: stderr });
                return;
            }
            console.log(stdout);
            resolve({ output: stdout });
        });
        
        // Set up timeout that kills the process tree
        const timeoutId = setTimeout(() => {
            console.log(`Killing process tree for job: ${jobId} due to timeout`);
            
            // Kill the entire process tree to ensure the .out file is also killed
            try {
                // On Unix systems, kill the process group
                process.kill(-childProcess.pid, 'SIGKILL');
            } catch (killError) {
                console.log(`Failed to kill process group, trying individual process kill:`, killError.message);
                // Fallback to killing just the immediate process
                childProcess.kill('SIGKILL');
            }
            
            reject({
                type: 'time_limit_exceeded',
                status: false,
                output: "Time Limit Exceeded",
                message: `Code execution timed out after ${timeoutMs}ms`,
                executionTime: timeoutMs
            });
        }, timeoutMs);
    });
};

// Main function that compiles and executes C++ code with given input
const executeCpp = async (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    try {
        // Step 1: Compile the C++ code
        console.log(`Starting compilation for job: ${jobId}`);
        await compileCpp(filepath, outPath);
        console.log(`Compilation successful for job: ${jobId}`);

        // Step 2: Execute the compiled binary

        console.log(`Starting execution for job: ${jobId}`);
        const startTime = Date.now();
        
        try {
            // Execute with integrated timeout and process killing using spawn for better process control
            const result = await executeCompiledCppWithSpawn(outPath, inputPath, jobId, 5000);
            
            const endTime = Date.now();
            const executionTime = endTime - startTime;
            
            console.log(`Execution successful for job: ${jobId}`);
            console.log(`Time Taken : ${executionTime}ms`);
            console.log(`Result object :`, result);

            // Return the output with execution time (spread result object for a flat structure)
            return {
                ...result,
                executionTime: executionTime,
                type: 'success'
            };
        } catch (timeoutError) {
            // Handle timeout error specifically
            if (timeoutError.type === 'time_limit_exceeded') {
                console.log(`Execution timed out for job: ${jobId}`);
                console.log(`Timeout error:`, timeoutError);
                return {
                    ...timeoutError,
                    jobId,
                    timestamp: new Date().toISOString()
                };
            }
            // Re-throw other errors to be handled by the outer catch block
            throw timeoutError;
        }

    } catch (error) {
        // Return error object instead of throwing, so frontend can access error details
        return {
            ...error,
            jobId,
            timestamp: new Date().toISOString(),
            executionTime: 0
        };
    } finally {
        // Clean up the compiled binary (runs regardless of success/failure)
        try {
            if (fs.existsSync(outPath)) {
                fs.unlinkSync(outPath);
                console.log(`Cleaned up binary for job: ${jobId}`);
            }
        } catch (cleanupError) {
            console.log(`Cleanup warning for job ${jobId}:`, cleanupError.message);
        }
    }
};

module.exports = {
    executeCpp,
};
