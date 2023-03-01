const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/JWTToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// create Product
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "sample url",
    },
  });
  sendToken(user, 201, res);
});

// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  console.log("body", req.body);
  const { email, password } = req.body;
  // checking if user has giver password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});
// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get reset password token
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token is : \n\n\t ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Shopper Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ 
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now()},
  });
  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
  }
  if (req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesn't match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save()
  sendToken(user,200,res)
});

// GET USER DETAILS
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  
  res.status(200).json({
      success: true,
      user
  })
})

// UPDATE USER PASSWORD
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  console.log(":::isPasswordMatched",isPasswordMatched)
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old Password is incorrent", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password doesn't match", 400));
  }
  user.password = req.body.newPassword;
  await user.save()
  sendToken(user,200,res)
})

// UPDATE USER PROFILE
exports.updateProfile = catchAsyncError(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }
  // we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{new:true,runValidators:true,useFindAndModify: false})
  res.status(200).json({
    success:true,
    user
  })
})

// GET ALL USERS
exports.getAllUsers = catchAsyncError(async (req, res,next) => {

  const users = await User.find()
  
  res.status(200).json({
      success: true,
      users
  })
})
// GET SINGLE USER DETAILS -- ADMIN
exports.getAUser = catchAsyncError(async (req, res,next) => {

  const user = await User.findById(req.params.id)
  if (!user){
    return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
  }
  res.status(200).json({
      success: true,
      user
  })
})

// UPDATE USER ROLE -- ADMIN
exports.updateUser = catchAsyncError(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role,
  }
  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{new:true,runValidators:true,useFindAndModify: false})
  res.status(200).json({
    success:true,
    user
  })
})

// DELETE USER -- ADMIN
exports.deleteUser = catchAsyncError(async (req, res, next) => {

  // we will remove cloudinary
  const user = await User.findById(req.params.id) 
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`,400))
  }
  await user.remove()
  
  res.status(200).json({
    success:true,
    message:"User deleted Successfully"
  })
})
