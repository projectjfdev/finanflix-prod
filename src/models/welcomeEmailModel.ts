import { IEmailWelcome } from "@/interfaces/email";
import mongoose, { Schema } from "mongoose";

const WelcomeSchema = new Schema<IEmailWelcome>({
  username: {
    type: String,
    required: [true, "El usuario es requerido"],
  },
  email: {
    type: String,
    required: [true, "El email es requerido"],
  },
  token: {
    type: String,
    unique: true,
  },
  expires: { type: Date },
});

const Welcome =
  mongoose.models.Welcome || mongoose.model("Welcome", WelcomeSchema);

export default Welcome;
