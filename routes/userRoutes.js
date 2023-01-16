const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.get("/me", protect, getMe);

module.exports = router;
