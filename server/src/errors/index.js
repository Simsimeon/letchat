const BadRequestError = require("../errors/BadRequest");
const NotFoundError = require("../errors/notFound");
const UnauthenticatedError = require("../errors/unauthenticated");
const UnauthorizedError = require("../errors/unauthorized"); 



module.exports={
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError
}