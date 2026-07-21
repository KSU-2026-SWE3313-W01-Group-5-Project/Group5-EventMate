/**
 * User API Service Layer
 *
 * Centralized axios wrapper for all user requests.
 */

import axios from "axios";

const USERS_BASE_URL = "http://localhost:3000/api/users";

// Scalable pattern
const api = axios.create({
    baseURL: USERS_BASE_URL,
    withCredentials: true
})

export async function getUserProfile(userUUID) {
    const response = await api.get(`/${userUUID}`, { params: { userUUID } });

    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/me");

    return response.data;
}

export async function getUserRegistrations() {
    const response = await api.get("/me/registrations");

    return response.data;
}

export async function updateUser(userData) {
    const response = await api.patch("/me/update", userData);

    return response.data;
}

export async function updateUserPreferences(userPreferences) {
    const response = await api.patch("/me/update/updatePreferences", userPreferences);

    return response.data;
}

export async function deleteUser() {
    const response = await api.delete("/me/update/delete");

    return response.data;
}