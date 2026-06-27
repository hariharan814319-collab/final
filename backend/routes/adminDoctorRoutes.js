const express =
require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const {
  adminOnly
} = require(
  "../middleware/roleMiddleware"
);

const {

  getPendingDoctors,

  approveDoctor,

  rejectDoctor

} = require(
  "../controllers/adminDoctorController"
);

router.get(

  "/pending-doctors",

  protect,

  adminOnly,

  getPendingDoctors

);

router.put(

  "/approve-doctor/:id",

  protect,

  adminOnly,

  approveDoctor

);

router.put(

  "/reject-doctor/:id",

  protect,

  adminOnly,

  rejectDoctor

);

module.exports =
router;