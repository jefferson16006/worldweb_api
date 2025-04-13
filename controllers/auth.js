const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const register = async(req, res) => {
    try {
        // console.log("BODY RECEIVED:", req.body);
        const { username, email, password } = req.body
        if(!username || !email || !password) {
            throw new BadRequestError('Please fill out each field.')
        }
        const prevEmail = await User.findOne({email})
        if (prevEmail) {
            throw new BadRequestError('This email already exists.')
        }
        const user = await User.create({...req.body})
        const token = await user.createJWT()
        res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}
const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            throw new BadRequestError('Please provide email and password.')
        }
        const user = await User.findOne({ email })
        if(!user) {
            throw new UnauthenticatedError('Email does not exist.')
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) {
            throw new UnauthenticatedError('Password is incorrect. Please try again.')
        }
        const token = await user.createJWT()
        res.status(StatusCodes.OK).json({ user: { username: user.username }, token })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}

module.exports = {register, login}