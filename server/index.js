const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const codeExecuteRouter = require('./routes/CodeExecuteRoute')
const userRouter = require('./routes/userRouter');
const { connectMongoDB } = require('./utils/connectMongo');
// Load environment variables from .env file
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


connectMongoDB(process.env.MONGO_URL)
    .then(() => {
        console.log("mongo Connection success");
    }).catch((err) => {
        console.log(`Mongo Connection failed due to : \n ${err}`);
    })


app.get('/', (req, res) => {
    res.send('Hello From CodeRun Backend');
})

app.use('/user', userRouter);
app.use('/code', codeExecuteRouter);

app.listen(port, () => {
    console.log(`CodeRunn Backend is listening on port ${port}`)
})
