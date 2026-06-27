const Doctor = require("../models/Doctor");

const uploadDocuments =
async (req, res) => {

  try {

    console.log("FILES RECEIVED:");
    console.log(req.files);

    const doctor =
      await Doctor.findOne({
        userId: req.user.id
      });

    if (!doctor) {

      return res.status(404).json({
        message: "Doctor Not Found"
      });

    }

    if (req.files.profilePhoto) {

      doctor.profilePhoto =
      req.files.profilePhoto[0].path;

    }

    if (req.files.aadhaarDocument) {

      doctor.aadhaarDocument =
      req.files.aadhaarDocument[0].path;

    }

    if (req.files.licenseDocument) {

      doctor.licenseDocument =
      req.files.licenseDocument[0].path;

    }

    if (req.files.degreeDocument) {

      doctor.degreeDocument =
      req.files.degreeDocument[0].path;

    }

    await doctor.save();

    res.status(200).json({

      message:
      "Documents Uploaded Successfully",

      doctor

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  uploadDocuments
};