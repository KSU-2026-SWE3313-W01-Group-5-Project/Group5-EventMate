import axios from 'axios';

const CONVERSATIONS_BASE_URL = import.meta.env.VITE_CONVERSATIONS_API_URL;

const api = axios.create({
    baseURL: CONVERSATIONS_BASE_URL,
    withCredentials: true
});

export async function getConversationWithDetails(conversationID) {
    try {
        const response = await api.get(`/${conversationID}`, {params: {conversationID}});

        return response.data;
    } catch (err) {
        console.error(err.response)
    }
}