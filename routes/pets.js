const express = require('express')
let router = express.Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer');
const mongoose = require('mongoose');
const PetModel = require('../models/pets');
const { route } = require('./auth');

router.use(express.json())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './database/petImages')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


let upload = multer({ storage: storage })

router.use(express.static('database'))

// add pet to the database
router.post('/uploads', upload.single('avatar'), async(req, res, next) => {
    let obj = JSON.parse(req.body.dogProfile);
    
    const imagePath = `petImages/${req.file.filename}`
    const petObj = {...obj, picture: imagePath}
    const pet = new PetModel(petObj);
    try {
        await pet.save();
            res.send(pet);
    } catch (err) {
            res.status(500).send(err);
    }
});

// update pet with picture to the database
router.put('/updateFile/:id', upload.single('avatar'), async(req, res, next) => {
    let obj = JSON.parse(req.body.dogProfile)
    const imagePath = `petImages/${req.file.filename}`
    const petObj = {...obj, picture: imagePath}
    try{
        const updateDog = await PetModel.findOneAndUpdate({_id: req.params.id}, (petObj))
        res.status(201).send(updateDog)
    } catch (err){
        res.status(500).send(err)
    }
})

// update pet without picture to database
router.put('/update/:id', async(req,res) =>{
    let obj = req.body
    console.log(obj)
    try{
        const updateDog = await PetModel.findOneAndUpdate({_id: req.params.id}, (obj))
        res.status(201).send(updateDog)
    } catch (err){
        res.status(500).send(err)
    }
})


// get all pets
router.get('/', async(req,res) =>{
    const petsDb = await PetModel.find({})
    res.send(petsDb)
})

//get my pets
router.get('/myPets/:id', async(req, res) => {
    try {
        const myPets = await PetModel.find({ owner: req.params.id})
        res.status(201).send(myPets)
    } catch (err){
        res.status(400).send(err)
    }
})

// const myPets = await PetModel.find({ owner: { $in: req.params.id}})

//search dog
router.post('/search', async(req, res) => {
    const { dogType, height, weight, status, dogName } = req.body
    let filters = {}
    if(dogType) filters.dogType = dogType
    if(height) filters.height = { $gt : height }
    if(weight) filters.weight = { $gt : weight }
    if(status) filters.status = status
    if(dogName) filters.dogName = { $regex : new RegExp(dogName, "i") }
        
    const results = await PetModel.find(filters)
    res.send(results)
})

//change dog status
router.put('/:id', async(req, res) => {
    const { status, userId } = req.body 
    try {
        let updatedDog
        if(status != 'available'){
            updatedDog = await PetModel.findOneAndUpdate({_id: req.params.id},
                        { status: status, owner: userId } ,{new: true});
                res.status(201).send(updatedDog)
        } else {
            updatedDog = await PetModel.findOneAndUpdate({_id: req.params.id},
                { status: 'available', owner: '' } ,{new: true});
        res.status(201).send(updatedDog)
        }
        } catch (err) {
            res.status(500).send('err')
        }   
        
})

router.put('/owner/:id', async(req, res) => {
    let updateDog = await PetModel.updateMany({owner: req.params.id},
        {owner:'', status:'available'}, {new: true});
        res.status(201).send('owner deleted')
})

router.get('/update/:id', async(req, res) => {
    const dogInfo = await PetModel.findById(req.params.id) 
    res.send(dogInfo)
})

router.delete(`/delete/:id`, async(req, res) => {
    const removedDog = await PetModel.findOneAndDelete({_id: req.params.id})
    res.send('dog has been deleted')
})

// let dogStatus = await PetModel.find({_id: req.params.id})
// if(!dogStatus[0].owner.includes(userId)){
//     updatedDog = await PetModel.findOneAndUpdate({_id: req.params.id},
//         { status: status, $push: {owner: userId} } ,{
//             new: true});
// } else {
//     updatedDog = await PetModel.findOneAndUpdate({_id: req.params.id},
//         { status: status } ,{
//             new: true});
// }


module.exports = router ;

