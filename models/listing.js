const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./User.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    // type: String,
    // default:
    //   "https://img.freepik.com/free-photo/3d-electric-car-building_23-2148972401.jpg?t=st=1721419132~exp=1721422732~hmac=e03705ee68482a6ad2af4229b53667d68d3a848d61d3486030b5568240018cc5&w=1060",
    // set: (v) =>
    //   v === ""
    //     ? "https://img.freepik.com/free-photo/3d-electric-car-building_23-2148972401.jpg?t=st=1721419132~exp=1721422732~hmac=e03705ee68482a6ad2af4229b53667d68d3a848d61d3486030b5568240018cc5&w=1060"
    //     : v,


    url:String,
    filename:String,
    
  },
  price: {
    type: Number,
  },
  country: {
    type: String,
  },
  location: {
    type: String,
  },
  reviews: [
    {
      // Reference of review schema
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // mongooes geojson
  geometry:{
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
});

// post middelware to delte all review when one list will delete
// it is automatically called by

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
