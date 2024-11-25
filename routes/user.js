const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const qwrapAsync= require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

router.get("/signup" , UserController.rendersignup);

router.post("/signup" , qwrapAsync(UserController.signup));

router.get("/login" , UserController.renderLogin);

router.post("/login" , saveRedirectUrl ,passport.authenticate("local" , { failureRedirect : '/login' , failureFlash: true }) , UserController.Login);

router.get("/logout" , UserController.Logout);

module.exports = router ;