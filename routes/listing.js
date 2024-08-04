const express = require("express");
const router = express.Router();
const wrapAsync = require("../ErrorHandling/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListings } = require("../middleware.js");
// multer third party to handle file upload in form
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
// multer by default store the file into cloud store not in localmemory
const upload = multer( {storage});
// const upload = multer( {dest: 'uploads/' });



// controllers
const llistingControllers = require("../Controllers/listing.js");


// Use router.route function  ---------------------------------------------------

router.route("/")
.get(wrapAsync(llistingControllers.index))     // index page
.post(                                           
 
  isLoggedIn,
  upload.single('listing[image]'),
  validateListings,
  wrapAsync(llistingControllers.createlisting)                          
//   // post route - to add new data into database
);



// new route
router.get("/new", isLoggedIn, llistingControllers.rendernewform);


router.route("/:id")
.get(wrapAsync(llistingControllers.showroute))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListings,
  wrapAsync(llistingControllers.updateRoute)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(llistingControllers.deleteRoute)
);


// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(llistingControllers.editRoute)
);

// ----------------------------------------------------------------------------------------------------




// index page
// router.get("/", wrapAsync(llistingControllers.index));



// Show route
// router.get("/:id", wrapAsync(llistingControllers.showroute));

// post route - to add new data into database
// router.post(
//   "/",
//   validateListings,
//   isLoggedIn,
//   wrapAsync(llistingControllers.createlisting)
// );



// Update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListings,
//   wrapAsync(llistingControllers.updateRoute)
// );

// Delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(llistingControllers.deleteRoute)
// );

module.exports = router;
