const express = require('express');
const router = express.Router({ mergeParams: true });
const app = express();

const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const { campgroundSchema } = require('../schemas.js');

const Joi = require('joi');
//app.use(express.urlencoded({ extended: true }))
//app.use(methodOverride('_method'));






router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;