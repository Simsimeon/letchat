const {getAuth} = require("@clerk/express")
const User = require("../model/User");
const {StatusCodes}=require("http-status-codes")
async function protectedRoute(req,res,next){
    try{
    const {userId}=getAuth();
    if(!userId){
        res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized"})
     return
    }

      const user=  await User.findOne({clerkId:userId})
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json({message:"User profile is not synced yet"})
     return
    }
    req.user=user
    next()
    }catch(err){
     console.error("Error in protectRoute middleware",err.message);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
 
    }
}


module.exports = protectedRoute