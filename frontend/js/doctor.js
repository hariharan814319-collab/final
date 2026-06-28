/*
  Clean doctor frontend logic implementing the flow described in the spec:
  - Register -> OTP -> Upload Documents -> Login -> Dashboard
  - Uses `apiCall` and helpers from config.js where appropriate
*/

// ===== DOCTOR REGISTER =====
const doctorRegisterForm = document.getElementById("doctorRegisterForm");
if (doctorRegisterForm) {
  doctorRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const doctorName = document.getElementById("doctorName").value.trim();
    const specialization = document.getElementById("specialization").value.trim();
    const experience = document.getElementById("experience").value;
    const consultationFee = document.getElementById("consultationFee").value;
    const hospitalName = document.getElementById("hospitalName").value.trim();
    const medicalLicenseNumber = document.getElementById("medicalLicenseNumber").value.trim();
    const aadhaarNumber = document.getElementById("aadhaarNumber").value.trim();
    const availableDays = document.getElementById("availableDays").value.trim().split(",").map(d => d.trim()).filter(Boolean);
    const availableTime = document.getElementById("availableTime").value.trim();

    const submitBtn = doctorRegisterForm.querySelector('button[type="submit"]');

    // Validation
    if (!name || !email || !password || !doctorName || !specialization) {
      showAlert("Please fill all required fields", "warning");
      return;
    }
    if (!validateEmail(email)) {
      showAlert("Please enter a valid email", "warning");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("Password must be at least 6 characters", "warning");
      return;
    }
    if (!validateAadhaar(aadhaarNumber)) {
      showAlert("Aadhaar must be 12 digits", "warning");
      return;
    }

    setButtonLoading(submitBtn, true, "Registering...");

    try {
      const data = await apiCall("/doctors/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          doctorName,
          specialization,
          experience: parseInt(experience) || 0,
          consultationFee: parseFloat(consultationFee) || 0,
          hospitalName,
          medicalLicenseNumber,
          aadhaarNumber,
          availableDays,
          availableTime
        })
      });

      // Backend should send OTP; store email and redirect to OTP page
      localStorage.setItem("doctorEmail", email);
      showAlert("Registration submitted. OTP sent to your email.", "success");
      setTimeout(() => window.location.href = "otp.html", 300);
    } catch (err) {
      showAlert(err.message || "Registration failed", "error");
    } finally {
      setButtonLoading(submitBtn, false, "Register");
    }
  });
}

// ===== OTP PAGE =====
const doctorEmailField = document.getElementById("doctorEmail");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

if (doctorEmailField) {
  doctorEmailField.value = localStorage.getItem("doctorEmail") || "";
}

if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", async () => {
    const email = doctorEmailField?.value || localStorage.getItem("doctorEmail");
    if (!email) { showAlert("No email available. Please register first.", "warning"); return; }
    setButtonLoading(sendOtpBtn, true, "Sending OTP...");
    try {
      await apiCall("/otp/send", { method: "POST", body: JSON.stringify({ email }) });
      localStorage.setItem("doctorEmail", email);
      showAlert("OTP sent again", "success");
    } catch (err) {
      showAlert(err.message || "Failed to send OTP", "error");
    } finally {
      setButtonLoading(sendOtpBtn, false, "Send OTP");
    }
  });
}

if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async () => {
    const email = doctorEmailField?.value || localStorage.getItem("doctorEmail");
    const otp = (document.getElementById("otp") || {}).value?.trim();
    if (!email) { showAlert("No email available. Please register first.", "warning"); return; }
    if (!otp) { showAlert("Please enter OTP", "warning"); return; }
    setButtonLoading(verifyOtpBtn, true, "Verifying...");
    try {
      const data = await apiCall("/otp/verify", { method: "POST", body: JSON.stringify({ email, otp }) });
      // store token so subsequent document upload (protected) works
      if (data.token) setAuthData(data.token, data.user);
      localStorage.setItem("doctorEmail", email);
      showAlert("OTP verified. Proceed to upload documents.", "success");
      setTimeout(() => window.location.href = "documents.html", 300);
    } catch (err) {
      showAlert(err.message || "OTP verification failed", "error");
    } finally {
      setButtonLoading(verifyOtpBtn, false, "Verify OTP");
    }
  });
}

