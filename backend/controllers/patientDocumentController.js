const User = require("../models/User");

const uploadPatientDocuments =
async (req, res) => {

    try {

        const patient =
        await User.findById(
            req.user.id
        );

        if (!patient) {

            return res.status(404)
            .json({
                message:
                "Patient Not Found"
            });

        }

        if (
            req.files.profilePhoto
        ) {

            patient.profilePhoto =
            req.files.profilePhoto[0]
            .path;

        }

        if (
            req.files.aadhaarDocument
        ) {

            patient.aadhaarDocument =
            req.files
            .aadhaarDocument[0]
            .path;

        }

        await patient.save();

        res.status(200).json({

            message:
            "Patient Documents Uploaded Successfully",

            patient

        });

    } catch (error) {

        res.status(500).json({
            message:
            error.message
        });

    }

};

module.exports = {
    uploadPatientDocuments
};