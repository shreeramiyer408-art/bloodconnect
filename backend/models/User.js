import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true }, // shared only after a request is accepted
    role: { type: String, enum: ["donor", "requester", "both"], default: "both" },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true
    },
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: { type: Date, default: null }, // Feature 6: Eligibility reminder
    donationCount: { type: Number, default: 0 },
    location: {
      // Feature 1: location access
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    healthScreening: {
      // Feature 9: Health eligibility check
      feelingWell: { type: Boolean, default: null },
      onMedication: { type: Boolean, default: null },
      recentSurgery: { type: Boolean, default: null },
      chronicIllness: { type: Boolean, default: null },
      consumedAlcohol: { type: Boolean, default: null },
      weightAbove50: { type: Boolean, default: null },
      completedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" }); // enables Feature 2 & 3: geo search + distance ranking

export default mongoose.model("User", userSchema);