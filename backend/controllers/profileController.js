
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
// Doctor Profile
const getDoctorProfile = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      userId: req.user.id
    }).populate(
      "userId",
      "name email role"
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor Profile Not Found"
      });
    }

    res.status(200).json(doctor);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// Patient Profile
const getPatientProfile = async (req, res) => {
  try {

    const patient = await User.findById(
      req.user.id
    ).select("-password");

    if (!patient) {

      return res.status(404).json({
        message: "Patient Not Found"
      });

    }

    const appointments =
      await Appointment.find({

        patientId: req.user.id

      })
      .populate(
        "doctorId",
        "doctorName specialization profilePhoto"
      );

    res.status(200).json({

      name: patient.name,

      email: patient.email,

      role: patient.role,

      profilePhoto:
        patient.profilePhoto || "",

      aadhaarDocument:
        patient.aadhaarDocument || "",

      totalAppointments:
        appointments.length,

      appointments

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({
      userId: req.user.id
    });

    if (!doctor) {

      return res.status(404).json({
        message: "Doctor Profile Not Found"
      });

    }

    doctor.hospitalName =
      req.body.hospitalName ||
      doctor.hospitalName;

    doctor.consultationFee =
      req.body.consultationFee ||
      doctor.consultationFee;

    doctor.availableDays =
      req.body.availableDays ||
      doctor.availableDays;

    doctor.availableTime =
      req.body.availableTime ||
      doctor.availableTime;

    await doctor.save();

    res.status(200).json({

      message:
        "Doctor Profile Updated Successfully",

      doctor

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getDoctorProfile,
  getPatientProfile,
  updateDoctorProfile
};