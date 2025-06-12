const {generateFile} = require('../utils/generateFile');
const {executeCpp} = require('../utils/codeRunner')
async function handleCodeExecute(req, res) {
    try {
        const codePath = await generateFile("cpp", req.body.code);
        const inputPath = await generateFile("txt", req.body.input);
        try {
            const output = await executeCpp(codePath, inputPath);
            console.log(output);
            console.log("------------------------------");
            return res.json({
                status: true,
                output: output,
            })
        } catch (rejectionReason) {
            return res.json({
                status: false,
                output: rejectionReason.stderr,
            })
        }
    } catch (error) {
        console.log("in Catch block");
        return res.json({
            status: false,
            output: "Something went wrong, Try Again",
        })
    }
}

module.exports = {
    handleCodeExecute,
}