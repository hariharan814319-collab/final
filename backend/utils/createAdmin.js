const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {

    try {

        const adminExists = await User.findOne({
            email: "admin@phoenix.com"
        });

        if (adminExists) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword =
            await bcrypt.hash("admin123", 10);

        await User.create({
            name: "PHOENIX ADMIN",
            email: "admin@phoenix.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Default Admin Created");

    } catch (error) {

        console.log(error.message);

    }

};

module.exports = createAdmin;