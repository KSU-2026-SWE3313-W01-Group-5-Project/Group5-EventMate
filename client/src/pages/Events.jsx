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

                <div className={`flex flex-col gap-4`}>
                    {events.map(event => (
                        <div key={event.id}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>{event.timezone}</p>
                            <p>{event.status}</p>
                            <img
                                style={{width:512, aspectRatio:16/9}}
                                src={event.image_url}
                                alt={"Event Image"}/>
                            <p>{event.venue_id}</p>
                            <p>{event.segment}</p>
                            <p>{event.genre}</p>
                            <p>{event.subgenre}</p>
                            <p>{event.last_seen_at}</p>
                            {event.occurrences.map(occurrence => (
                                <p>{occurrence}</p>
                            ))}
                        </div>
                    ))}
                </div>

                <Link to="/">Return to home</Link>
            </div>
        </>
    )
}