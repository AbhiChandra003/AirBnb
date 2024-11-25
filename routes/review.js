const express = require("express");
const router = express.Router({mergeParams : true });
const qwrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedin , validateReview , isAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


//Review
router.post("/" , isLoggedin , validateReview , qwrapAsync(ReviewController.createReview));

router.delete("/:reviewId", isLoggedin , isAuthor , qwrapAsync(ReviewController.deleteReview));

module.exports = router;