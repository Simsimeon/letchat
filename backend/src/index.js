require("dotenv").config()
const express = require("express");
const app = express()
const connectDB = require("./lib/db");
const cors = require("cors");  
const fs = require("node:fs");
const path = require("node:path");
const {clerkMiddleware} = require("@clerk/express");
const Frontal_End = process.env.FRONT_END_URL  
const PORT = process.env.PORT || 3000;
const publicDir = path.join(process.cwd(),"public");
app.use(express.json())
app.use(cors({origin:Frontal_End, credentials:true}))
app.use(clerkMiddleware())
app.get('/heath',(req,res)=>{
res.send("Hello from the server");
})


if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  
  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.use(errorHandlerMiddleware);
const start = async()=>{
     try{
         await connectDB(process.env.MONGO_URI)
         app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
            
         })
     }catch(err){
        console.log(`error listening at {PORT}`);
        
     }
}

start()