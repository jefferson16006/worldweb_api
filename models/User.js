const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please provide a username.'],
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        require: [true, "Please provide an email."],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email."
        ],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "Please provide a password."],
        minlength: 6,
    }
})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        { userID: this._id, name:this.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)