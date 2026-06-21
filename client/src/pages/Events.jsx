import {Link} from "react-router-dom";
import {getEvents} from "../services/eventServices.js";
import {useQuery} from "@tanstack/react-query";
import Navbar from "../components/Navbar.jsx";

/*
    EVENTS PAGE

    This page:
    - Fetches events from backend
    - Displays list of events
    - Will later support joining events, creating events, etc.

    This is a good example of how we will actually connect with the backend (server folder) and pull data from it using the files in services/ (eventServices for this one)
    This is a bit more complicated than the Home page...
*/

export default function Events() {
    const { data: events, isLoading, isError, error } = useQuery({
        queryKey: ["events"],
        queryFn: getEvents,
    })

    if (isLoading) return (
        <>
            <Navbar />
            <span>Loading...</span>
        </>
    );

    if (isError) return (
        <>
            <Navbar />
            <span>Error...</span>
        </>
    );

    return (
        <>
            <Navbar />
            <div>
                <h1>Events</h1>
                <p>Welcome to the events page!</p>

                {events.map(event => (
                    <div key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                    </div>
                ))}
                <Link to="/">Return to home</Link>
            </div>
        </>
    )
}