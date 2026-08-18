const {getAuth, clerkClient} = require("@clerk/express")
const User = require("../model/User");
const {StatusCodes}=require("http-status-codes")
async function protectedRoute(req,res,next){
    try{
    const {userId}=getAuth(req);

     
     
    if(!userId){
        res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized"})
     return
    }

        let user= await User.findOne({clerkId:userId})
      if(!user){
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses?.find(
          (address) => address.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;
        const fullName =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          email?.split("@")[0];

        user = await User.findOneAndUpdate(
          {clerkId:userId},
          {clerkId:userId, email, fullName, profilePic:clerkUser.imageUrl},
          {new:true, upsert:true, setDefaultsOnInsert:true},
        );
      }
    req.user=user
    console.log(userId);
    next()
    }catch(err){
     console.error("Error in protectRoute middleware",err.message);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
 
    }
}


module.exports = protectedRoute