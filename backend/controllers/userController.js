const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const sendToken = require('../utils/JWTToken')



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
    sendToken(user,201,res)
})


// login user
exports.loginUser = catchAsyncError(async (req,res,next) => {
    console.log("body",req.body)
    const {email,password} = req.body;
    // checking if user has giver password and email both
    if(!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password",400))
    }
    const user = await User.findOne({email}).select("+password")

    if (!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    const isPasswordMatched = user.comparePassword(password)

    if (!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user,200,res)
})