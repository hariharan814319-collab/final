require('dotenv').config();
const mongoose = require('mongoose');
const fetch = global.fetch || require('node-fetch');
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Otp = require('./models/Otp');

const API_BASE = 'http://localhost:5000/api';

const run = async () => {
  await connectDB();
  const email = `flowtest${Date.now()}@example.com`;
  const password = 'Testpass123!';

  console.log('Registering doctor', email);
  let res = await fetch(`${API_BASE}/doctors/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Flow Test Doc',
      email,
      password,
      doctorName: 'Dr Flow',
      specialization: 'General',
      experience: 5,
      consultationFee: 400,
      hospitalName: 'Flow Hospital',
      medicalLicenseNumber: 'FLOW123',
      aadhaarNumber: '123412341234',
      availableDays: ['Monday', 'Wednesday'],
      availableTime: '9 AM - 5 PM',
    }),
  });
  const registerData = await res.json();
  console.log('register status', res.status, registerData);
  if (!res.ok) return;

  const otpRecord = await Otp.findOne({ email }).lean();
  console.log('otpRecord', otpRecord);
  if (!otpRecord) return;

  res = await fetch(`${API_BASE}/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: otpRecord.otp }),
  });
  const verifyData = await res.json();
  console.log('verify status', res.status, verifyData);
  if (!res.ok) return;

  res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@phoenix.com', password: 'admin123' }),
  });
  const adminLogin = await res.json();
  console.log('admin login status', res.status, adminLogin);
  if (!res.ok) return;

  const doctorProfile = await Doctor.findOne({ userId: verifyData.user._id }).lean();
  console.log('doctorProfile', doctorProfile?._id, doctorProfile?.verificationStatus, doctorProfile?.isEmailVerified);
  if (!doctorProfile) return;

  res = await fetch(`${API_BASE}/admin/approve-doctor/${doctorProfile._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  });
  const approveData = await res.json();
  console.log('approve status', res.status, approveData);
  if (!res.ok) return;

  res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const doctorLogin = await res.json();
  console.log('doctor login status', res.status, doctorLogin);
  if (!res.ok) return;

  console.log('doctor login succeeded');
};

run().catch((err) => console.error(err));