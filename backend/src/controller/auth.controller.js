const { StatusCodes } = require("http-status-codes")

 async function  checkAuth (req,res,next){
    if(!req.user){
     return res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized"})
    }
    res.status(StatusCodes.OK).json(req.user)
}


module.exports = checkAuth