import mongoose from "mongoose";

const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true }
});

export default mongoose.model("Camp", campSchema);
