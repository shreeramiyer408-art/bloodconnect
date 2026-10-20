import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkDonationEligibility, checkHealthEligibility } from "../utils/eligibility.js";
import { normalizeIndianMobile } from "../utils/phone.js";

const router = express.Router();

// Round to 2 decimals (~1 km) so a donor's exact home location is never exposed
const blur = (n) => Math.round(n * 100) / 100;

// Feature 2 & 3: Search + distance-based ranking (MongoDB $near sorts by distance automatically)
// Only PUBLIC fields are returned: no email, phone, health answers or exact location.
router.get("/search", async (req, res) => {
  try {
    const { bloodType, lat, lng, maxDistance = 15000 } = req.query;

    const donors = await User.find({
      bloodType,
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select("name bloodType isAvailable location");

    res.json(
      donors.map((d) => ({
        _id: d._id,
        name: d.name,
        bloodType: d.bloodType,
        isAvailable: d.isAvailable,
        location: { type: "Point", coordinates: d.location.coordinates.map(blur) }
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle availability
router.patch("/availability", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ isAvailable: user.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit own profile — only these fields can be changed
router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, phone, bloodType, coordinates } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: "Name cannot be empty" });
      updates.name = String(name).trim();
    }
    if (phone !== undefined) {
      const normalized = normalizeIndianMobile(phone);
      if (!normalized) {
        return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
      }
      updates.phone = normalized;
    }
    if (bloodType !== undefined) updates.bloodType = bloodType;
    if (Array.isArray(coordinates) && coordinates.length === 2 && coordinates.every(Number.isFinite)) {
      updates.location = { type: "Point", coordinates };
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feature 9: Submit health screening questionnaire
router.post("/health-screening", protect, async (req, res) => {
  try {
    const answers = req.body;

    await User.findByIdAndUpdate(
      req.userId,
      { healthScreening: { ...answers, completedAt: new Date() } },
      { new: true }
    );

    const result = checkHealthEligibility(answers);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a profile. Your own = full details. Anyone else's = public fields only.
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Donor not found" });
    }
    const donor = await User.findById(req.params.id).select("-password");
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    if (String(donor._id) === String(req.userId)) {
      const eligibility = checkDonationEligibility(donor.lastDonationDate);
      return res.json({ ...donor.toObject(), eligibility });
    }

    res.json({
      _id: donor._id,
      name: donor.name,
      bloodType: donor.bloodType,
      isAvailable: donor.isAvailable,
      donationCount: donor.donationCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;