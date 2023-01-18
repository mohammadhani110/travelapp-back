const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

//@desc Get Tour
//@route GET /api/tour
//@access Public
const getTour = asyncHandler(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id);
  //   if (popOptions) tour = tour.populate({ path: "reviews" });
  if (!tour) {
    res.status(404);
    throw new Error("Tour not found");
  }
  //   const doc = await tour;

  //   if (!doc) {
  //     return next(new AppError("No document found with that ID", 404));
  //   }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//@desc Get Tours
//@route GET /api/tours
//@access Public
const getAllTours = asyncHandler(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  //   if (req.params.tourId) filter = { tour: req.params.tourId };

  //   const features = new APIFeatures(Tour.find(filter), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginate();
  //// const doc = await features.query.explain();
  //   const doc = await features.query;
  const tours = await Tour.find();
  console.log("tours", tours);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

//@desc Create Tour
//@route POST /api/me/tour
//@access Private
const createTour = asyncHandler(async (req, res) => {
  const bodyData =
    !!req.body.name ||
    !!req.body.duration ||
    !!req.body.maxGroupSize ||
    !!req.body.difficulty ||
    !!req.body.price ||
    !!req.body.summary ||
    !!req.body.description ||
    !!req.body.imageCover ||
    !!req.body.user;
  // !req.body.images ||
  // !req.body.startDates ||
  console.log("bodyData", bodyData);
  console.log("req.body", req.body);
  if (!bodyData) {
    res.status(400);
    throw new Error("some fields are missing in the request body");
  }
  const tour = await Tour.create(req.body).then((result) => {
    console.log("Result", result);
    res
      .status(201)
      .json({
        status: "success",
        data: {
          tour: result,
        },
      })
      .catch((e) => {
        res.status(400);
        throw new Error("unable to create tour");
      });
  });
});

//@desc Delete Goal
//@route DELETE /api/goals
//@access Private
const deleteTour = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Check if logged in User matches the goal user
  if (!user.isAdmin) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(400);
    throw new Error("No tour found with that ID");
  }

  await tour.remove();
  res.status(200).json({
    status: "success",
    data: {
      tour,
      message: "Tour deleted successfully",
    },
  });
});

//@desc Update Goal
//@route PUT /api/goals
//@access Private

const updateTour = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Check if logged in User matches the goal user
  if (!user.isAdmin) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    res.status(400);
    throw new Error("No tour found with that ID");
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
      message: "Tour updated successfully",
    },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
