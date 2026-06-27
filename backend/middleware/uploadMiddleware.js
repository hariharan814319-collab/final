const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (file.fieldname === "profilePhoto") {
      cb(null, "uploads/profilePhotos");
    }

    else if (file.fieldname === "aadhaarDocument") {
      cb(null, "uploads/aadhaar");
    }

    else if (file.fieldname === "licenseDocument") {
      cb(null, "uploads/licenses");
    }

    else if (file.fieldname === "degreeDocument") {
      cb(null, "uploads/degrees");
    }

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  }

});

const upload = multer({
  storage
});

module.exports = upload;