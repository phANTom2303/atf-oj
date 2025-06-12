const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const codeExecuteRouter = require('./routes/CodeExecuteRoute')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello From CodeRun Backend');
})

app.use('/',codeExecuteRouter);

app.listen(port, () => {
    console.log(`CodeRunn Backend is listening on port ${port}`)
})
