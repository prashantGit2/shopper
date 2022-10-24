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
    const resultsPerPage = 6;
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