// ===== DOCUMENTS UPLOAD =====
const uploadDoctorDocumentsBtn = document.getElementById("uploadDoctorDocumentsBtn");
if (uploadDoctorDocumentsBtn) {
  uploadDoctorDocumentsBtn.addEventListener("click", async () => {
    const profilePhoto = document.getElementById("profilePhoto")?.files[0];
    const aadhaarDocument = document.getElementById("aadhaarDocument")?.files[0];
    const licenseDocument = document.getElementById("licenseDocument")?.files[0];
    const degreeDocument = document.getElementById("degreeDocument")?.files[0];

      if (!profilePhoto || !aadhaarDocument || !licenseDocument || !degreeDocument) {
      showAlert("Please select all required files", "warning");
      return;
    }

      // Validate files: size and type
      const imageTypes = ["image/jpeg", "image/png", "image/webp"];
      const docTypes = ["image/jpeg", "image/png", "application/pdf", "image/webp"];

      if (!validateFileSize(profilePhoto) || !validateFileType(profilePhoto, imageTypes)) {
        showAlert("Profile photo must be an image and less than 5MB", "warning");
        return;
      }
      if (!validateFileSize(aadhaarDocument) || !validateFileType(aadhaarDocument, docTypes)) {
        showAlert("Aadhaar must be image/pdf and less than 5MB", "warning");
        return;
      }
      if (!validateFileSize(licenseDocument) || !validateFileType(licenseDocument, docTypes)) {
        showAlert("License must be image/pdf and less than 5MB", "warning");
        return;
      }
      if (!validateFileSize(degreeDocument) || !validateFileType(degreeDocument, docTypes)) {
        showAlert("Degree must be image/pdf and less than 5MB", "warning");
        return;
      }

    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);
    formData.append("aadhaarDocument", aadhaarDocument);
    formData.append("licenseDocument", licenseDocument);
    formData.append("degreeDocument", degreeDocument);
    const email = localStorage.getItem("doctorEmail");
    if (email) formData.append("email", email);

    setButtonLoading(uploadDoctorDocumentsBtn, true, "Uploading...");
    try {
      const tokenHeader = localStorage.getItem("token");
      const resp = await fetch(`${API_BASE}/documents/upload`, { method: "POST", headers: tokenHeader ? { Authorization: `Bearer ${tokenHeader}` } : {}, body: formData });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Upload failed");
      showAlert("Documents uploaded successfully.", "success");
      // After documents uploaded, redirect to login page
      localStorage.removeItem("doctorEmail");
      setTimeout(() => window.location.href = "login.html", 300);
    } catch (err) {
      showAlert(err.message || "Document upload failed", "error");
    } finally {
      setButtonLoading(uploadDoctorDocumentsBtn, false, "Upload Documents");
    }
  });
}

// ===== LOGIN =====
const doctorLoginForm = document.getElementById("doctorLoginForm");
if (doctorLoginForm) {
  doctorLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("doctorEmail").value.trim();
    const password = document.getElementById("doctorPassword").value;
    const submitBtn = doctorLoginForm.querySelector('button[type="submit"]');
    if (!validateEmail(email)) { showAlert("Please enter a valid email", "warning"); return; }
    if (!password) { showAlert("Please enter password", "warning"); return; }
    setButtonLoading(submitBtn, true, "Logging in...");
    try {
      const data = await apiCall("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setAuthData(data.token, data.user);
      showAlert("Login successful", "success");
      setTimeout(() => window.location.href = "dashboard.html", 300);
    } catch (err) {
      showAlert(err.message || "Login failed", "error");
    } finally {
      setButtonLoading(submitBtn, false, "Login");
    }
  });
}

