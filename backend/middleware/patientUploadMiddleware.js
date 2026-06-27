const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (
            file.fieldname === "profilePhoto"
        ) {

            cb(
                null,
                "uploads/patientProfile"
            );

        }

        else if (
            file.fieldname === "aadhaarDocument"
        ) {

            cb(
                null,
                "uploads/patientAadhaar"
            );

        }

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(
                file.originalname
            )
        );

    }

});

const upload = multer({
    storage
});

module.exports = upload;