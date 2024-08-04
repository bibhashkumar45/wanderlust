const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview=async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
    
        let newreview = new Review(req.body.review);
    
        // add review author to review
        newreview.author = req.user._id;
    
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        req.flash("success", "successfully review added");
        res.redirect(`/listings/${id}`);
        // res.send("Successfull");
      }
      
module.exports.deleteReview=async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull removes all instances of a specified value or values from an array
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", " successfully review deleted");
        res.redirect(`/listings/${id}`);
      }