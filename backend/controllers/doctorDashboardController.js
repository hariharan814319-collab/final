const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// Doctor Dashboard Summary
const getDoctorAppointments = async (req, res) => {
    try {

        const doctor = await Doctor.findOne({
            userId: req.user.id
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor Profile Not Found"
            });
        }

        const appointments = await Appointment.find({
            doctorId: doctor._id
        })
        .populate("patientId", "name email profilePhoto")
        .populate(
            "doctorId",
            "doctorName specialization profilePhoto"
        );

        const pendingAppointments =
            appointments.filter(
                a => a.status === "Pending"
            ).length;

        const approvedAppointments =
            appointments.filter(
                a => a.status === "Approved"
            ).length;

        const completedAppointments =
            appointments.filter(
                a => a.status === "Completed"
            ).length;

        res.status(200).json({

            doctorName: doctor.doctorName,

            profilePhoto:
                doctor.profilePhoto || "",

            specialization:
                doctor.specialization,

            hospitalName:
                doctor.hospitalName,

            consultationFee:
                doctor.consultationFee,

            verificationStatus:
                doctor.verificationStatus,

            pendingAppointments,

            approvedAppointments,

            completedAppointments,

            appointments

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
    try {

        const appointment =
            await Appointment.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                },
                {
                    new: true
                }
            );

        if (!appointment) {

            return res.status(404).json({
                message: "Appointment Not Found"
            });

        }

        res.status(200).json({
            message:
                "Appointment Status Updated",
            appointment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getDoctorAppointments,
    updateAppointmentStatus
};