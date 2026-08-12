const {StatusCodes}= require("http-status-codes")

const CustomApiError = require("../errors/customApiError");


class UnauthorizedError extends CustomApiError {
    constructor(message){
        super(message)
        this.status = StatusCodes.FORBIDDEN
    }
}

module.exports = UnauthorizedError;