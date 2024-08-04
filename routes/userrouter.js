const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../ErrorHandling/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

// userrouter
const userControllers = require("../Controllers/user.js");

// ---------------------------------------------------------------------------

// Router.route
// router.route("/signup")
// .get(userControllers.renderSignupform)         // signUp form
// .post(
//   wrapAsync(userControllers.signup)     // post signup form
// )




// signUp Form
router.get("/signup", userControllers.renderSignupform);

// post signup Form
router.post(
  "/signup",
  wrapAsync(userControllers.signup)
);


// ----------------------------------------------------------------------------------------------------


router.route("/login")
.get(userControllers.renderLoginform)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.login
);


// // login page
// router.get("/login",userControllers.renderLoginform);

// // passport.authenticate is function which provide by the node for match login details
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userControllers.login
// );

// ------------------------------------------------------------------------

// logout route
router.get("/logout",userControllers.logout );
module.exports = router;
