import axios from 'axios';

/*
    All of the services.js files we have in the services folder will be each individual component we have to connect wit the API

    This file, for example, will handle all frontend to backend api calls for anything related to events in our API
    Eventually we will have more services files like authServices.js to handle any API calls related to authentication, and etc

    the BASE_URL is the url we define in the backend, and is how we actually get data from the database
    axios is what we are using to make API calls
    axios.get obviously returns information, and something like an axios.post would send information to the server (think logging in, signing up)
*/

const BASE_URL = "http://localhost:3000/api/events";

export async function getEvents() {
    const res = await axios.get(BASE_URL);
    return res.data;
}