const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = await req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401)) 
    };
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
})