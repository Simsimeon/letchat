require("dotenv").config()
const express = require("express");
const app = express()
const connectDB = require("./db/db");  
const {
    notFoundPageError,
    errorHandlerMiddleware
} = require("./middleware");
  
const PORT = process.env.PORT || 5001;


app.get('/',(req,res)=>{
res.send("Hello from the server");
})

app.use(notFoundPageError);
app.use(errorHandlerMiddleware);
const start = async()=>{
     try{
        // await connectDB()
         app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
            
         })
     }catch(err){
        console.log(`error listening at {PORT}`);
        
     }
}

start()