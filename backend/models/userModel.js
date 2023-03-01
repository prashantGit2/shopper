const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should be at least 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please enter Password"],
        minLength: [8, "Password should be at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user",

    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function (next){
    if (!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})
// JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    })
}
// compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
}
// Generating Password Reset Token
userSchema.methods.getPasswordResetToken = function (){
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex")
    const tokenCrypto = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordToken = tokenCrypto
    this.resetPasswordExpire = Date.now() + (15 * 60 * 1000)
    return resetToken
}

module.exports = mongoose.model("User",userSchema)