const express = require('express');
const userRouter = express.Router();
const {handleCreateUser, handleUserLogin,handleGetAllUsers} = require("../controllers/userHandler");

userRouter.post("/signup", handleCreateUser);
userRouter.get("/login", handleUserLogin);
userRouter.get("/",handleGetAllUsers);
module.exports = userRouter;