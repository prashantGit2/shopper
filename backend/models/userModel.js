const mongoose = require('mongoose')
const validator = require('validator')

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
module.exports = mongoose.model("user",userSchema)