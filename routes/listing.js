const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const qwrapAsync= require("../utils/wrapAsync.js");
const {isLoggedin , ValidateListing} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../Cloudconfig.js");
const upload = multer({ storage });


//INDEX Route Create Route Delete Route
router.route("/")
.get(qwrapAsync(ListingController.index))
.post(isLoggedin , upload.single('listing[image]') , ValidateListing , qwrapAsync(ListingController.createListing));


//New Route
router.get("/new" , isLoggedin , ListingController.renderNewForm);


//Show route Update Route
router.route("/:id")
.get(qwrapAsync(ListingController.showListing))
.put(isLoggedin , isOwner , upload.single('listing[image]') ,ValidateListing ,qwrapAsync(ListingController.updateListing))
.delete(isLoggedin , isOwner , qwrapAsync(ListingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedin , isOwner , qwrapAsync(ListingController.renderEdit));
  

module.exports = router;