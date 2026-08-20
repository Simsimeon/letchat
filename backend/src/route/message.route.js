const express = require("express");
const protectedRoute = require("../middleware/protectedRoute");
const router = express.Router();
const { getConversationsForSidebar,
    getUsersForSidebar,
    getSingleUserMessage,
    sendMessage
    
}= require("../controller/messge.controller");
const upload = require("../middleware/upload.middleware");

router.use(protectedRoute)

router.get("/users",getUsersForSidebar);
router.get("/conversation",getConversationsForSidebar)
router.get("/:id",getSingleUserMessage);
router.post("/send/:id",upload.single("media"),sendMessage);

 



















module.exports=router