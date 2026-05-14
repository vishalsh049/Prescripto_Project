import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  image: {
    type: String,
    default: "data:image/png;base64,...", // keep your base64 here
  },

  address: {
    type: Object,
    default: { line1: "", line2: "" },
  },

  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "0000000000" },
});

// ✅ use correct schema + correct model name
const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;