const express = require('express');
const codeExecuteRouter = express.Router();
const {handleCodeExecute} = require('../controllers/codeHandler');

codeExecuteRouter.post("/", handleCodeExecute);
module.exports = codeExecuteRouter;