import { IPasswordReset } from "@/interfaces/email";
import mongoose, { Schema } from "mongoose";

const ResetSchema = new Schema<IPasswordReset>({
  email: {
    type: String,
    required: [true, "Email required"],
  },
  token: {
    type: String,
    unique: true,
  },
  expires: { type: Date },
});

const Reset = mongoose.models.Reset || mongoose.model("Reset", ResetSchema);

export default Reset;
