const express = require('express');
const userRouter = express.Router();
const {handleCreateUser, handleUserLogin,handleGetAllUsers, handleVerifyToken} = require("../controllers/userHandler");

userRouter.post("/signup", handleCreateUser);
userRouter.get("/login", handleUserLogin);
userRouter.get("/",handleGetAllUsers);
userRouter.get("/verify",handleVerifyToken);
module.exports = userRouter;