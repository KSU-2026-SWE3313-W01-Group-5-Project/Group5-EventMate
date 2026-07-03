import axios from "axios";

const AUTH_BASE_URL = "http://localhost:3000/api/auth";
const USERS_BASE_URL = "http://localhost:3000/api/users";

export async function login(credentials) {
    const response = await axios.post(
        `${AUTH_BASE_URL}/login`,
        credentials,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function register(userData) {
    const response = await axios.post(
        `${AUTH_BASE_URL}/register`,
        userData
    );

    return response.data;
}

export async function getCurrentUser() {
    const response = await axios.get(
        `${USERS_BASE_URL}/me`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function logout() {
    try {
        const response = await axios.post(
            `${AUTH_BASE_URL}/logout`,
            {},
            {
                withCredentials: true,
            }
        )

        return response.data;
    } catch (err) {
        console.log("Logout error:", err);
    }
}

export async function updateUser(userData) {
    const response = await axios.patch(
        `${USERS_BASE_URL}/me/update`,
        userData,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function deleteUser() {
    const response = await axios.delete(
        `${USERS_BASE_URL}/me/update/delete`,
        {
            withCredentials: true,
        }
    )

    return response.data;
}