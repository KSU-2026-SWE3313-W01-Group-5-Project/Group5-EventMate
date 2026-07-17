import { useState } from 'react'
import EventCard from "../dashboard_components/EventCard.jsx";
import EventDetails from "../dashboard_components/EventDetails.jsx";
import { useSearchParams } from "react-router-dom";
import { FaAngleLeft, FaAnglesLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";
import {useEvents} from "../../context/EventContext.jsx";
import LoadingPage from "../LoadingPage.jsx";

export default function EventFeed() {
    const {eventData, feedPage, totalPages, isLoading} = useEvents();

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEvents = eventData.events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedEventId = searchParams.get("event");
    const selectedEvent = eventData.events.find((event) => event.id === selectedEventId);

    const updatePage = (newPage) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set("page", newPage);

            return newParams;
        });
    };

    if (isLoading) return <LoadingPage />

    return (
        <div className={`
            relative flex flex-col
            text-stone-700 dark:text-white
            bg-stone-100 dark:bg-zinc-800/70 dark:border-zinc-800 
            hover:bg-zinc-300/35
            hover:dark:bg-zinc-800
            border-2 border-stone-200 
            shadow-lg
            overflow-hidden
            min-h-0
            w-3/5 rounded-xl 
            ml-4 mt-4 mr-2 mb-4 p-6
            gap-6
            transition-colors duration-300
        `}>
            <span className={`flex`}>
                <h2 className="text-lg tracking-tight font-bold">
                    Event Feed
                </h2>

                <div className={`flex ml-auto`}>
                    <button
                        disabled={feedPage === 1}
                        onClick={() => updatePage(1)}
                    >
                        <FaAnglesLeft />
                    </button>

                    <button
                        disabled={feedPage === 1}
                        onClick={() => updatePage(feedPage - 1)}
                    >
                        <FaAngleLeft />
                    </button>

                    <p>Page {feedPage}</p>

                    <button
                        disabled={feedPage === totalPages}
                        onClick={() => updatePage(feedPage + 1)}
                    >
                        <FaAngleRight />
                    </button>

                    <button
                        disabled={feedPage === totalPages}
                        onClick={() => updatePage(totalPages)}
                    >
                        <FaAnglesRight />
                    </button>
                </div>
            </span>

            <section>
                <label htmlFor="event-search" className="sr-only">
                    Search Events
                </label>

                <input
                    id="event-search"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Events..."
                    className="
                    rounded-full w-full
                    px-4 py-1
                    bg-zinc-400/50
                    dark:bg-zinc-500
                    "
                />

            </section>

            <ul className={`grid    
                grid-cols-2
                gap-4
                flex-1
                pt-2 pr-3
                auto-rows-[16rem]
                min-h-0
                overflow-y-auto
                scrollbar scrollbar-thin
                scrollbar-thumb-zinc-800 scrollbar-track-transparent
                dark:scrollbar-thumb-stone-100
            `}>

                {filteredEvents.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onViewEvent={() => {
                            setSearchParams((prevParams) => {
                                const params = new URLSearchParams(prevParams);
                                params.set("event", event.id);

                                return params;
                            });
                        }}
                    />
                ))}
            </ul>

            {selectedEvent && (
                <EventDetails
                    event={selectedEvent}
                    onClose={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete("event");
                        setSearchParams(params)
                    }}
                />
            )}
        </div>
    );
}