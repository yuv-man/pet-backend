const express = require('express')
const router = express.Router()
const { createToken, verifyToken } = require('../lib/util')
const bcrypt = require('bcrypt')
const fs = require('fs');
// const usersDB = require('../database/users.json')
const mongoose = require('mongoose')
const UserModel = require('../models/users');
mongoose.set('useFindAndModify', false);


router.use(express.json())

//create user authentication
router.post('/token', (req, res) => {
    const token = createToken( req.body.email )
    res.send( token )
})

//add user signup
router.post('/signup', async(req, res) => {

    const usedEmail = await UserModel.find({ email: req.body.email })

    if(usedEmail.length > 0){
        res.status(401).send('user is already exists')
    } else {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const user = { firstName: req.body.firstName, 
            lastName: req.body.lastName, email: req.body.email, 
            phoneNumber: req.body.phoneNumber, password: hashPassword
        }
        const users = new UserModel(user)
        try {
            await users.save();
            res.status(201).send(users._id);
        } catch (err) {
            res.status(500).send(err);
        }
    }
});


// user login 
router.post('/login', async(req,res) => {
    const user = await UserModel.find({ email: req.body.email })
    if(user.length < 1){
        return res.status(400).send("Cannot find user")
    }
    try {
        const result = await bcrypt.compare(req.body.password, user[0].password)
        if (result){
            console.log(user[0]._id)
            res.status(201).send(user[0]._id)
        } else {
            res.status(400).send('Not Allowed')
        }    
    } catch {
        res.status(500).send('hello')
    }
})

//get users
router.get('/', async(req,res)=>{

    const usersDb = await UserModel.find({})
    res.send(usersDb)
})


//get user by id
router.get('/:id', async(req, res)=>{
    const tokenHeaders = req.headers.authorization
    const token = tokenHeaders && tokenHeaders.split(' ')[1]
    const result = await verifyToken(token)
    if(!result.email){
        res.sendStatus(403);
    }else{
        const user = await UserModel.find({ _id: req.params.id})
        console.log(`verified: ${result.email}`)
        res.send(user)
    }
})

//remove user
router.delete('/:id', async(req, res)=>{
    const removedDog = await UserModel.findOneAndDelete({_id: req.params.id})
    res.send('user has been deleted')
})

// update user
router.put('/:id', async(req,res)=>{
    const newUserInfo = req.body.data;    
    if(typeof newUserInfo.password === 'object'){
        const hashPassword = await bcrypt.hash(newUserInfo.password[0], 10)
        newUserInfo.password = hashPassword;
    }
    try {
        let doc = await UserModel.findOneAndUpdate({_id: req.params.id}, newUserInfo,{
            new: true});
        res.send(doc)
    } catch (err) {
        res.status(500).send(err)
    }
})

// add pet to my pets
router.put('/myPets/:id', async(req, res) => {
    const { status, petId } = req.body
    if(status === 'available'){
        try {
            let user = await UserModel.find({_id: req.params.id})
            user = await UserModel.findOneAndUpdate({_id: req.params.id}, {$pull: {pets: petId}} ,{
                new: true});
            res.send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        try {
            let user = await UserModel.find({_id: req.params.id})
            if(!user[0].pets.includes(petId)){
                user = await UserModel.findOneAndUpdate({_id: req.params.id}, {$push: {pets: petId}} ,{
                    new: true});
            }
            res.send(user)
        } catch (err) {
            res.status(500).send(err)
        }
    }
})

//remove pet from all users
router.delete('/removeDog/:id', async(req, res) => {
    try{
        let user = await UserModel.findOneAndUpdate({pets: {$in: req.params.id}}, 
            {$pull: {pets: req.params.id}}, {new: true});
        res.status(201).send('dog removed')
    } catch (err) {
        console.log(err)
        res.status(500).send('not removed')
    }       
})


module.exports = router 