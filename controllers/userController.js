const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Check User Exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    bookings: [],
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      bookings: user.bookings,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

//@desc Authenticate a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else if (!user) {
    res.status(400);
    throw new Error("User not found!");
  } else {
    res.status(400);
    throw new Error("Invalid credentials!");
  }
});

//@desc Get user data
//@route GET /api/users/me
//@access Public
const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.status(200);
  if (!user) {
    res.status(400);
    throw new Error("Something went wrong!");
  }

  res.json(user);
});

//@desc Get user data
//@route GET /api/users/me
//@access Public
const getUser = asyncHandler(async (req, res) => {
  const user = await User.find(req.params.id);
  res.status(200);
  if (!user) {
    res.status(400);
    throw new Error("Something went wrong!");
  }

  res.json(user);
});

//@desc Update Goal
//@route PUT /api/goals
//@access Private
const updateUser = asyncHandler(async (req, res) => {
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

  const upadatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(upadatedGoal);
});
//@desc Delete Goal
//@route DELETE /api/goals
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check for user
  // Check if logged in User matches the goal user
  if (!user.isAdmin) {
    res.status(401);
    throw new Error("User not authorized");
  }
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  await goal.remove();
  res
    .status(200)
    .json({ message: "User deleted successfully!", id: req.params.id });
});

//@desc Get user data
//@route GET /api/users/me
//@access Public
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200);

  res.json({ _id, name, email });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
