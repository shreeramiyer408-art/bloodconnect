import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { normalizeIndianMobile } from "../utils/phone.js";

const router = express.Router();

// Register — Feature 1
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, bloodType, coordinates } = req.body;

    const normalizedPhone = normalizeIndianMobile(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: normalizedPhone,
      bloodType,
      location: { type: "Point", coordinates: coordinates || [0, 0] }
    });

    res.status(201).json({ message: "Registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, bloodType: user.bloodType }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;