// ===== DASHBOARD: PROFILE & APPOINTMENTS =====
async function loadDoctorProfile() {
  const photoEl = document.getElementById("doctorPhoto");
  if (!photoEl) return;

  const doctorNameEl = document.getElementById("doctorName");
  const doctorEmailEl = document.getElementById("doctorEmail");
  const doctorHospitalEl = document.getElementById("doctorHospital");
  const verificationStatusEl = document.getElementById("verificationStatus");

  doctorNameEl.innerHTML = `<span class="skeleton skeleton-text" style="width: 180px;"></span>`;
  doctorEmailEl.innerHTML = `<span class="skeleton skeleton-text" style="width: 220px;"></span>`;
  doctorHospitalEl.innerHTML = `<span class="skeleton skeleton-text" style="width: 200px;"></span>`;
  verificationStatusEl.innerHTML = `<span class="skeleton skeleton-text" style="width: 120px;"></span>`;
  photoEl.src = "../assets/default-doctor.png";

  try {
    const data = await apiCall("/profile/doctor", { method: "GET" });
    doctorNameEl.innerText = data.doctorName || "N/A";
    doctorEmailEl.innerText = data.userId?.email || "N/A";
    doctorHospitalEl.innerText = data.hospitalName || "N/A";
    if (verificationStatusEl) {
      verificationStatusEl.innerText = data.verificationStatus || "Pending";
      verificationStatusEl.className = `${(data.verificationStatus || "").toLowerCase()}-status`;
    }
    setImageSrc(photoEl, data.profilePhoto, DEFAULT_DOCTOR_PHOTO);
    document.getElementById("consultationFee").value = data.consultationFee || "";
    document.getElementById("availableDays").value = (data.availableDays || []).join(", ");
    document.getElementById("availableTime").value = data.availableTime || "";
    document.getElementById("hospitalName").value = data.hospitalName || "";
  } catch (err) {
    console.error(err);
  }
}

