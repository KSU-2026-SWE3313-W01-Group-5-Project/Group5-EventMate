/**
 * getUserProfilePicture utility function
 *
 * Responsible for returning either a properly formatted <img> src string if the user has a profile picture, or the default
 * picture if not.
 */

const BASE_URL = "http://localhost:3000";

export default function getUserProfilePicture(filename) {
    return filename
        ? `${BASE_URL}/uploads/profile_images/${filename}`
        : "/default-profile.png";
}