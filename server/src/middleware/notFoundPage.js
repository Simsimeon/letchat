const {StatusCodes}=require("http-status-codes")


const notFoundPageError = async(req,res)=> res.status(StatusCodes.NOT_FOUND);


module.exports = notFoundPageError;