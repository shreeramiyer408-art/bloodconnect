import express from "express";
import mongoose from "mongoose";
import Request from "../models/Request.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkTransition, shapeForUser } from "../utils/requestRules.js";

const router = express.Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

// Feature 4: Send a contact request
router.post("/", protect, async (req, res) => {
  try {
    const { donorId } = req.body;
    const message = typeof req.body.message === "string" ? req.body.message.trim().slice(0, 300) : "";

    if (!isId(donorId)) return res.status(400).json({ message: "Invalid donor" });
    if (String(donorId) === String(req.userId)) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const donor = await User.findById(donorId).select("_id");
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    const open = await Request.findOne({
      requester: req.userId,
      donor: donorId,
      status: { $in: ["pending", "accepted"] }
    });
    if (open) {
      return res.status(400).json({ message: "You already have an open request with this donor" });
    }

    const request = await Request.create({ requester: req.userId, donor: donorId, message });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feature 5: Request history (sent + received).
// The other person's phone/email is included ONLY after the donor has accepted.
router.get("/history", protect, async (req, res) => {
  try {
    const docs = await Request.find({
      $or: [{ requester: req.userId }, { donor: req.userId }]
    })
      .populate("requester", "name email phone")
      .populate("donor", "name email phone bloodType")
      .sort({ createdAt: -1 });

    res.json(docs.map((d) => shapeForUser(d, req.userId)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feature 4: Accept / decline (donor only) and complete (either person)
router.patch("/:id", protect, async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ message: "Request not found" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const { status } = req.body;
    const check = checkTransition(request, req.userId, status);
    if (!check.ok) return res.status(check.code).json({ message: check.message });

    request.status = status;
    await request.save();

    // When completed, update the donor's last donation date (feeds the eligibility reminder)
    if (status === "completed") {
      await User.findByIdAndUpdate(request.donor, {
        $inc: { donationCount: 1 },
        lastDonationDate: new Date()
      });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;