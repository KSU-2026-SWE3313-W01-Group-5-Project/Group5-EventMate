/**
 * Event API Service Layer
 *
 * No actual logic here yet, this will be added in the next major development 'sprint'
 */

import axios from 'axios';

const BASE_URL = "http://localhost:3000/api/events";

export async function getEvents() {
    const res = await axios.get(BASE_URL);
    return res.data;
}