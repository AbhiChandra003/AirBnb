const passport = require("passport");
const User = require("../models/user.js");

module.exports.rendersignup = (req,res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req , res) => {
    try {
        let {username , email , password} = req.body;
    const newUser = new User({email , username});
    const regUser = await User.register(newUser , password);
    console.log(regUser);
    req.login(regUser , (err) => {
        if(err) {
            return next(err);
        }
        else{
            req.flash("success" , "Welcome to AirBnb");
            res.redirect("/listings");
        }
    });
    }catch(e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req,res) => {
    res.render("./users/login.ejs");
};

module.exports.Login = async(req,res) => {
    req.flash("success" , "Welcome to AirBnb");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.Logout = (req , res , next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success" , "You are logged out!");
        res.redirect("/listings");
    });
}