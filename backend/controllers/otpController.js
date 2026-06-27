const Otp =
require("../models/Otp");

const Doctor =
require("../models/Doctor");
const User = require("../models/User");
const sendEmail =
require("../utils/sendEmail");
const jwt = require("jsonwebtoken");


// SEND OTP

const sendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(404).json({
        message: "User Not Found"
      });

    }

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    await Otp.deleteMany({
      email
    });

    await Otp.create({
      email,
      otp
    });

    await sendEmail(
      email,
      "PHOENIX Email Verification",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({
      message:
      "OTP Sent Successfully"
    });

  }

  catch (error) {

    res.status(500).json({
      message:
      error.message
    });

  }

};

// VERIFY OTP

const verifyOtp = async (req, res) => {

  try {

    const {
      email,
      otp
    } = req.body;

    const otpRecord =
      await Otp.findOne({
        email,
        otp
      });

    if (!otpRecord) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(404).json({
        message: "User Not Found"
      });

    }

    const doctor =
      await Doctor.findOneAndUpdate(

        {
          userId: user._id
        },

        {
          isEmailVerified: true
        },

        {
          new: true
        }

      );

    if (!doctor) {

      return res.status(404).json({
        message: "Doctor Profile Not Found"
      });

    }

    await Otp.deleteMany({
      email
    });

    const jwtSecret = process.env.JWT_SECRET || "hospital_secret_key";

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({

      message:
        "Email Verified Successfully",

      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      doctor,

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {

    sendOtp,

    verifyOtp

};