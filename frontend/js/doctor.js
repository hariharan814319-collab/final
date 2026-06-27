/* ==========================
   DOCTOR REGISTER
========================== */

const doctorRegisterForm =
document.getElementById(
"doctorRegisterForm"
);

// `setButtonLoading` is provided by config.js

if(doctorRegisterForm){

doctorRegisterForm.addEventListener(
"submit",

async(e)=>{

    e.preventDefault();

    const registerButton =
        doctorRegisterForm.querySelector(
            'button[type="submit"]'
        );

    setButtonLoading(
        registerButton,
        true,
        "Registering..."
    );

    try {
        const response =
            await fetch(

            `${API_BASE}/doctors/register`,

            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json"
                },

                body:JSON.stringify({

name:
document.getElementById(
"name"
).value,

email:
document.getElementById(
"email"
).value,

password:
document.getElementById(
"password"
).value,

doctorName:
document.getElementById(
"doctorName"
).value,

specialization:
document.getElementById(
"specialization"
).value,

experience:
document.getElementById(
"experience"
).value,

consultationFee:
document.getElementById(
"consultationFee"
).value,

hospitalName:
document.getElementById(
"hospitalName"
).value,

medicalLicenseNumber:
document.getElementById(
"medicalLicenseNumber"
).value,

aadhaarNumber:
document.getElementById(
"aadhaarNumber"
).value,

availableDays:
document.getElementById(
"availableDays"
).value.split(","),

availableTime:
document.getElementById(
"availableTime"
).value

})

}

);

const data =
            await response.json();

        if (!response.ok) {
            alert(
                data.message ||
                "Registration failed."
            );
            return;
        }

        localStorage.setItem(
            "doctorEmail",
            document.getElementById(
                "email"
            ).value
        );

        window.location.href =
            "otp.html";
    } catch (error) {
        alert(
            "Registration failed. Please try again."
        );
    } finally {
        setButtonLoading(
            registerButton,
            false,
            "Register"
        );
    }
}

);

}
/* ==========================
   DOCTOR LOGIN
========================== */

const doctorLoginForm =
    document.getElementById(
        "doctorLoginForm"
    );

