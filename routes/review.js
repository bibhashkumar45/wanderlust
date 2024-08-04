const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../ErrorHandling/wrapAsync.js");
const { validateReview } = require("../middleware.js");
const { isLoggedIn } = require("../middleware.js");
const { isauthor } = require("../middleware.js");

// controller
const reviewControllers = require("../Controllers/review.js");


// Review Section
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);


// Delete Review
router.delete("/:reviewId", isLoggedIn, isauthor, reviewControllers.deleteReview);

module.exports = router;
