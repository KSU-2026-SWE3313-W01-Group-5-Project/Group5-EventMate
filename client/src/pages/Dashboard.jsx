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
import EventFeed from "../components/dashboard_components/EventFeed.jsx";
import ConnectionsList from "../components/dashboard_components/ConnectionsList.jsx";
import ManageEvents from "../components/dashboard_components/ManageEvents.jsx";

export default function Dashboard() {
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
        <div className={`flex flex-col h-screen bg-stone-50 dark:bg-zinc-900 overflow-hidden`}>
            <Navbar />
            <main className={`flex flex-1 min-h-0 overflow-hidden`}>
                <EventFeed events={events} />

                <section className={`flex flex-col flex-1`}>
                    <ManageEvents />
                    <ConnectionsList />
                </section>
            </main>
        </div>
    )
}