/**
 * Auth API Service Layer
 *
 * Centralized axios wrapper for all authentication requests.
 *
 * This file abstracts the API calls so UI components and hooks only interact with clean function calls (mostly through authContext right now).
 *
 * All protected requests require the config "withCredentials: true" which ensures that the backend receives the HTTP-only cookies so it can
 * verify that a user is authenticated and is interacting with data from the correct account.
 */

import axios from "axios";

// Centralized API base URL for auth
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL;

// Scalable pattern
const api = axios.create({
    baseURL: AUTH_BASE_URL,
    withCredentials: true
})

export async function login(credentials) {
    const response = await api.post("/login", credentials);

    return response.data;
}

export async function register(userData) {
    const response = await api.post("/register", userData);

    return response.data;
}

export async function logout() {
    try {
        const response = await api.post("/logout");

        return response.data;
    } catch (err) {
        console.log("Logout error:", err);
    }
}