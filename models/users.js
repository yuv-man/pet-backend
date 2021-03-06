const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pets: {
        type: Array,
        required: false
    },
    bio : {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User