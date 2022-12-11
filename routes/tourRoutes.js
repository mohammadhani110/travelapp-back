const express = require("express");
const router = express.Router();

const {
  getAllTours,
  getTour,
  createTour,
} = require("../controllers/tourController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getAllTours);
router.get("/:id", getTour);
router.post("/", protect, createTour);

module.exports = router;
