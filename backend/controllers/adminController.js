const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getAdminStats = async (req, res) => {
    try {

        const totalDoctors =
            await Doctor.countDocuments();

        const pendingDoctors =
            await Doctor.countDocuments({
                verificationStatus: "Pending"
            });

        const approvedDoctors =
            await Doctor.countDocuments({
                verificationStatus: "Approved"
            });

        const totalPatients =
            await User.countDocuments({
                role: "patient"
            });

        const totalAppointments =
            await Appointment.countDocuments();

        res.status(200).json({

            totalDoctors,

            pendingDoctors,

            approvedDoctors,

            totalPatients,

            totalAppointments

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getAdminStats
};