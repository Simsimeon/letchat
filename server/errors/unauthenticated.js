const {StatusCodes}= require("http-status-codes")

const CustomApiError = require("../errors/customApiError");


class UnauthenticatedError extends CustomApiError{
    constructor(message){
        super(message)
        this.status = StatusCodes.UNAUTHORIZED
    }
};

module.exports = UnauthenticatedError;