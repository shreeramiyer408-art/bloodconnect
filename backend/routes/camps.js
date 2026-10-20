import express from "express";
import Camp from "../models/Camp.js";

const router = express.Router();

// Feature: Blood donation camp listing
router.get("/", async (req, res) => {
  try {
    const camps = await Camp.find().sort({ date: 1 });
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const camp = await Camp.create(req.body);
    res.status(201).json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
