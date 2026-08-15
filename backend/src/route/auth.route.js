const express = require("express");
const checkAuth = require("../controller/auth.controller");
const protectedRoute = require("../middleware/protectedRoute");


const router = express.Router();

router.get("/check",protectedRoute,checkAuth)



module.exports = router