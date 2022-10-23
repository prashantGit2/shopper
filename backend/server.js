const app = require('./App')


// config
const dotenv = require('dotenv')
dotenv.config({path:"backend/config/config.env"})

const connectDatabase = require('./config/database')

connectDatabase()



app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT)
})