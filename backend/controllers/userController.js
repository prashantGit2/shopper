const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')



// create Product
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is a sample id",
            url: "sample url"
        }
    })
    res.status(201).json({
        success: true,
        user
    })
})


// get all products
// exports.getAllProducts = catchAsyncError(async (req, res) => {
//     const resultsPerPage = 6;
//     const productsCount = await Product.countDocuments()
//     const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultsPerPage)
//     const products = await apiFeature.query;
//     res.status(200).json({
//         success: true,
//         page: req.query.page || 1,
//         productsCount,
//         resultsPerPage,
//         products
//     })
// })
// // get product details
// exports.getProductDetails = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.params.id)
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404))
//     }
//     res.status(200).json({
//         success: true,
//         product
//     })
// })

// //update a product -- admin
// exports.updateProduct = catchAsyncError(async (req, res, next) => {
//     let product = await Product.findById(req.params.id)
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404))
//     }
//     product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })

//     res.status(200).json({
//         success: true,
//         product
//     })
// })

// exports.deleteProduct = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.params.id)
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404))
//     }
//     await product.remove()

//     res.status(200).json({
//         success: true,
//         message: 'product deleted successfully'
//     })
// })