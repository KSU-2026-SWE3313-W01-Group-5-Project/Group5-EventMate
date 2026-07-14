import EventCard from "../dashboard_components/EventCard.jsx";

export default function EventFeed({events}) {
    return (
        <div className={`flex flex-col
        text-stone-700 dark:text-white
        bg-stone-100 dark:bg-zinc-800/50 dark:border-zinc-800
        border-2 border-stone-200 
        shadow-lg
        overflow-hidden
        min-h-0
        w-3/5 rounded-xl 
        ml-4 mt-4 mr-2 mb-4 p-6
        gap-6
        transition-colors duration-300`}>
            <h1>EventFeed</h1>
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
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
                <EventCard />
            </ul>
        </div>
    )
}