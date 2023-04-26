const express = require('express');

const app = express();

const errormiddleware =require('./middlewares/error')

const dotenv = require('dotenv');



const path = require('path')//path module is to create a absoulate path




const cookieParser = require('cookie-parser');
dotenv.config({path:path.join(__dirname,"config/config.env")}) //to connect the .env file to dotenv

app.use(express.json());//accepet the jason request
app.use(cookieParser());//to parses cookies attached to the client(browser or postman) request object
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
const products = require('./routes/product')
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1',products); //middleware function

app.use('/api/v1',auth); 
app.use('/api/v1',order); 
app.use('/api/v1',payment); 

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.use(errormiddleware)

module.exports = app;