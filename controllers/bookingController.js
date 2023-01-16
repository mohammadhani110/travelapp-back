const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");

//@desc Get Goals
//@route GET /api/goals
//@access Private
const getBookings = asyncHandler(async (req, res) => {
  // const bookings = await Booking.find();
  await Booking.find({})
    .populate({ path: "tour", model: "Tour" })
    .populate({ path: "user", model: "User" })
    .exec(function (err, bookings) {
      if (err) return handleError(err);
      console.log("bookings", bookings);
      res.status(200).json(bookings);
    });
  // res.status(200).json(bookings);
});
//@desc createBooking
//@route POST /api/booking
//@access Private
const createBooking = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.tour) {
    res.status(404);
    throw new Error("dono bhejo bhai");
  }

  // let tour = await Tour.findById(req.body.tour);

  let user = await User.findByIdAndUpdate(req.body.user, {
    $push: { bookings: req.body.tour },
  });
  console.log("createBooking user", user);

  const booking = await Booking.create({
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(200).json(booking);
});

const getSingleBooking = asyncHandler(async (req, res, next) => {
  if (!req.body.user || !req.body.tour) {
    res.status(404);
    throw new Error("dono bhejo bhai");
  }

  let tour = await Tour.findById(req.body.tour);
  let user = await User.findById(req.body.user);

  //   if (popOptions) tour = tour.populate({ path: "reviews" });
  if (!tour) {
    res.status(404);
    throw new Error("Can't find tour");
  }
  if (!user) {
    res.status(404);
    throw new Error("Can't find user");
  }
  console.log(tour, user);

  //   const doc = await tour;

  //   if (!doc) {
  //     return next(new AppError("No document found with that ID", 404));
  //   }

  //   const { _id: userId, name: userName, email } = user;
  //   const { _id: tourId, name: tourName, location, price } = tour;
  //   const data = {
  //     tourId,
  //     userId,
  //     userName,
  //     email,
  //     tourName,
  //     location,
  //     price,
  //   };

  res.status(200).json({
    status: "success",
    data: {
      tour,
      user,
    },
  });
});
module.exports = {
  getBookings,
  createBooking,
  getSingleBooking,
  //setGoals,
  //updateGoal,
  //deleteGoal,
};
