import 'dotenv/config';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import connectDB from './config/db.js';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Otp from './models/Otp.js';

const API_BASE = 'http://localhost:5000/api';

const run = async () => {
  await connectDB();
  const timestamp = Date.now();
  const email = `flowtest${timestamp}@example.com`;
  const password = 'Testpass123!';

  console.log('Registering doctor', email);
  const registerRes = await fetch(`${API_BASE}/doctors/register`, {
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
  const registerData = await registerRes.json();
  console.log('register', registerRes.status, registerData);
  if (!registerRes.ok) return;

  const otpRecord = await Otp.findOne({ email }).lean();
  console.log('otpRecord', otpRecord);
  if (!otpRecord) {
    console.error('No OTP record found');
    return;
  }

  const verifyRes = await fetch(`${API_BASE}/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: otpRecord.otp }),
  });
  const verifyData = await verifyRes.json();
  console.log('verify', verifyRes.status, verifyData);
  if (!verifyRes.ok) return;

  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@phoenix.com', password: 'admin123' }),
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('admin login', adminLoginRes.status, adminLoginData);
  if (!adminLoginRes.ok) return;
  const adminToken = adminLoginData.token;

  const doctorProfile = await Doctor.findOne({ userId: registerData.doctor?._id || registerData.doctor.userId }).lean();
  console.log('doctorProfile', doctorProfile?._id);
  if (!doctorProfile) {
    const foundProfile = await Doctor.findOne({ userId: mongoose.Types.ObjectId(registerData.doctor.userId) }).lean();
    console.log('foundProfile', foundProfile);
  }
  const doctorId = doctorProfile._id;

  const approveRes = await fetch(`${API_BASE}/admin/approve-doctor/${doctorId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const approveData = await approveRes.json();
  console.log('approve', approveRes.status, approveData);
  if (!approveRes.ok) return;

  const doctorLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const doctorLoginData = await doctorLoginRes.json();
  console.log('doctor login', doctorLoginRes.status, doctorLoginData);
  if (!doctorLoginRes.ok) return;

  console.log('Doctor login succeeded with token:', doctorLoginData.token);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});