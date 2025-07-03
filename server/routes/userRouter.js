const express = require('express');
const userRouter = express.Router();
const {handleCreateUser, handleUserLogin,handleGetAllUsers, handleVerifyToken, handleUserLogout} = require("../controllers/userHandler");

userRouter.post("/signup", handleCreateUser);
userRouter.get("/login", handleUserLogin);
userRouter.get("/",handleGetAllUsers);
userRouter.get("/verify",handleVerifyToken);
userRouter.post("/logout", handleUserLogout);
module.exports = userRouter;