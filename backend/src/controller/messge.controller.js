const { StatusCodes, REQUEST_HEADER_FIELDS_TOO_LARGE } = require("http-status-codes");
const User = require("../model/User");
const Message = require("../model/Message");
const {uploadChatMedia,hasImageKitConfig} =require("../lib/imagekit");
const { getReceiverSocketId, io } = require("../lib/socket");

async function getUsersForSidebar(req,res){
   try{
   const loggedInUserId = req.user._id;

   const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-clerkId")
    res.status(StatusCodes.OK).json(filteredUsers)
   } catch(err){
     console.log("Error in getUsersForSidebar:", err.message);
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"}); 
   }
}

async function getConversationsForSidebar(req,res){
    try{
        const loggedInUserId =req.user._id;
   const conversation = await Message.aggregate([
    {$match:{$or:[{senderId:loggedInUserId},{receiverId:loggedInUserId}]}},
    {
        $group:{
            _id:{$cond:[{$eq:['$senderId',loggedInUserId]},"$receiverId","$senderId"]},
            lastMessageAt:{$max:"$createdAt"}
        },
    },
    {$sort:{lastMessageAt:-1}},
    {$lookup:{from:"users", localField:"_id",foreignField:"_id",as:"user"}},
    {$replaceRoot:{newRoot:{$first:"$user"}}},
    {$project:{clerkId:0}}
   ]);
   res.status(StatusCodes.OK).json(conversation);
    }catch(error){
    console.error("Error in getting conversion for side bar",error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"}) 
    }
    
}


async function getSingleUserMessage(req,res){
    try{
    const {id:userToChatId}=req.params;
    const myId = req.user._id;

    const message = await Message.find({
        $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    }).sort({createdAt:1})
    res.status(StatusCodes.OK).json(message);
  

    }catch(error){
    console.error("Error in getting conversion for side bar",error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"}) 
    }
   
}
async function sendMessage(req,res){
   try{
    const {text} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    if(req.file){
            if (!hasImageKitConfig) {
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({message: "Media upload is not configured"});
            }
      const url = await uploadChatMedia(req.file)
      if(req.file.mimetype.startsWith("video/")) videoUrl=url
      else imageUrl = url;
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
        video:videoUrl
    })
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
    } 
    res.status(StatusCodes.CREATED).json({newMessage})
   }catch(error){
    console.error("Error in sending message",error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"}) 
   }
    
}
module.exports = {
    getConversationsForSidebar,
    getUsersForSidebar,
    getSingleUserMessage,
    sendMessage
}