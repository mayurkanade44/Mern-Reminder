import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    emailList: [String],
    categories: {
      type: Array,
      default: [
        "Driving License",
        "Rent Agreement",
        "Electricity Bill",
        "Insecticidal License",
        "Shop & Establishment License",
        "Trade License",
        "Filing Of GST",
        "Filing Of PF",
        "Filing Of ESIC",
        "Fire Safety License",
        "Renewal Of ISO ",
        "Renewal Of Passport",
      ],
    },
    passwordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    reminderFiles: [String],
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.virtual("reminders", {
  ref: "Reminder",
  localField: "_id",
  foreignField: "user",
});

export default mongoose.model("User", UserSchema);
