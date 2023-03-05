const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const ApiFeatures = require('../utils/apiFeatures')
const catchAsyncError = require('../middleware/catchAsyncError')



// create Product
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        product
    })
})


// get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultsPerPage = 10;
    const productsCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultsPerPage)
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        page: req.query.page || 1,
        productsCount,
        resultsPerPage,
        products
    })
})
// get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})

//update a product -- admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.remove()

    res.status(200).json({
        success: true,
        message: 'product deleted successfully'
    })
})

// Create new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating
                rev.comment = comment
            }
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let sum = 0;
    product.reviews.forEach(rev => sum += rev.rating)
    product.ratings = sum/product.reviews.length
    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })

})

// Get All reviews of a product
exports.getProductReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.id)
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

exports.deleteReview = catchAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    const reviews = product.reviews.filter (rev => rev._id.toString() !== req.query.id.toString())
    let sum = 0;
    reviews.forEach(rev => sum += rev.rating)
    const ratings = sum/reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews: reviews.length}, {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success:true
    })

})

