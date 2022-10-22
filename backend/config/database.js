const mongoose = require('mongoose')

const connectDatabase = () => {

    mongoose.connect(process.env.DB_URL, {}).then((data) => {
        console.log("Connected to MongoDB ",data)
    }).catch((err) => {
        console.log("Error in connecting to MongoDB",err)
    })
}

module.exports = connectDatabase