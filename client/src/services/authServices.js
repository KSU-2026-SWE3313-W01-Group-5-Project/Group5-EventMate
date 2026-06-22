import axios from "axios";

const BASE_URL = "http://localhost:3000/api/auth";

export async function login(credentials) {
    const response = await axios.post(
        `${BASE_URL}/login`,
        credentials
    );

    console.log(response);

    return response.data;
}

export async function register(userData) {
    const response = await axios.post(
        `${BASE_URL}/register`,
        userData
    );

    return response.data;
}