const Appointment = require("../models/Appointment");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      message: "Appointment Booked Successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "doctorName specialization");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Appointment By ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id
    )
      .populate("patientId", "name email")
      .populate("doctorId", "doctorName specialization");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment Not Found",
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment Not Found",
      });
    }

    res.status(200).json({
      message: "Appointment Updated Successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment Not Found",
      });
    }

    res.status(200).json({
      message: "Appointment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};