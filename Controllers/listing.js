// MVC based project
// MVC- Model, views, controllers
// Model- Store database schema
// view - it used to contain all frontend render files 
// controllers- it used to contain all backend program

const Listing = require("../models/listing");
// mapbox-sdk require
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });


// index callback
module.exports.index=async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listing/index.ejs", { allListings });
      };

// new form callback ---------------------------------------------------
module.exports.rendernewform=(req, res) => {
        res.render("listing/new.ejs");
      };

// new route
// router.get("/new", isLoggedIn, (req, res) => {
//   // console.log(req.user);     // it store user related data in a session while login
//   // if(!req.isAuthenticated())  // check user loged in or not
//   // {
//   //   req.flash("error","you must be logged in to create listings");
//   //   return res.redirect("/login");
//   // }

//   res.render("listing/new.ejs");
// });
// -------------------------------------------------------------


//show route callback
module.exports.showroute=async (req, res, next) => {
        let { id } = req.params;
        // let listing = await Listing.findById(id).populate("reviews").populate("owner");
        let listing = await Listing.findById(id)
          .populate({ path: "reviews", populate: { path: "author" } })
          .populate("owner"); // insted populate function
    
        if (!listing) {
          req.flash("error", "Listing does not exits");
          res.redirect("/listings");
        }
    
        res.render("listing/show.ejs", { listing });
      }


// post route callback

module.exports.createlisting=async (req, res, next) => {

//  Finding codinates of locations like latitudes and longitudes
   let response=await geocodingClient.forwardGeocode({
    query:req.body.listing.location,
    limit: 1
  })
    .send()
  
  

  // image url extract from cloud
       let url=req.file.path;
       let filename=req.file.filename;

        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id; // add owner to current user details
        listing.image={url,filename};   // add url and filename

        // Add location coordinates databaes
        listing.geometry=response.body.features[0].geometry;

        const list = await listing.save();
        console.log(list);
        req.flash("success", "New listing successfully created");
        res.redirect("/listings");
      }
// Edit route
module.exports.editRoute=async (req, res) => {
        let { id } = req.params;
        listing = await Listing.findById(id);
    
        if (!listing) {
          req.flash("error", "Listing does not exits"); // error flash
          res.redirect("/listings");
        }

        let originalUrl=listing.image.url;
        originalUrl=originalUrl.replace("/upload","/upload/ar_1.0,c_fill,");
    
        res.render("listing/edit.ejs", { listing ,originalUrl});
      }
// Update Route
module.exports.updateRoute=async (req, res) => {

        let { id } = req.params;
        let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        // upload image
        if(typeof  req.file!=="undefined")
        {
          let url=req.file.path;
          let filename=req.file.filename;
          listing.image={url,filename};   // add url and filename
           await listing.save();
        }
       
        req.flash("success", "Successfully update your listing");
        res.redirect(`/listings/${id}`);
      }
// Delete route

module.exports.deleteRoute=async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndDelete(id); // it will call post middleware
        console.log(listing);
        req.flash("success", "Successfully Delete your listing");
        res.redirect("/listings");
      }
