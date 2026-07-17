/**
 * Dashboard Page
 */

import Navbar from "../components/Navbar.jsx";
import EventFeed from "../components/dashboard_components/EventFeed.jsx";
import ConnectionsList from "../components/dashboard_components/ConnectionsList.jsx";
import ManageEvents from "../components/dashboard_components/ManageEvents.jsx";
import LoadingPage from "../components/LoadingPage.jsx";
import {useEvents} from "../context/EventContext.jsx";

export default function Dashboard() {
    const {isLoading, isError} = useEvents();

    if (isLoading) return (
        <>
            <LoadingPage />
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
                <EventFeed />

                <section className={`flex flex-col flex-1`}>
                    <ManageEvents />
                    <ConnectionsList />
                </section>
            </main>
        </div>
    )
}