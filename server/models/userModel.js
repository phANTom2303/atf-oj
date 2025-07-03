const { createTokenForUser } = require("../utils/authTokens")
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

userSchema.static('verifyPasswordAndGenerateToken', async function (email, password) {
    const possibleUser = await this.findOne({ email });
    if (!possibleUser)
        throw new Error('User Not Found');

    if (possibleUser.password === password) {
        console.log("Passwords have matched")
        const token = createTokenForUser(possibleUser);
        return { token, name: possibleUser.name };
    } else {
        throw new Error('Incorrect Pasword');
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;
