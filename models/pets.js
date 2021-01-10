const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const petSchema = new Schema ({
    dogName: {
        type: String, 
        required: true
    }, 
    dogType:{
        type: String,
        required: true
    },
    dogGender: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }, 
    height: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Negative height aren't real.");
        }
    },
    weight: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) throw new Error("Negative weight aren't real.");
        }
    },
    hypoallergenic:{
        type: String,
        required: true,
        default: 'no'
    },
    dietary:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: false
    },
    picture:{
        type: String,
        required: false
    },
    owner:{
        type: String,
        required: false,
    }
    
})

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet