const API_BASE =
"https://phoenix-backend-t9y4.onrender.com/api";

const token =
    localStorage.getItem("token");

const API_ORIGIN =
    API_BASE.replace("/api", "");

const DEFAULT_USER_PHOTO = "../assets/default-user.png";
const DEFAULT_DOCTOR_PHOTO = "../assets/default-doctor.png";

function getFileUrl(path) {
    if (!path) return "";

    if (path.startsWith("http")) {
        return path;
    }

    return `${API_ORIGIN}/${path.replace(/\\/g, "/")}`;
}

function setImageSrc(imgEl, path, fallbackUrl) {
    if (!imgEl) return;
    if (path) {
        imgEl.src = getFileUrl(path);
        return;
    }
    if (fallbackUrl) {
        imgEl.src = fallbackUrl;
    }
}
