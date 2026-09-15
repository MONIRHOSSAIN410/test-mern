import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  if (String(password).length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!user || !isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me   (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});
