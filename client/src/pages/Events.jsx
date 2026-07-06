/**
 * Events Page
 *
 * Nothing really going on here yet. Eventually this page will be turned into the user dashboard.
 *
 * This will probably become the most complicated page on the site.
 */

import {Link} from "react-router-dom";
import {getEvents} from "../services/eventServices.js";
import {useQuery} from "@tanstack/react-query";
import Navbar from "../components/Navbar.jsx";

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