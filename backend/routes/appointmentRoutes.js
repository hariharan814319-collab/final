const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// Create Appointment
router.post("/", protect, createAppointment);

// Get All Appointments
router.get("/", protect, getAppointments);

// Get Appointment By ID
router.get("/:id", protect, getAppointmentById);

// Update Appointment
router.put("/:id", protect, updateAppointment);

// Delete Appointment
router.delete("/:id", protect, deleteAppointment);

module.exports = router;