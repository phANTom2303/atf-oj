const JWT = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
    console.log("creating token for user")
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
    const token = JWT.sign(payload, secret);
    console.log(`Token created : ${token}`);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}