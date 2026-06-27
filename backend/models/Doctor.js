const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    doctorName: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    hospitalName: {
      type: String,
      default: "",
    },

    medicalLicenseNumber: {
      type: String,
      default: "",
    },

    aadhaarNumber: {
      type: String,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    aadhaarDocument: {
      type: String,
      default: "",
    },

    licenseDocument: {
      type: String,
      default: "",
    },

    degreeDocument: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    availableDays: {
      type: [String],
      default: [],
    },

    availableTime: {
  type: String,
  default: ""
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Doctor",
  doctorSchema
);