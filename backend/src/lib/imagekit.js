const ImageKit = require("@imagekit/nodejs");
const {toFile}=require("@imagekit/nodejs");


function hasImageKitConfig(){
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY)
}

// originalName= "My Photo (1).png"
// result: "chat-1749300000000-My_Photo__1_.png"
// this helper makes a safe, unique filename for uploaded files.
function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}
async function uploadChatMedia(file){
  if (!hasImageKitConfig()) {
    throw new Error("ImageKit is not configured");
  }

  const imageKit = new ImageKit({privateKey: process.env.IMAGEKIT_PRIVATE_KEY});
    const filename = createFileName(file.originalname);
  const result = await imageKit.files.upload({
    file: await toFile(file.buffer,filename,{type: file.mimetype}),
    fileName: filename,
    folder:"/chat",
  })
 

return result.url;
}

module.exports= {uploadChatMedia,hasImageKitConfig}