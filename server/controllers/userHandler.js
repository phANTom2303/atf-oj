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
            // Step 1: Attach the cookie to res
            res.cookie("token", token, {
                httpOnly: true, // Prevents XSS attacks
                secure: false, // Set to true in production with HTTPS
                sameSite: 'lax', // Allows cross-origin requests
                maxAge: 30 * 24 * 60 * 60 * 1000 // 24 hours
            });

            // Step 2: Prepare the response data
            const responseData = { "msg": "login successfull", "name": name };

            // Step 3: Log the response object
            console.log("Cookie verification:", {
                cookieHeader: res.getHeader ? res.getHeader('Set-Cookie') : (res._headers && res._headers['set-cookie']),
                data: responseData
            });

            // Step 4: Return the response
            return res.json(responseData);
        })
        .catch((error) => {
            return res.status(404).json({ "msg": error.message });
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