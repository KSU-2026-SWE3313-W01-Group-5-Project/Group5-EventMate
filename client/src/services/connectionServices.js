import axios from 'axios';

const CONNECTIONS_BASE_URL = import.meta.env.VITE_CONNECTIONS_API_URL;

const api = axios.create({
    baseURL: CONNECTIONS_BASE_URL,
    withCredentials: true
});

export async function getConnections() {
    try {
        const response = await api.get(`/me`);

        return response.data;
    } catch (err) {
        console.error(err.response)
    }
}

export async function createConnection(userUUID) {
    try {
        const response = await api.post(`/me/${userUUID}`, { params: { userUUID}})

        return response.data;
    } catch (err) {
        console.error(err.response)
    }
}

export async function removeConnection(userUUID) {
    try {
        const response = await api.delete(`/me/${userUUID}`, { params: { userUUID }});

        return response.data;
    } catch (err) {
        console.error(err.response)
    }
}