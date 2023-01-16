const express = require("express");
const router = express.Router();

const {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
} = require("../controllers/tourController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(getAllTours).post(protect, createTour);
router.get("/:id", getTour);
router.route("/:id").put(protect, updateTour).delete(protect, deleteTour);

// router.get("/", getAllTours);
// router.post("/", protect, createTour);
// router.post("/:id", protect, updateTour);
// router.post("/:id", protect, deleteTour);

module.exports = router;
