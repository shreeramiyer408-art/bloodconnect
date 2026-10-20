import express from "express";
import BloodBank from "../models/BloodBank.js";

const router = express.Router();

// Feature 8: Blood bank / hospital directory
router.get("/", async (req, res) => {
  try {
    const banks = await BloodBank.find();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const bank = await BloodBank.create(req.body);
    res.status(201).json(bank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feature 7: Blood compatibility info (static data, no DB needed)
router.get("/compatibility", (req, res) => {
  const compatibility = {
    "O-": { canDonateTo: ["All types"], canReceiveFrom: ["O-"] },
    "O+": { canDonateTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"] },
    "A-": { canDonateTo: ["A-", "A+", "AB-", "AB+"], canReceiveFrom: ["A-", "O-"] },
    "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
    "B-": { canDonateTo: ["B-", "B+", "AB-", "AB+"], canReceiveFrom: ["B-", "O-"] },
    "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
    "AB-": { canDonateTo: ["AB-", "AB+"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] },
    "AB+": { canDonateTo: ["AB+"], canReceiveFrom: ["All types"] }
  };
  res.json(compatibility);
});

export default router;
