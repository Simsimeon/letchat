const multer = require("multer");


const MAX_FILE_SIZE = 25 * 1024 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{fileSize:MAX_FILE_SIZE},
    fileFilter:(req,file,cd)=>{
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
      if(!isImage && !isVideo){
        cd(new Error("Only image and video uploads are allowed") )
        return
      }

      cd(null,true);

    }
    
})

module.exports = upload;