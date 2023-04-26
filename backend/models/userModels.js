const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

 //In mongoose, a schema represents the structure of a particular document, either completely or just a portion of the document.

const userSchema = new mongoose.Schema({
     name:{
        type: String,
        required:[true, 'Please enter name']
     },
     email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate:[validator.isEmail, 'please enter valid email address']
     },
     password:{
        type:String,
        required:[true,'please enter password'],
        maxlength:[6, 'password cannot exceed 6 characters'],
        select: false
    },
     avatar:{
        type:String,
        
     },
     role:{
        type:String,
        default:'admin'
     },
     resetPasswordToken: String,
     resetPasswordTokenExpire: Date,
     createdAt:{
        type:Date,
        default:Date.now
     }
})
//convert the password into hash value
userSchema.pre('save', async function (next){
   if(!this.isModified('password')){
      next();
   }
   this.password = await bcrypt.hash(this.password, 10)
})
//generate the token by using id
userSchema.methods.getJwtToken = function(){//token generator
  return  jwt.sign({id:this.id}, process.env.JWT_SECERT,{expiresIn: process.env.JWT_EXPIRES_TIME})
}
//check the password
userSchema.methods.isValidPassword = async function(enteredPassword){
  return  bcrypt.compare(enteredPassword, this.password)

}
//forgot password
userSchema.methods.getResetToken =function(){
   //Generate Token
   const token = crypto.randomBytes(20).toString('hex');

   //Generate Hash and set to resetPasswordToken
  this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex'); //original string vachu hash string kudukum

  //Set token expire time
   this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
   
   return token
}
  
let model = mongoose.model('User',userSchema); //toconvert the file into module 

module.exports = model;

