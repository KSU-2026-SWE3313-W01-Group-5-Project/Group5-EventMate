const BASE_URL = "http://localhost:3000";

export default function getUserProfilePicture(filename) {
    return filename
        ? `${BASE_URL}/uploads/profile_images/${filename}`
        : "/default-profile.png";
}