const { response } = require("../App")

exports.getAllProducts = (req,res) => {
    response.status(200).json({message:"Route is working fine"})
}