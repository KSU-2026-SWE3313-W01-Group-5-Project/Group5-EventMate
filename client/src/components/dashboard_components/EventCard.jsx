// export default function EventCard({event}) {
//     if (!event) {
//         return null
//     }
//
//     return (
//         <div className={`text-stone-800 dark:text-white
//                 bg-stone-300/50 dark:bg-zinc-800/70 dark:border-zinc-800
//                 border-2 border-stone-200
//                 rounded-xl shadow-lg`}>
//             <img
//                 style={{width:256, aspectRatio:16/9}}
//                 src={event.image_url}
//                 alt={"Event Image"}
//             />
//             <h3>{event.name}</h3>
//             <p>{event.description}</p>
//         </div>
//     )
// }

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
 */