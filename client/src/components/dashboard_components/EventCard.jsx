export default function EventCard({event, onViewEvent }) {
    if (!event) {
        return null
    }

    return (
        <li className={`group flex h-full flex-col text-stone-800 dark:text-white bg-stone-300/50 
        dark:bg-zinc-900 dark:border-zinc-700 border-2 border-stone-200
        rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 
        transition-all duration-300 overflow-hidden`}>
            <div className="relative shrink-0 overflow-hidden h-32">
                <img
                    className="w-full h-full object-cover object-[center_15%] group-hover:scale-105
                    transition-transform duration-300"
                    // style={{width: 256, aspectRatio: 16 / 9}}
                    src={event.image_url}
                    alt={"EventDetails.jsx Image"}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40
                to-transparent`}>

                </div>
            </div>

            <div className={`flex flex-col flex-1 min-h-0 p-2`}>

                <h3 className={`font-bold text-lg text-stone-900 
                    dark:text-white`}>
                    {event.name}
                </h3>

                <p className={` line-clamp-2 max-h-8 flex-1 text-sm leading-4 
                text-stone-600 dark:text-zinc-400`}>
                    {event.description}
                </p>

                <button
                    type="button"
                    onClick={onViewEvent}
                    className={`w-full mt-auto bg-zinc-500 rounded-lg px-4 py-2
                    text-sm font-bold text-white
                    transition-colors
                    hover:bg-zinc-700
                     shrink-0`}>
                    View Event
                </button>

            </div>

        </li>
    )
}

/*
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
                alt={"EventDetails.jsx Image"}/>
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
 */