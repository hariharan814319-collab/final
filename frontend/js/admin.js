/* ==========================
   ADMIN LOGIN
========================== */
let allDoctors = [];
const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById(
                    "adminEmail"
                ).value;

            const password =
                document.getElementById(
                    "adminPassword"
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
                    JSON.stringify(data.user)
                );

                window.location.href =
                    "dashboard.html";

            } else {

                alert(data.message);

            }
        }
    );
}

/* ==========================
   DASHBOARD STATISTICS
========================== */

async function loadAdminStats() {

    const totalDoctors =
        document.getElementById(
            "totalDoctors"
        );

    if (!totalDoctors) return;

    const response =
        await fetch(
            `${API_BASE}/admin/stats`,
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
        "totalDoctors"
    ).innerText =
        data.totalDoctors;

    document.getElementById(
        "totalPatients"
    ).innerText =
        data.totalPatients;

    document.getElementById(
        "totalAppointments"
    ).innerText =
        data.totalAppointments;
      document.getElementById(
"pendingDoctors"
).innerText =
data.pendingDoctors;

document.getElementById(
"approvedDoctors"
).innerText =
data.approvedDoctors;  
}

/* ==========================
   LOAD DOCTORS
========================== */

async function loadDoctorsAdmin() {

    const doctorList =
        document.getElementById(
            "doctorList"
        );

    if (!doctorList) return;

    const response =
        await fetch(
            `${API_BASE}/doctors`
        );

    const doctors =
        await response.json();

    allDoctors = doctors;

    renderDoctors(doctors);
}

function renderDoctors(doctors) {
    const doctorList = document.getElementById("doctorList");
    if (!doctorList) return;

    doctorList.innerHTML = "";

    doctors.forEach((doctor) => {
        doctorList.innerHTML += `
<div class="appointment-item">

<h3>
${doctor.doctorName}
</h3>

<p>
${doctor.specialization}
</p>

<p>
Status:
${doctor.verificationStatus}
</p>

<p>
Hospital:
${doctor.hospitalName}
</p>

<div class="admin-actions">

<button
onclick="approveDoctor('${doctor._id}')"
class="btn doctor-btn">

Approve

</button>

<button
onclick="rejectDoctor('${doctor._id}')"
class="btn patient-btn">

Reject

</button>

<button
onclick="deleteDoctor('${doctor._id}')"
class="btn">

Delete

</button>

</div>

</div>
`;
    });
}

/* ==========================
   CREATE DOCTOR
========================== */

const doctorForm =
    document.getElementById(
        "doctorForm"
    );

if (doctorForm) {

    doctorForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            await fetch(
                `${API_BASE}/doctors`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

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

                        availableDays: [
                            "Monday",
                            "Wednesday",
                            "Friday"
                        ],

                        availableTime:
                            document.getElementById(
                                "availableTime"
                            ).value

                    })
                }
            );

            alert(
                "Doctor Added"
            );

            doctorForm.reset();

            loadDoctorsAdmin();

            loadAdminStats();
        }
    );
}

/* ==========================
   DELETE DOCTOR
========================== */

async function deleteDoctor(id) {

    await fetch(
        `${API_BASE}/doctors/${id}`,
        {
            method: "DELETE",

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    loadDoctorsAdmin();

    loadAdminStats();
}
async function approveDoctor(id){

const response =
await fetch(

`${API_BASE}/admin/approve-doctor/${id}`,

{
method:"PUT",

headers:{
Authorization:
`Bearer ${token}`
}
}

);

const data =
await response.json();

alert(
data.message
);

loadDoctorsAdmin();

loadAdminStats();

}
async function rejectDoctor(id){

const response =
await fetch(

`${API_BASE}/admin/reject-doctor/${id}`,

{
method:"PUT",

headers:{
Authorization:
`Bearer ${token}`
}
}

);

const data =
await response.json();

alert(
data.message
);

loadDoctorsAdmin();

loadAdminStats();

}

/* ==========================
   ADMIN LOGOUT
========================== */

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );

if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "../index.html";
        }
    );
}

loadAdminStats();

loadDoctorsAdmin();

const doctorSearch =
document.getElementById(
"doctorSearch"
);

if(doctorSearch){

doctorSearch.addEventListener(
"keyup",

()=>{

const value =
doctorSearch.value
.toLowerCase();

const filtered =
allDoctors.filter(

doctor =>

doctor.doctorName
.toLowerCase()
.includes(value)

||

doctor.specialization
.toLowerCase()
.includes(value)

);

renderDoctors(
filtered
);

}

);

}