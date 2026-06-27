/* ==========================
   REGISTER
========================== */

const registerForm =
    document.getElementById(
        "registerForm"
    );

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name =
                document.getElementById(
                    "name"
                ).value;

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true, "Registering...");

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role: "patient" }),
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    window.location.href = "login.html";
                }
            } catch (error) {
                console.log(error);
                alert("Registration failed. Please try again.");
            } finally {
                setButtonLoading(submitBtn, false, "REGISTER");
            }
        }
    );
}

/* ==========================
   LOGIN
========================== */

const loginForm =
    document.getElementById(
        "loginForm"
    );

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true, "Logging in...");

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    alert("Login Successful");
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.log(error);
                alert("Login failed. Please try again.");
            } finally {
                setButtonLoading(submitBtn, false, "Login");
            }
        }
    );
}

/* ==================================
   PATIENT DASHBOARD
================================== */

const patientName =
    document.getElementById(
        "patientName"
    );

const patientEmail =
    document.getElementById(
        "patientEmail"
    );

const doctorSelect =
    document.getElementById(
        "doctorSelect"
    );

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );

/* ==========================
   LOAD PROFILE
========================== */

async function loadPatientProfile() {

    if (!document.getElementById("patientName"))
        return;

    const response =
        await fetch(
            `${API_BASE}/profile/patient`,
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
        "patientName"
    ).innerText =
        data.name;

    document.getElementById(
        "patientEmail"
    ).innerText =
        data.email;

    document.getElementById(
        "totalAppointments"
    ).innerText =
        data.totalAppointments;

    const patientPhotoElement = document.getElementById(
        "patientPhoto"
    );

    if (patientPhotoElement) {
        setImageSrc(
            patientPhotoElement,
            data.profilePhoto,
            DEFAULT_USER_PHOTO
        );
    }
}

/* ==========================
   LOAD DOCTORS
========================== */

async function loadDoctors() {

    if (!doctorSelect) return;

    const response =
        await fetch(
            `${API_BASE}/doctors`
        );

    const doctors =
        await response.json();

    doctorSelect.innerHTML = "";

    doctors.forEach(
        (doctor) => {

            doctorSelect.innerHTML +=
                `
                <option value="${doctor._id}">
                    ${doctor.doctorName}
                    -
                    ${doctor.specialization}
                </option>
                `;
        }
    );
}

/* ==========================
   LOAD APPOINTMENTS
========================== */

async function loadAppointments() {

    if (!appointmentsList) return;

    const response =
        await fetch(
            `${API_BASE}/appointments`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const appointments =
        await response.json();

    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            ) || "{}"
        );

    const filteredAppointments =
        user._id
            ? appointments.filter(
                  (appointment) =>
                      appointment.patientId &&
                      (appointment.patientId._id ===
                          user._id ||
                          appointment.patientId ===
                              user._id)
              )
            : appointments;

    appointmentsList.innerHTML = "";

    filteredAppointments.forEach(
        (appointment) => {
            const doctorPhoto =
                appointment.doctorId?.profilePhoto
                    ? getFileUrl(appointment.doctorId.profilePhoto)
                    : "../assets/default-doctor.png";

            appointmentsList.innerHTML +=
                `
<div class="appointment-item">

<img
src="${doctorPhoto}"
class="doctor-small-photo">

<p>
Doctor:
${appointment.doctorId?.doctorName || "Unknown"}
</p>

<p>
Date:
${appointment.appointmentDate}
</p>

<p>
Time:
${appointment.appointmentTime}
</p>

<p class="status-${appointment.status.toLowerCase()}">
${appointment.status}
</p>

</div>
`;
        }
    );
}

/* ==========================
   BOOK APPOINTMENT
========================== */

const bookBtn =
    document.getElementById(
        "bookBtn"
    );

if (bookBtn) {

    bookBtn.addEventListener(
        "click",
        async () => {

            setButtonLoading(bookBtn, true, "Booking...");

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            const doctorId =
                doctorSelect.value;

            const appointmentDate =
                document.getElementById(
                    "appointmentDate"
                ).value;

            const appointmentTime =
                document.getElementById(
                    "appointmentTime"
                ).value;

            const response =
                await fetch(
                    `${API_BASE}/appointments`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            patientId:
                                user._id,

                            doctorId,

                            appointmentDate,

                            appointmentTime
                        })
                    }
                );

            const data =
                await response.json();

            alert(data.message);

            loadAppointments();
            setButtonLoading(bookBtn, false, "Book Appointment");
        }
    );
}
/* ==========================
   UPLOAD DOCUMENTS
========================== */

const uploadDocumentsBtn =
document.getElementById(
    "uploadDocumentsBtn"
);

if(uploadDocumentsBtn){

uploadDocumentsBtn.addEventListener(
"click",

async ()=>{

    setButtonLoading(uploadDocumentsBtn, true, "Uploading...");

const formData =
new FormData();

const profilePhoto =
document.getElementById(
"profilePhotoFile"
).files[0];

const aadhaarDocument =
document.getElementById(
"aadhaarFile"
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

const response =
await fetch(

`${API_BASE}/patient-documents/upload`,

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

alert(
data.message
);

loadPatientProfile();

 setButtonLoading(uploadDocumentsBtn, false, "Upload Documents");

}

);

}

/* ==========================
   LOGOUT
========================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "../index.html";
        }
    );
}

/* ==========================
   AUTO LOAD
========================== */

loadPatientProfile();

loadDoctors();

loadAppointments();
