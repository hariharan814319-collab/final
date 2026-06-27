const express = require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const upload =
require("../middleware/uploadMiddleware");

const {
  uploadDocuments
} = require(
  "../controllers/documentController"
);

router.post(

  "/upload",

  protect,

  upload.fields([

    {
      name: "profilePhoto",
      maxCount: 1
    },

    {
      name: "aadhaarDocument",
      maxCount: 1
    },

    {
      name: "licenseDocument",
      maxCount: 1
    },

    {
      name: "degreeDocument",
      maxCount: 1
    }

  ]),

  uploadDocuments

);

module.exports = router;