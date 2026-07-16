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