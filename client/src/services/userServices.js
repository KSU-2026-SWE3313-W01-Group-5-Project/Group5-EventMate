/**
 * User API Service Layer
 *
 * Centralized axios wrapper for all user requests.
 */

import axios from "axios";

const BASE_URL = "http://localhost:3000/api/users";

export async function getUserProfile(userUUID) {
    const response = await axios.get(
        `${BASE_URL}/${userUUID}`,
        { params: { userUUID } },
    );

    return response.data;
}