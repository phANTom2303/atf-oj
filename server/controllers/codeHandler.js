const {generateFile} = require('../utils/generateFile');
const {executeCpp} = require('../utils/codeRunner')
async function handleCodeExecute(req, res) {
    try {
        const codePath = await generateFile("cpp", req.body.code);
        const inputPath = await generateFile("txt", req.body.input);
        
        const result = await executeCpp(codePath, inputPath);
        console.log(result);
        console.log("------------------------------");
        
        // Check if result contains an error
        if (result.type === 'compilation_error' || result.type === 'execution_error' || result.type === 'time_limit_exceeded') {
            return res.json({
                status: false,
                output: result.output || result.stderr || result.message,
                error: result.type,
                executionTime: result.executionTime || 0,
                message: result.message
            });
        }
        
        // Success case
        return res.json({
            status: true,
            output: result.output,
            executionTime: result.executionTime,
            warnings: result.warnings,
            type: result.type
        });
        
    } catch (error) {
        console.log("in Catch block");
        return res.json({
            status: false,
            output: "Something went wrong, Try Again",
            error: "server_error"
        });
    }
}

module.exports = {
    handleCodeExecute,
}