require('dotenv').config();
const connectDB = require('./config/db');
const Otp = require('./models/Otp');

(async () => {
  try {
    await connectDB();
    const otps = await Otp.find().sort({ createdAt: -1 }).limit(20).lean();
    console.log('OTPs:', JSON.stringify(otps, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
