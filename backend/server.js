const app = require('./App')
const dotenv = require('dotenv')

// handling uncaught exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message} `)
    console.log("Shutting down the server due to uncaught exception.......")
    process.exit(1)
})

// config
dotenv.config({path:"backend/config/config.env"})

// database
const connectDatabase = require('./config/database')
connectDatabase()

const server = app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT)
})

// unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    console.log("Shutting down the server due to unhandled promise rejection.......")
    server.close(()=>{
        process.exit(1);
    })

});