async function loadDoctorAppointments() {
  const container = document.getElementById("doctorAppointments");
  if (!container) return;

  container.innerHTML = `
    <div class="appointment-item">
      <div class="skeleton skeleton-circle"></div>
      <div style="flex:1">
        <div class="skeleton skeleton-text" style="width: 120px;"></div>
        <div class="skeleton skeleton-text" style="width: 180px;"></div>
        <div class="skeleton skeleton-text" style="width: 140px;"></div>
      </div>
    </div>
    <div class="appointment-item">
      <div class="skeleton skeleton-circle"></div>
      <div style="flex:1">
        <div class="skeleton skeleton-text" style="width: 120px;"></div>
        <div class="skeleton skeleton-text" style="width: 180px;"></div>
        <div class="skeleton skeleton-text" style="width: 140px;"></div>
      </div>
    </div>
  `;

  try {
    const res = await apiCall("/doctor/appointments", { method: "GET" });
    const appointments = Array.isArray(res) ? res : res.appointments || [];
    updateStats(appointments);
    container.innerHTML = "";
    if (appointments.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:rgba(255,255,255,0.6)'>No appointments yet</p>";
      return;
    }
    appointments.forEach(app => {
      const patientPhoto = app.patientId?.profilePhoto ? getFileUrl(app.patientId.profilePhoto) : "../assets/default-user.png";
      const actionable = app.status === "Pending";
      const item = document.createElement("div");
      item.className = "appointment-item";
      item.innerHTML = `
        <img src="${patientPhoto}" class="doctor-small-photo" onerror="this.src='../assets/default-user.png'">
        <div style="flex:1">
          <p><strong>Patient:</strong> ${app.patientId?.name || 'Unknown'}</p>
          <p><strong>Date:</strong> ${app.appointmentDate || ''}</p>
          <p><strong>Time:</strong> ${app.appointmentTime || ''}</p>
          <p><strong class="status-${(app.status||'').toLowerCase()}">Status: ${app.status}</strong></p>
        </div>
      `;
      if (actionable) {
        const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.gap = '10px';
        const approveBtn = document.createElement('button'); approveBtn.className = 'btn doctor-btn'; approveBtn.innerText = 'Approve';
        const rejectBtn = document.createElement('button'); rejectBtn.className = 'btn patient-btn'; rejectBtn.innerText = 'Reject';
        approveBtn.onclick = () => updateAppointmentStatus(app._id, 'Approved', approveBtn);
        rejectBtn.onclick = () => updateAppointmentStatus(app._id, 'Rejected', rejectBtn);
        actions.appendChild(approveBtn); actions.appendChild(rejectBtn); item.appendChild(actions);
      }
      container.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red'>Error loading appointments</p>";
  }
}

function updateStats(appointments) {
  let pending = 0, approved = 0;
  appointments.forEach(a => { if (a.status === 'Pending') pending++; if (a.status === 'Approved') approved++; });
  const pendingEl = document.getElementById('pendingCount'); const approvedEl = document.getElementById('approvedCount');
  if (pendingEl) pendingEl.innerText = pending; if (approvedEl) approvedEl.innerText = approved;
}

async function updateAppointmentStatus(appointmentId, status, btn) {
  if (btn) setButtonLoading(btn, true, `${status}ing...`);
  try {
    await apiCall(`/doctor/appointment/${appointmentId}`, { method: 'PUT', body: JSON.stringify({ status }) });
    showAlert(`Appointment ${status.toLowerCase()}`, 'success');
    await loadDoctorAppointments();
  } catch (err) { showAlert(err.message || 'Failed to update appointment', 'error'); }
  finally { if (btn) setButtonLoading(btn, false, status); }
}

// ===== UPDATE PROFILE =====
const updateProfileBtn = document.getElementById('updateProfileBtn');
if (updateProfileBtn) {
  updateProfileBtn.addEventListener('click', async () => {
    const consultationFee = document.getElementById('consultationFee').value;
    const availableDays = (document.getElementById('availableDays').value || '').split(',').map(d=>d.trim()).filter(Boolean);
    const availableTime = document.getElementById('availableTime').value;
    const hospitalName = document.getElementById('hospitalName').value;
    if (!consultationFee || !availableTime || !hospitalName) { showAlert('Please fill all fields', 'warning'); return; }
    setButtonLoading(updateProfileBtn, true, 'Updating...');
    try {
      await apiCall('/profile/doctor', { method: 'PUT', body: JSON.stringify({ consultationFee: parseFloat(consultationFee), availableDays, availableTime, hospitalName }) });
      showAlert('Profile updated', 'success');
      await loadDoctorProfile();
    } catch (err) { showAlert(err.message || 'Update failed', 'error'); }
    finally { setButtonLoading(updateProfileBtn, false, 'Update Profile'); }
  });
}

// ===== LOGOUT =====
const doctorLogoutBtn = document.getElementById('doctorLogoutBtn');
if (doctorLogoutBtn) {
  doctorLogoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) { clearAuthData(); window.location.href = '../index.html'; }
  });
}

// Auto-load when on dashboard
if (document.getElementById('doctorPhoto')) {
  loadDoctorProfile(); loadDoctorAppointments(); setInterval(loadDoctorAppointments, 30000);
}

function revealWithFade(element) {
  if (!element) return;
  element.style.display = 'block';
  element.classList.add('fade-in');
  requestAnimationFrame(() => {
    element.classList.add('visible');
  });
}

function initDoctorAuthSkeletons() {
  const loginSkeleton = document.getElementById('loginSkeleton');
  const loginForm = document.getElementById('doctorLoginForm');
  if (loginSkeleton && loginForm) {
    loginSkeleton.remove();
    revealWithFade(loginForm);
  }

  const registerSkeleton = document.getElementById('registerSkeleton');
  const registerForm = document.getElementById('doctorRegisterForm');
  if (registerSkeleton && registerForm) {
    registerSkeleton.remove();
    revealWithFade(registerForm);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDoctorAuthSkeletons);
} else {
  initDoctorAuthSkeletons();
}

