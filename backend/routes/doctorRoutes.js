const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  registerDoctor
} = require(
  "../controllers/doctorRegistrationController"
);
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const {
    adminOnly
} = require("../middleware/roleMiddleware");
router.post(
  "/register",
  registerDoctor
);
router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.post(
    "/",
    protect,
    adminOnly,
    createDoctor
);

router.put(
    "/:id",
    protect,
    adminOnly,
    updateDoctor
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteDoctor
);

module.exports = router;
