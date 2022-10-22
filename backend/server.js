const app = require('./App')

const dotenv = require('dotenv')


// config

dotenv.config({path:"backend/config/config.env"})



app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT)
})