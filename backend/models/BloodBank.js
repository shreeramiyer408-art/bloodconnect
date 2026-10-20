import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },

  // Map pin - filled in from data/maharashtraBloodBanks.json, saved by scripts/seedBloodBanks.js
  lat: { type: Number },
  lng: { type: Number },
  geoAccuracy: { type: String, enum: ["exact", "area"] }
});

export default mongoose.model("BloodBank", bloodBankSchema);
