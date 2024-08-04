const User = require("../models/User.js");

module.exports.renderSignupform=(req, res) => {
        res.render("./user/signUp.ejs");
      }

module.exports.signup=async (req, res) => {
        try {
          // it does not let go to error
          let { username, email, password } = req.body;
          let newUser = new User({ username, email });
          let resisterUser = await User.register(newUser, password);
          console.log(resisterUser);
    
          // login function  to automatically login in page and after signup
          req.login(resisterUser, (err) => {
            if (err) {
              return next(err);
            }
            req.flash("success", "Welcome to RentalHome");
            res.redirect("/listings");
          });
        } catch (e) {
          req.flash("error", e.message);
          res.redirect("/signup");
        }
      }

// login form render
module.exports.renderLoginform=(req, res) => {
        res.render("./user/login.ejs");
      }

// Post login form
module.exports.login=(req, res) => {
        req.flash("success", "Welcome back to RentalHome");
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect( redirectUrl);
      }

// Logout rote
module.exports.logout=(req, res, next) => {
        req.logOut(
          (
            err // logout() is build in function which logout the user from site
          ) => {
            if (err) {
              return next(err);
            }
            req.flash("success", "You logged out from the site");
            res.redirect("/listings");
          }
        );
      }