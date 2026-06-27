const adminOnly = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin Access Only"
        });
    }

    next();
};

const doctorOnly = (req, res, next) => {

    if (req.user.role !== "doctor") {
        return res.status(403).json({
            message: "Doctor Access Only"
        });
    }

    next();
};

const patientOnly = (req, res, next) => {

    if (req.user.role !== "patient") {
        return res.status(403).json({
            message: "Patient Access Only"
        });
    }
    next();
};

module.exports = {
    adminOnly,
    doctorOnly,
    patientOnly
};