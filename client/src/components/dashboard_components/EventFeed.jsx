import { useState } from 'react'
import EventCard from "../dashboard_components/EventCard.jsx";
import EventDetails from "../dashboard_components/EventDetails.jsx";

export default function EventFeed({events}) {

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`
            relative flex flex-col
            text-stone-700 dark:text-white
            bg-stone-100 dark:bg-zinc-800/70 dark:border-zinc-800 
            hover:bg-zinc-300
            hover:dark:bg-zinc-700
            border-2 border-stone-200 
            shadow-lg
            overflow-hidden
            min-h-0
            w-3/5 rounded-xl 
            ml-4 mt-4 mr-2 mb-4 p-6
            gap-6
            transition-colors duration-300
        `}>
            <h2 className="text-lg tracking-tight font-bold">
                Event Feed
            </h2>

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
                        onViewEvent={() => setSelectedEvent(event)}
                    />
                ))}
            </ul>

            {selectedEvent && (
                <EventDetails
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
}