if (doctorLoginForm) {

    doctorLoginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById(
                    "doctorEmail"
                ).value;

            const password =
                document.getElementById(
                    "doctorPassword"
                ).value;

            const response =
                await fetch(
                    `${API_BASE}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );

                window.location.href =
                    "dashboard.html";
            }

            else {

                alert(
                    data.message
                );
            }
        }
    );
}

/* ==========================
   DOCTOR PROFILE
========================== */

const doctorName =
    document.getElementById(
        "doctorName"
    );

const doctorEmail =
    document.getElementById(
        "doctorEmail"
    );

async function loadDoctorProfile() {

    if (!document.getElementById("doctorPhoto"))
        return;

    const response =
        await fetch(
            `${API_BASE}/profile/doctor`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    document.getElementById(
        "doctorName"
    ).innerText =
        data.doctorName;

    document.getElementById(
        "doctorEmail"
    ).innerText =
        data.userId.email;

    document.getElementById(
        "doctorHospital"
    ).innerText =
        data.hospitalName;

    document.getElementById(
        "verificationStatus"
    ).innerText =
        data.verificationStatus;
        const statusElement =
document.getElementById(
"verificationStatus"
);

if(
data.verificationStatus ===
"Approved"
){

statusElement.className =
"approved-status";

}

if(
data.verificationStatus ===
"Pending"
){

statusElement.className =
"pending-status";

}

if(
data.verificationStatus ===
"Rejected"
){

statusElement.className =
"rejected-status";

}
        const status =
data.verificationStatus;

if(status === "Pending"){

alert(
"Your verification is pending admin approval."
);

}

if(status === "Rejected"){

alert(
"Your verification has been rejected."
);

}

    const doctorPhotoElement = document.getElementById(
        "doctorPhoto"
    );

    if (doctorPhotoElement) {
        setImageSrc(
            doctorPhotoElement,
            data.profilePhoto,
            DEFAULT_DOCTOR_PHOTO
        );
    }

    document.getElementById(
        "consultationFee"
    ).value =
        data.consultationFee;

    document.getElementById(
        "availableDays"
    ).value =
        data.availableDays.join(",");

    document.getElementById(
        "availableTime"
    ).value =
        data.availableTime;

    document.getElementById(
        "hospitalName"
    ).value =
        data.hospitalName;
}
/* ==========================
   LOAD DOCTOR APPOINTMENTS
========================== */

const doctorAppointments =
    document.getElementById(
        "doctorAppointments"
    );

async function loadDoctorAppointments() {

    if (!doctorAppointments) return;

    const response =
        await fetch(
            `${API_BASE}/doctor/appointments`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const dashboardData =
        await response.json();

    const appointments =
        Array.isArray(dashboardData)
            ? dashboardData
            : dashboardData.appointments || [];

    updateStats(
        appointments
    );

    doctorAppointments.innerHTML = "";

    appointments.forEach(
        (appointment) => {

            doctorAppointments.innerHTML +=
                `
                <div class="appointment-item">

                    <p>
                        Patient:
                        ${appointment.patientId?.name || "Unknown Patient"}
                    $
                    appointment.status === "Pending"
                    ?
                    `
                    <button type="button"
                    onclick="updateAppointmentStatus(
                    '${appointment._id}',
                    'Approved'
                    )
                    class="btn doctor-btn">
                    Approve
                    </button>
                    `
                        Time:
                        ${appointment.appointmentTime}
                    </p>

                    <p>
                        Status:
                        ${appointment.status}
                    </p>

                    <br>

                    ${
appointment.status === "Pending"
?
`
<button
onclick="updateAppointmentStatus(
'${appointment._id}',
'Approved'
)"
class="btn doctor-btn">
Approve
</button>
`
:
`
<span class="approved-badge">
Already Approved
</span>
`
}

                </div>
                `;
        }
    );
}
function updateStats(
    appointments
) {

    let pending = 0;

    let approved = 0;

    appointments.forEach(
        (appointment) => {

            if (
                appointment.status ===
                "Pending"
            )
                pending++;

            if (
                appointment.status ===
                "Approved"
            )
                approved++;

        }
    );

    const pendingEl =
        document.getElementById(
            "pendingCount"
        );

    const approvedEl =
        document.getElementById(
            "approvedCount"
        );

    if (pendingEl)
        pendingEl.innerText =
            pending;

    if (approvedEl)
        approvedEl.innerText =
            approved;
}

/* ==========================
   UPDATE STATUS
========================== */

async function updateAppointmentStatus(
    appointmentId,
    status
) {

    const response =
        await fetch(
            `${API_BASE}/doctor/appointment/${appointmentId}`,
            {
                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status
                })
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadDoctorAppointments();
}
const updateProfileBtn =
document.getElementById(
"updateProfileBtn"
);

if(updateProfileBtn){

updateProfileBtn.addEventListener(
"click",

async()=>{

const response =
await fetch(

`${API_BASE}/profile/doctor`,

{
method:"PUT",

headers:{

"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:JSON.stringify({

consultationFee:
document.getElementById(
"consultationFee"
).value,

availableDays:
document.getElementById(
"availableDays"
).value
.split(","),

availableTime:
document.getElementById(
"availableTime"
).value,

hospitalName:
document.getElementById(
"hospitalName"
).value

})

}

);

const data =
await response.json();

alert(
data.message
);

loadDoctorProfile();

}

);

}
/* ==========================
   SEND OTP
========================== */

const doctorEmailInput =
document.getElementById(
"doctorEmail"
);

if (doctorEmailInput &&
    !doctorEmailInput.value) {
  doctorEmailInput.value =
    localStorage.getItem(
      "doctorEmail"
    ) || "";
}

const sendOtpBtn =
document.getElementById(
"sendOtpBtn"
);

if(sendOtpBtn){

sendOtpBtn.addEventListener(
"click",

async()=>{

const email =
  doctorEmailInput?.value ||
  localStorage.getItem(
    "doctorEmail"
  );

if (!email) {
  alert(
    "Doctor email missing. Please register first."
  );
  return;
}

const originalText =
        sendOtpBtn.innerText;

      setButtonLoading(
        sendOtpBtn,
        true,
        "Sending OTP..."
      );

      try {
        const response =
          await fetch(

            `${API_BASE}/otp/send`,

            {
              method:"POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              body:JSON.stringify({
                email
              })

            }

          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "OTP send failed."
          );
          return;
        }

        localStorage.setItem(
          "doctorEmail",
          email
        );

        sendOtpBtn.innerText =
          "OTP Sent";
        setTimeout(() => {
          setButtonLoading(
            sendOtpBtn,
            false,
            originalText
          );
        }, 1500);
      } catch (error) {
        alert(
          "Unable to send OTP. Please try again."
        );
      } finally {
        if (
          sendOtpBtn.disabled
        ) {
          setButtonLoading(
            sendOtpBtn,
            false,
            originalText
          );
        }
      }

    }

  );

}
/* ==========================
   VERIFY OTP
========================== */

const verifyOtpBtn =
document.getElementById(
"verifyOtpBtn"
);

if(verifyOtpBtn){

  verifyOtpBtn.addEventListener(
    "click",

    async()=>{

      const email =
        doctorEmailInput?.value ||
        localStorage.getItem(
          "doctorEmail"
        );

      if (!email) {
        alert(
          "Doctor email missing. Please register first."
        );
        return;
      }

            const otpValue =
        document.getElementById(
          "otp"
        ).value.trim();

      if (!otpValue) {
        alert(
          "Please enter the OTP."
        );
        return;
      }

      setButtonLoading(
        verifyOtpBtn,
        true,
        "Verifying..."
      );

      try {
        const response =
          await fetch(

            `${API_BASE}/otp/verify`,

            {
              method:"POST",

              headers:{
                "Content-Type":
                  "application/json"
              },

              body:JSON.stringify({

                email,

                otp: otpValue

              })

            }

          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Invalid OTP."
          );
          return;
        }

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        window.location.href =
          "documents.html";
      } catch (error) {
        alert(
          "OTP verification failed. Please try again."
        );
      } finally {
        setButtonLoading(
          verifyOtpBtn,
          false,
          "Verify OTP"
        );
      }

    }

  );

}
/* ==========================
   DOCTOR DOCUMENT UPLOAD
========================== */

const uploadDoctorDocumentsBtn =
document.getElementById(
"uploadDoctorDocumentsBtn"
);

if(uploadDoctorDocumentsBtn){

uploadDoctorDocumentsBtn.addEventListener(
"click",

async()=>{

const formData =
new FormData();

const profilePhoto =
document.getElementById(
"profilePhoto"
).files[0];

const aadhaarDocument =
document.getElementById(
"aadhaarDocument"
).files[0];

const licenseDocument =
document.getElementById(
"licenseDocument"
).files[0];

const degreeDocument =
document.getElementById(
"degreeDocument"
).files[0];

if(profilePhoto){

formData.append(
"profilePhoto",
profilePhoto
);

}

if(aadhaarDocument){

formData.append(
"aadhaarDocument",
aadhaarDocument
);

}

if(licenseDocument){

formData.append(
"licenseDocument",
licenseDocument
);

}

if(degreeDocument){

formData.append(
"degreeDocument",
degreeDocument
);

}

setButtonLoading(
        uploadDoctorDocumentsBtn,
        true,
        "Uploading..."
      );

      try {
        const response =
          await fetch(

            `${API_BASE}/documents/upload`,

            {
              method:"POST",

              headers:{
                Authorization:
                  `Bearer ${token}`
              },

              body:formData
            }

          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Upload failed."
          );
          return;
        }

        window.location.href =
          "login.html";
      } catch (error) {
        alert(
          "Upload failed. Please try again."
        );
      } finally {
        setButtonLoading(
          uploadDoctorDocumentsBtn,
          false,
          "Upload Documents"
        );
      }

}

);

}
/* ==========================
   DOCTOR LOGOUT
========================== */

const doctorLogoutBtn =
    document.getElementById(
        "doctorLogoutBtn"
    );

if (doctorLogoutBtn) {

    doctorLogoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "../index.html";
        }
    );
}

loadDoctorProfile();

loadDoctorAppointments();
