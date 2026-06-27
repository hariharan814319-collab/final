const Doctor = require("../models/Doctor");

// GET Pending Doctors

const getPendingDoctors =
async (req, res) => {

  try {

    const doctors =
      await Doctor.find({

        verificationStatus:
          "Pending"

      });

    res.status(200).json(
      doctors
    );

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// APPROVE

const approveDoctor =
async (req, res) => {

  try {

    const doctor =
      await Doctor.findByIdAndUpdate(

        req.params.id,

        {
          verificationStatus:
            "Approved"
        },

        {
          new: true
        }

      );

    if (!doctor) {

      return res.status(404).json({
        message:
          "Doctor Not Found"
      });

    }

    res.status(200).json({

      message:
        "Doctor Approved Successfully",

      doctor

    });

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// REJECT

const rejectDoctor =
async (req, res) => {

  try {

    const doctor =
      await Doctor.findByIdAndUpdate(

        req.params.id,

        {
          verificationStatus:
            "Rejected"
        },

        {
          new: true
        }

      );

    if (!doctor) {

      return res.status(404).json({
        message:
          "Doctor Not Found"
      });

    }

    res.status(200).json({

      message:
        "Doctor Rejected Successfully",

      doctor

    });

  }

  catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

module.exports = {

  getPendingDoctors,

  approveDoctor,

  rejectDoctor

};