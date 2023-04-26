const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModels');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');

const sentToken =require('../utils/jwt')
const crypto = require('crypto');
const { log } = require('console');
//register = /api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next)=>{ //request hander
    const {name, email, password} = req.body;
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}` //protocol http eduthuku img oda url create panniahu
    }
  const user = await User.create({ //create - > to c reate  document in database
        name,
        email,
        password,
        avatar
    });
    sentToken(user, 201, res)
}) 
//login = /api/v1//login
exports.loginUser = catchAsyncError( async(req, res, next) =>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('please enter email & password'));

    }
    //finding the user's database 
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email & password',401));

    }
    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email & password',401));
    }
    sentToken(user, 201, res)
})
//logoutuser - api/v1/logout
exports.logoutUser = (req,res,next) =>{
    res.cookie('token', null, { //to remove the token
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "LoggedOut"
    })
}
//forgot password = api/v1//password/forgot
exports.forgotPassword = catchAsyncError( async (req, res, next)=>{
    const user =  await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave: false})
    
    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    //Create reset url
    const resetUrl= `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n 
   ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

    try{
        sendEmail({
            email: user.email,
            subject: "TSKcart Password Recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message), 500)
    }

})  
//resetpassword = api/v1/password/reset/:token
exports.resetPassword = catchAsyncError( async (req, res, next)=>{
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); //email la erukka token ha first hash value va change pannanum
   //email erukura tokenum db la eruka token nu same erukka nu check pannum

   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire:{
        $gt: Date.now()
    }
   })
   if(!user){
    return next(new ErrorHandler('Password reset token invaild or expired'))
   }
   if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler('Password does not match'))
   }
   user.password = req.body.password;//to change the old password
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpire = undefined;
   await user.save({validateBeforeSave: false})
   sentToken(user, 201, res);
})

//Get User profile = api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//change password = /api/v1/password/change

exports.changePassword = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('Old password is incorrect'),401)
    }
    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true
    })
})

//updateProfile = /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next)=>{
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}` //protocol http eduthuku img oda url create panniahu
        newUserData = {...newUserData,avatar}
    }
  const user = await  User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Get All Users =/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next)=>{
   const users = await User.find();
   res.status(200).json({
    success: true,
    users
   })
})

//Admin: Get Specific Users = /api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this ${req.params.id}`))
    }
    res.status(200).json({
     success: true,
     user
    })
 })


//Admin: Update Users = /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
  const user = await  User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
 })

 //Admin: Delete User = /api/v1/admin/user/:id
 exports.deleteUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
     success: true,
    })
 })