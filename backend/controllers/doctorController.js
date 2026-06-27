const Doctor = require("../models/Doctor");

// Get All Doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email role");

    res.status(200).json(doctors);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get Single Doctor
const getDoctorById = async (req, res) => {
  try {

    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "name email role");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor Not Found",
      });
    }

    res.status(200).json(doctor);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Add Doctor
const createDoctor = async (req, res) => {
  try {

    const {
      userId,
      doctorName,
      specialization,
      experience,
      consultationFee,
      availableDays,
      availableTime,
    } = req.body;

    const doctor = await Doctor.create({
      userId,
      doctorName,
      specialization,
      experience,
      consultationFee,
      availableDays,
      availableTime,
    });

    res.status(201).json({
      message: "Doctor Added Successfully",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor Not Found",
      });
    }

    res.status(200).json({
      message: "Doctor Updated Successfully",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Doctor
const deleteDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndDelete(
      req.params.id
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor Not Found",
      });
    }

    res.status(200).json({
      message: "Doctor Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};