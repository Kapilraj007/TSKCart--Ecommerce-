const mongoose = require('mongoose');

const connectDatabase = () =>{ // it is function we use in server.js
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connected to the Host: ${con.connection.host}`);
    })

}

module.exports = connectDatabase;