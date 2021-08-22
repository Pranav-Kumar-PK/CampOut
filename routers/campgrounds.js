const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { isLoggedin, validateCampground, isAuthor, emailVerified } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const { storage } = require("../cloudinary"); //node automatically looks for index file in a folder
const multer = require('multer');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, emailVerified, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedin, emailVerified, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, emailVerified, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, emailVerified, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedin, emailVerified, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;