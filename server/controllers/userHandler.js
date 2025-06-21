const mongoose = require('mongoose');
const User = require('../models/userModel');
async function handleCreateUser(req, res) {
    console.log(req.body);
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.json({ "msg": `user ${name} created successfully` });
}

async function handleUserLogin(req, res) {
    console.log(req.body);
    console.log("reached handleUserLogin funciton");
    const { email, password } = req.query || req.body;
    await User.verifyPasswordAndGenerateToken(email, password)
        .then((result) => {
            const { token, name } = result;
            return res.cookie("token", token).json({"msg" : "login successfull", "name": name});
        })
        .catch((error) => {
            return res.json({ "msg": error.message });
        })
}

async function handleGetAllUsers(req, res) {
    const AllUsers = await User.find({});
    return res.json(AllUsers);
}


module.exports = {
    handleCreateUser,
    handleUserLogin,
    handleGetAllUsers
}