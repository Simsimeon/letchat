const express = require("express");
const protectedRoute = require("../middleware/protectedRoute");
const router = express.Router();
const { getConversationsForSidebar,
    getUsersForSidebar,
    getSingleUserMessage,
    sendMessage
    
}= require("../controller/messge.controller");
const upload = require("../middleware/upload.middleware");
const multer = require("multer");

router.use(protectedRoute)

router.get("/users",getUsersForSidebar);
router.get("/conversation",getConversationsForSidebar)
router.get("/:id",getSingleUserMessage);
router.post("/send/:id", (req, res, next) => {
    upload.single("media")(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({message: "Media must be 25 MB or smaller"});
        }

        return res.status(400).json({message: error.message || "Invalid media upload"});
    });
}, sendMessage);

 



















module.exports=router