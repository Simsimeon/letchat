const { StatusCodes } = require("http-status-codes")

 async function  checkAuth (req,res,next){
    if(!req.user){
     return res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized"})
    }
    const { clerkId}= req.user
    
    res.status(StatusCodes.OK).json(clerkId)
}


module.exports = checkAuth