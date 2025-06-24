import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  // googleId: { type: String, required: true, unique: true },
  // name: { type: String, required: true },
  email: { type: String }, // ✅ Needed to identify users uniquely
  image: { type: String }, // ✅ Optional but useful
  driveAccessToken: { type: String },
  driveRefreshToken: { type: String },
  connectedServices: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const User = model("User", UserSchema);

export default User;
