const express = require("express");
const router = express.Router();

const {
  getBookings,
  createBooking,
  getSingleBooking,
  //   setGoals,
  //   updateGoal,
  //   deleteGoal,
} = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");

//chaining same route for different requests
//router.route("/").get(protect, getGoals).post(protect, setGoals);
// router.route("/:id").put(protect, updateGoal).delete(protect, deleteGoal);
router.route("/").get(getBookings).post(createBooking);
router.route("/:id").get(getSingleBooking);

module.exports = router;
