const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsync = require("../utilities/catchAsync");
const { validateReview, isLoggedin, isReviewAuthor, emailVerified } = require("../middleware");

router.post('/', isLoggedin, emailVerified, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedin, emailVerified, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;