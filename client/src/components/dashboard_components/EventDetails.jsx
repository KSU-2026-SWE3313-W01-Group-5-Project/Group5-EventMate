import { useState } from 'react';

export default function EventDetails({ event, onClose }) {
    const [selectedDate, setSelectedDate] = useState("");

    const occurrences = event.occurrences ?? [] ;

    function handleSignUp() {
        if (!selectedDate) {
            return null;
        }
    }

    return (
        <section className={`
        absolute inset-0 z-20
        flex flex-col
        overflow-hidden
        text-stone-900
        bg-zinc-300
        dark:bg-zinc-900
        dark:text-white
        `}>

            <div className="relative h-[38%] shrink-0 overflow-hidden">
                <img
                className="h-full w-full object-contain object-center"
                src={event.image_url}
                alt={`${event.name}`}
                />

                <div className="absolute inset-0
                    pointer-events-none
                    z-10
                    bg-gradient-to-t
                    from-black/60
                    to-black/20"
                />
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close event detail"
                className={`
                    absolute right-4 top-4 z-50
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border-2 border-white/40
                    bg-zinc-700
                    text-2xl font-bold leading-none
                    text-white
                    shadow-lg
                    transition-colors
                    hover:bg-black`}>
                ×
            </button>

            <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto p-6 gap-3 scrollbar scrollbar-thin
                scrollbar-thumb-zinc-800 scrollbar-track-transparent
                dark:scrollbar-thumb-stone-100`}>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                        {event.name}
                    </h2>

                    <p className="mt-3
                    leading-7
                    text-stone-600
                    dark:text-zinc-300">
                        {event.description}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-4">
                        {event.genre && (
                            <div>
                                <p className={`text-sm font-bold`}>
                                    Genre
                                </p>

                                <p className={`text-sm text-stone-600 dark:text-zinc-400`}>
                                    {event.genre}
                                </p>
                            </div>
                        )}

                        {event.segment && (
                            <div>
                                <p className={`text-sm font-bold`}>
                                    Category
                                </p>

                                <p className={`text-sm text-stone-600 dark:text-zinc-400`}>
                                    {event.segment}
                                </p>
                            </div>
                        )}

                        {event.status && (
                            <div>
                                <p className={`text-sm font-bold`}>
                                    Status
                                </p>

                                <p className={`text-sm text-stone-600 dark:text-zinc-400`}>
                                    {event.status}
                                </p>
                            </div>
                        )}

                        {event.timezone && (
                            <div>
                                <p className={`text-sm font-bold`}>
                                    Timezone
                                </p>

                                <p className={`text-sm text-stone-600 dark:text-zinc-400`}>
                                    {event.timezone}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`
                    shrink-0
                    border-t border-stone-300
                    pl-5 pr-5 pb-5 pt-3
                    dark:bg-zinc-700
                    rounded-lg
                `}>
                    <label
                        htmlFor={`event-details-${event.id}`}
                        className={`mb-2  block font-bold text-sm`}
                    >
                        Select a date
                    </label>

                    <select
                        id={`event-details-${event.id}`}
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className={`w-full rounded-lg 
                            border border-stone-300
                            bg-white 
                            px-4 py-3
                            mb-2
                            text-stone-900
                            outline-none
                            focus:border-stone-600
                            dark:bg-zinc-800
                            dark:text-white
                            dark:border-zinc-700`}
                    >
                        <option value="">
                            Choose an available date
                        </option>

                        {occurrences.map((occurrence, index) => (
                            <option
                                key={`${occurrence}-${index}`}
                                value={occurrence}
                            >
                                {new Date(occurrence).toLocaleString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit"
                                    })}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleSignUp}
                        disabled={!selectedDate}
                        className={`
                            w-full 
                            rounded-lg
                            px-5 py-3
                            font-bold
                            text-white
                            transition-colors
                            duration-300
                            bg-zinc-500
                            hover:bg-zinc-900
                            disabled:cursor-not-allowed
                            disabled:bg-stone-400
                            disabled:opacity-50
                        `}
                    >
                        Sign up for Event
                    </button>
                </div>
            </div>
        </section>
    )
}