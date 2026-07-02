import axios from "axios";

const BASE_URL = "http://localhost:3000/api/auth";

export async function login(credentials) {
    const response = await axios.post(
        `${BASE_URL}/login`,
        credentials
    );

    return response.data;
}

export async function register(userData) {
    const response = await axios.post(
        `${BASE_URL}/register`,
        userData
    );

    return response.data;
}

export async function getCurrentUser() {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${BASE_URL}/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
}

export async function updateUser(userData) {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
        `${BASE_URL}/me/update`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}