import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending"
    },
    message: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
