const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  doctorOnly,
  patientOnly
} = require("../middleware/roleMiddleware");

const {
  getDoctorProfile,
  getPatientProfile,
  updateDoctorProfile
} = require("../controllers/profileController");
// Doctor Profile
router.get(
  "/doctor",
  protect,
  doctorOnly,
  getDoctorProfile
);
router.put(
  "/doctor",
  protect,
  doctorOnly,
  updateDoctorProfile
);

// Patient Profile
router.get(
  "/patient",
  protect,
  patientOnly,
  getPatientProfile
);

module.exports = router;