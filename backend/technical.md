# Technical Documentation

## Project Name

Hospital Appointment System

---

# Technology Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv
* cors

## Frontend

Phase 1:

* HTML
* CSS
* JavaScript
* Fetch API

Phase 2 (Optional):

* React.js
* React Router
* Axios

---

# Project Architecture

Frontend

↓

REST API

↓

Express Server

↓

MongoDB Database

---

# Folder Structure

hospital-appointment-system/

backend/
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Doctor.js
│   └── Appointment.js
│
├── middleware/
│   └── authMiddleware.js
│
├── controllers/
│   ├── authController.js
│   ├── doctorController.js
│   └── appointmentController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   └── appointmentRoutes.js
│
├── .env
├── server.js
└── package.json

frontend/

├── register.html
├── login.html
├── dashboard.html
├── doctors.html
├── appointments.html
├── style.css
└── script.js

---

# Database Design

## User Collection

{
_id,
name,
email,
password,
role
}

Role Values:

* patient
* doctor
* admin

---

## Doctor Collection

{
_id,
doctorName,
specialization,
experience,
consultationFee,
availableDays,
availableTime
}

---

## Appointment Collection

{
_id,
patientId,
doctorId,
appointmentDate,
appointmentTime,
status,
createdAt
}

Status Values:

* Pending
* Approved
* Completed
* Cancelled

---

# API Endpoints

## Authentication

POST /api/auth/register

Register User

POST /api/auth/login

Login User

Returns JWT Token

---

## Doctor APIs

GET /api/doctors

Get All Doctors

GET /api/doctors/:id

Get Single Doctor

POST /api/doctors

Add Doctor

PUT /api/doctors/:id

Update Doctor

DELETE /api/doctors/:id

Delete Doctor

---

## Appointment APIs

POST /api/appointments

Create Appointment

GET /api/appointments

Get All Appointments

GET /api/appointments/:id

Get Appointment By ID

PUT /api/appointments/:id

Update Appointment Status

DELETE /api/appointments/:id

Cancel Appointment

---

# JWT Authentication Flow

Step 1:

User registers.

↓

Step 2:

Password encrypted using bcryptjs.

↓

Step 3:

User logs in.

↓

Step 4:

Server validates credentials.

↓

Step 5:

JWT Token generated.

↓

Step 6:

Token sent to client.

↓

Step 7:

Client stores token in localStorage.

↓

Step 8:

Protected routes verify token.

---

# Development Timeline

## Day 1

### Database Setup

* Install MongoDB
* Create Database
* Configure Mongoose Connection

### Backend Development

Create Models

* User Model
* Doctor Model
* Appointment Model

Authentication

* Register API
* Login API
* Password Hashing
* JWT Token Generation

Doctor Module

* Add Doctor
* Get Doctors
* Update Doctor
* Delete Doctor

Appointment Module

* Create Appointment
* View Appointment
* Update Appointment
* Delete Appointment

Testing

* Test all APIs using Postman
* Verify MongoDB records
* Verify JWT Authentication

Expected Result:

Complete Backend Ready

---

## Day 2 Morning

### Frontend Development

Create Pages

* Login Page
* Register Page
* Dashboard Page
* Doctor Listing Page
* Appointment Page

Integration

* Connect APIs using Fetch API
* Store JWT in localStorage
* Display doctors dynamically
* Book appointments dynamically

Expected Result:

Fully Functional Web Application

---

## Day 2 Evening (Optional)

### React Migration

Create React Project

npx create-vite@latest

Convert Pages

register.html → Register.jsx

login.html → Login.jsx

dashboard.html → Dashboard.jsx

doctors.html → Doctors.jsx

appointments.html → Appointments.jsx

Add React Router

Implement Axios

Reuse Existing Backend APIs

Expected Result:

Hospital Appointment System upgraded from HTML frontend to React frontend.

---

# Security Features

* Password Hashing using bcryptjs
* JWT Authentication
* Protected Routes
* Environment Variables
* CORS Configuration

---

# Testing Tools

* Postman
* MongoDB Compass
* Browser Developer Tools

---

# Future Scope

* React Frontend
* Email Notifications
* Payment Gateway
* Cloudinary Image Upload
* Medical History Records
* Online Consultation
* Admin Analytics Dashboard

---

# Conclusion

This project demonstrates complete full-stack web application development using MongoDB, Express.js, Node.js, JWT Authentication, REST APIs, CRUD Operations, and frontend integration. The system provides a practical solution for managing hospital appointments while serving as an excellent MERN Stack mini-project.
