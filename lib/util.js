require('dotenv').config()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../models/users');


const secretTokenKey = process.env.SECRET_KEY

const createToken = ( email ) => {
    return jwt.sign({ email }, secretTokenKey)
}

const verifyToken = async(token) => {
    try{
        const payload = await jwt.verify(token, secretTokenKey)
        return payload
    } catch (err) {
        console.log(err)
        return null
    }
}


module.exports = { createToken, verifyToken }