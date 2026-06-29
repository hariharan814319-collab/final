const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

const registerDoctor = async (req, res) => {
  try {

    const {
      name,
      email,
      password,

      doctorName,
      specialization,
      experience,
      consultationFee,

      hospitalName,
      medicalLicenseNumber,
      aadhaarNumber,

      availableDays,
      availableTime
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email Already Exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "doctor"
      });

    const doctor =
      await Doctor.create({

        userId: user._id,

        doctorName,
        specialization,
        experience,
        consultationFee,

        hospitalName,
        medicalLicenseNumber,
        aadhaarNumber,

        availableDays,
        availableTime,

        verificationStatus: "Pending",

        isEmailVerified: false

      });

    res.status(201).json({
      message:
        "Doctor Registration Submitted. Please verify your email.",
      doctor
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  registerDoctor
};
