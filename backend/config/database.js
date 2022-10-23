const mongoose = require('mongoose')

const connectDatabase = () => {

    mongoose.connect(process.env.DB_URL, {}).then((data) => {
        console.log("Connected to MongoDB ",data)
    })
}

module.exports = connectDatabase