import axios from "axios";

const BASE_URL = "http://localhost:3000";

export default function getUserProfilePicture(filename) {
    return filename
        ? `${BASE_URL}/uploads/${filename}`
        : "/default-profile.png";
}