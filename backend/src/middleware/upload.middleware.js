const multer = require("multer");


const MAX_FILE_SIZE = 25 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{fieldSize:MAX_FILE_SIZE},
    fileFilter:(req,res,cd)=>{
        const isImage = File.mimetype.startsWith("image/")
        const isVideo = File.mimetype.startsWith("video/")
      if(!isImage || !isVideo){
        cd(new Error("Only image and video uploads are allowed") )
        return
      }

    cd(null,true);

    }
    
})

module.exports = upload;