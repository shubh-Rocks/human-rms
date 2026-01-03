import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // "select: false" hides it from queries by default
  role: { 
    type: String, 
    enum: ["admin", "employee"], 
    default: "employee" 
  },
  // Company & contact details for HR/admin-created accounts
  companyName: { type: String },
  companyLogo: { type: String }, // URL
  phone: { type: String },
  // Auto-generated login ID following project spec (e.g., OI(initial of company name )HAMA(2 letter initial of first and last name)2026(year of joining)0001(serial number))
  loginID: { type: String, unique: true, index: true },
  // Basic Profile details requested in spec [cite: 56, 57]
  department: { type: String },
  designation: { type: String },
  salary: { type: Number, default: 0 }, // For payroll visibility [cite: 96]
  joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models?.User || mongoose.model("User", UserSchema);