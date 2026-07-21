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
    const response = await api.get("/registrations/me");

    return response.data;
}

export async function getEventRegistrationsById(eventId) {
    const response = await api.get(`/registrations/${eventId}`, { params: { eventId } });

    return response.data;
}

export async function registerForEvent({eventId, occurrence}) {
    const response = await api.post('/register', { eventId, occurrence });

    return response.data;
}

export async function unregisterForEvent({eventId, occurrence}) {
    // const response = await api.delete('/unregister', { eventId, occurrence });
    //
    // return response.data;

    console.log("hello!");
}

export async function getEventById(eventId) {
    const response = await api.get(`/${eventId}`, { params: { eventId } });

    return response.data;
}