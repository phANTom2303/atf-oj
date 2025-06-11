const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', (req, res) => {

    console.log(req.body);
    
    axios.post("https://emkc.org/api/v2/piston/execute", {
        "language": "cpp",
        "version": "10.2.0",  // This is GCC 10.2.0 which supports C++17
        "files": [
            {
                "name": "main.cpp",
                "content": req.body.code,
            }
        ],
        "stdin": req.body.input || "",
    })
    .then((response) => {
        console.log(response.data.run);
        return res.json(response.data.run);
    })
    .catch(error => {
        console.error("Error executing code:", error);
        return res.status(500).json({ error: "Failed to execute code" });
    });
})
app.listen(port, () => {
    console.log(`CodeRunn Backend is listening on port ${port}`)
})
