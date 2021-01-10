require('dotenv').config()
const express = require('express')
const app = express();
const router = express.Router()
const pets = require('./routes/pets')
const authRoute = require('./routes/auth')
const port = process.env.PORT 
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())

const dbUrl = process.env.DATABASE_URL
mongoose.connect(dbUrl, { 
    useNewUrlParser : true,  
    useUnifiedTopology: true}
    , function(error) { 
        if (error) { 
            console.log("Error!" + error); 
        } else {
            console.log('Connencted to db')
}});



app.use('/pets', pets);
app.use('/users', authRoute)

app.get('/', (req,res) =>{
    res.send('hello')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
