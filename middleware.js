const Listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const expressError = require("./ErrorHandling/expressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // joi Implementing
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // error come in the forn of object
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // joi Implementing
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // error come in the forn of object
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path,"..",req.originalUrl);    // this is inside the req
  if (!req.isAuthenticated()) {
    // store originalUrl of attemted path
    req.session.redirectUrl = req.originalUrl;
    // check user loged in or not
    req.flash("error", "you must be logged in to create listings");
    return res.redirect("/login");
  }
  next();
};

// After the login  passport automatically reset req.session.redirectUrl by default
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// authotrazation for not give access to update non login user

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curUser._id)) {
    req.flash("error", "You are not owner of this listings");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Review delete button authorization
module.exports.isauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.curUser._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
