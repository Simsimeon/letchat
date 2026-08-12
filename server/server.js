require("dotenv").config()
const express = require("express");
const app = express()
const connectDB = require("./db/db");
const cors = require("cors")  
const {
    notFoundPageError,
    errorHandlerMiddleware
} = require("./middleware");
const {clerkMiddleware} = require("@clerk/express");
const Frontal_End = process.env.FRONT_END_URL  
const PORT = process.env.PORT || 5001;
app.use(express.json())
app.use(cors({origin:Frontal_End, credentials:true}))
app.use(clerkMiddleware())
app.get('/',(req,res)=>{
res.send("Hello from the server");
})

app.use(notFoundPageError);
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