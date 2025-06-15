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
    const { email, password } = req.body;
    const currUser = await User.findOne({
        email,
        password,
    });

    if (!currUser) {
        return res.json({
            "error": 'Invalid Username or Password',
        });
    }

    return res.json({"msg" : "login success"});
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