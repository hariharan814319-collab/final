const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const jwtSecret = process.env.JWT_SECRET || "hospital_secret_key";
      const decoded = jwt.verify(
        token,
        jwtSecret
      );

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No Token Provided",
    });
  }
};

module.exports = protect;