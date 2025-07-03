const { exec } = require("child_process");
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

// Function that returns a promise for timeout
const createTimeoutPromise = (timeoutMs) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({
                type: 'time_limit_exceeded',
                status: false,
                output: "Time Limit Exceeded",
                message: `Code execution timed out after ${timeoutMs}ms`,
                executionTime: timeoutMs
            })
        }, timeoutMs)
    })
}

// Helper function to execute compiled C++ binary
const executeCompiledCpp = (outPath, inputPath, jobId) => {
    return new Promise((resolve, reject) => {
        exec(`cd ${outputPath} && ./${jobId}.out < ${inputPath}`, (error, stdout, stderr) => {
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
            const result = await Promise.race([
                executeCompiledCpp(outPath, inputPath, jobId),
                createTimeoutPromise(5000)
            ]);
            
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
