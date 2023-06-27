import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  expiryMonths: [String],
  notes: { type: String },
  documents: [String],
  autoRenew: { type: Boolean, default: false },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Reminder", ReminderSchema);
