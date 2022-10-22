const { response } = require("../App")

exports.getAllProducts = (req,res) => {
    res.status(200).json({message:"Route is working fine"})
}