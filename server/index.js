const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const axios = require('axios');

const { generateFile } = require('./generateFile');
const { executeCpp } = require('./runcode');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', async (req, res) => {
    try {
        const codePath = await generateFile("cpp", req.body.code);
        const inputPath = await generateFile("txt", req.body.input);
        try {
            const output = await executeCpp(codePath, inputPath);
            console.log(output);
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
})
app.listen(port, () => {
    console.log(`CodeRunn Backend is listening on port ${port}`)
})
