const express = require("express");

const router =
express.Router();

const protect =
require("../middleware/authMiddleware");

const upload =
require(
 "../middleware/patientUploadMiddleware"
);

const {
 uploadPatientDocuments
} = require(
 "../controllers/patientDocumentController"
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
   }

 ]),

 uploadPatientDocuments

);

module.exports = router;