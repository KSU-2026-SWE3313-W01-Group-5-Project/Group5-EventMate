import axios from 'axios';

const CONNECTIONS_BASE_URL = import.meta.env.VITE_CONNECTIONS_API_URL;

const api = axios.create({
    baseURL: CONNECTIONS_BASE_URL,
    withCredentials: true
});

export async function getConnections() {
    try {
        const response = await api.get(`/`);

        return response.data;
    } catch (err) {
        console.log(err.response)
    }
}

export async function createConnection(userUUID) {
    try {
        const response = await api.post(`/${userUUID}`, { params: { userUUID}})

        return response.data;
    } catch (err) {
        console.log(err.response)
    }
}