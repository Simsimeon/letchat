require("dotenv").config()
const express = require("express");
const app = express()
const connectDB = require("./lib/db");
const job = require("./lib/cron")
const cors = require("cors");  
const fs = require("node:fs");
const path = require("node:path");
const {clerkMiddleware} = require("@clerk/express");
const Frontal_End = process.env.FRONT_END_URL  
const clerkWebHook = require("./webhook/clerk.webhook")
const PORT = process.env.PORT || 3000;
const publicDir = path.join(process.cwd(),"public");
app.use("/api/webhook/clerk",express.raw({type:"application/json"}),clerkWebHook)


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


const start = async()=>{
     try{
         await connectDB(process.env.MONGO_URI)
         app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
        if(process.env.NODE_ENV === "production")job.start() 
         })
     }catch(err){
        console.log(`error listening at {PORT}`);
        
     }
}

start()