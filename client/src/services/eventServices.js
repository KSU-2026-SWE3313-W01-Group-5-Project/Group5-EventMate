/**
 * EventDetails.jsx API Service Layer
 *
 * No actual logic here yet, this will be added in the next major development 'sprint'
 */

import axios from 'axios';

const EVENTS_BASE_URL = "http://localhost:3000/api/events";

const api = axios.create({
    baseURL: EVENTS_BASE_URL,
    withCredentials: true
})

export async function getEvents(page) {
    const response = await api.get('/', { params: { page } });

    return response.data;
}

export async function getEventRegistrations() {
    const response = await api.get("/registrations");

    return response.data;
}

export async function registerForEvent({eventId, occurrence}) {

    // Send eventId and occurrence as a flat POST body so the server receives them correctly.
    // Using "params" here nests the values under req.body.params, which the backend does not expect.
    const response = await api.post('/register', { eventId, occurrence });

    return response.data;
}