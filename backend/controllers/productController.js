const catchAsyncError = require('../middlewares/catchAsyncError');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const Apifeatures = require('../utils/apiFeatures');
//Get product = api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next)=>{
    const resPerPage = 6;
    
    let buildQuery = () => {
        return new Apifeatures(Product.find(), req.query).search().filter()
    }
    
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    
    const products = await buildQuery().paginate(resPerPage).query;

    res.status(200).json({
        success : true,
        count: productsCount,
        resPerPage,
        products
    })
})
//admin routes
//create product = /api/1/product/new
exports.newProduct = catchAsyncError(async (req,res,next) =>{ //here to make our product code
   let images = []
   let BASE_URL = process.env.BACKEND_URL;
   if(process.env.NODE_ENV === "production"){
       BASE_URL = `${req.protocol}://${req.get('host')}`
   }
   if(req.files.length > 0){
    req.files.forEach( file =>{
        let url = `${BASE_URL}/product/${file.originalname}`
    images.push({ image : url})
    })

   }
   req.body.images = images;
    req.body.user = req.user.id;
    const product = await Product.create(req.body) //body==req la erukka jason data 
   res.status(201).json({ //201 req successfully complete and get the data 
    success:true,
    product //product:product
   })
}
);
//get single product = /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req,res,next) =>{
   let product = await Product.findById(req.params.id).populate('reviews.user','name email');

    if(!product){
      return  next(new ErrorHandler("Product not found",400))
      //parameter of errorhandler class
    }
    res.status(201).json({
        success:true,
        product
    })

})
//update product = /api/v1/product/:id
exports.updateProduct =catchAsyncError( async(req,res,next) =>{
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    //if imags not cleared wekeep existing images
    if(req.body.imagesCleares === 'false'){
        images = product.images;
    }
    if(req.files.length > 0){
     req.files.forEach( file =>{
         let url = `${BASE_URL}/uploads/product/${file.originalname}`
     images.push({ image : url})
     })
 
    }
    req.body.images = images;
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        });
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        product
    })
})

//delete product -/api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.deleteOne();


    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })

})

//create review - api/v1/review

exports.createReview = catchAsyncError(async (req, res, next) =>{
    const  { productId, rating, comment } = req.body;

    const review = {
        user : req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId);
   //finding user review exists
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })


})


//get reviews -api/v1/reviews?id=

exports.getReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id).populate('reviews.user','name email');;

    res.status(200).json({
        success: true,
        reviews: product.reviews

    })
})

//delete review = api/v1/review

exports.deleteReview = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    //filtering the reviews which does not match the deleting review id
    const reviews = product.reviews.filter(review =>{
       return review._id.toString() !== req.query.id.toString()
    });
    //numof review update
    const numOfReview = reviews.length;

     //finding the average with the filtered reviews
     let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReview,
        ratings
    })
    res.status(200).json({
        success:true
    })
})

//get admin products = api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async(req,res,next)=>{
    const products = await Product.find();
    res.status(200).send({
        succcess:true,
        products
    })
});