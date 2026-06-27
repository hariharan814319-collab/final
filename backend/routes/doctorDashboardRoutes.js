const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    doctorOnly
} = require("../middleware/roleMiddleware");

const {
    getDoctorAppointments,
    updateAppointmentStatus
} = require("../controllers/doctorDashboardController");

// View Appointments
router.get(
    "/appointments",
    protect,
    doctorOnly,
    getDoctorAppointments
);

// Update Appointment Status
router.put(
    "/appointment/:id",
    protect,
    doctorOnly,
    updateAppointmentStatus
);

module.exports = router;