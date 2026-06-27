const multer = require("multer");

const { CloudinaryStorage } =
require("multer-storage-cloudinary");

const cloudinary =
require("../config/cloudinary");

const storage =
new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        let folder = "phoenix";

        if (file.fieldname === "profilePhoto") {

            folder = "phoenix/profilePhotos";

        }

        else if (file.fieldname === "aadhaarDocument") {

            folder = "phoenix/aadhaar";

        }

        else if (file.fieldname === "licenseDocument") {

            folder = "phoenix/licenses";

        }

        else if (file.fieldname === "degreeDocument") {

            folder = "phoenix/degrees";

        }

        return {

            folder,

            resource_type: "auto"

        };

    }

});

const upload = multer({

    storage

});

module.exports = upload;