/**
 * Dashboard Page
 */

import {getEvents} from "../services/eventServices.js";
import {useQuery} from "@tanstack/react-query";
import Navbar from "../components/Navbar.jsx";
import EventFeed from "../components/dashboard_components/EventFeed.jsx";
import ConnectionsList from "../components/dashboard_components/ConnectionsList.jsx";
import ManageEvents from "../components/dashboard_components/ManageEvents.jsx";
import {useSearchParams} from "react-router-dom";

export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams();

    const feedPage = searchParams.get("page") || 1;

    const { data: eventData, isLoading, isError, error } = useQuery({
        queryKey: ["events", feedPage],
        queryFn: () => getEvents(feedPage),
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
                <EventFeed eventData={eventData} />

                <section className={`flex flex-col flex-1`}>
                    <ManageEvents />
                    <ConnectionsList />
                </section>
            </main>
        </div>
    )
}