const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

// Register
router.post(
  "/register",
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
    {
      name: "aadhaarDocument",
      maxCount: 1,
    },
  ]),
  registerUser
);

// Login
router.post("/login", loginUser);

module.exports = router;
