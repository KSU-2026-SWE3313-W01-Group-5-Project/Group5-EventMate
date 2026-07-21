import {useEvents} from "../../context/EventContext.jsx";
import {useSearchParams} from "react-router-dom";

export default function ManageEvents() {
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        registrations,
        registrationsLoading,
        registrationsIsError
    } = useEvents();
    return (
        <div className={`
            flex flex-1 flex-col
            min-h-0
            text-stone-800 dark:text-white
            bg-stone-100 dark:bg-zinc-800/70
            dark:border-zinc-800
            border-2 border-stone-200
            rounded-xl
            ml-2 mt-4 mr-4 mb-2
            p-6 h-3/5
            hover:bg-zinc-300/35
            hover:dark:bg-zinc-800
        `}>
            <h2 className="text-lg tracking-tight font-bold">
                Manage Events
            </h2>

            {registrationsLoading && (
                <p className="mt-4 text-sm text-stone-500 dark:text-zinc-400">
                    Loading registered events...
                </p>
            )}

            {registrationsIsError && (
                <p className="mt-4 text-sm text-red-600">
                    Unable to load registered events.
                </p>
            )}

            {!registrationsLoading &&
                !registrationsIsError &&
                registrations.length === 0 && (
                    <p className="mt-4 text-sm text-stone-500 dark:text-zinc-400">
                        You have not registered for any events.
                    </p>
                )
            }

            {!registrationsLoading &&
                !registrationsIsError &&
                registrations.length > 0 && (
                    <ul className="
                        mt-4 flex-1
                        min-h-0
                        space-y-3
                        overflow-y-auto
                        scrollbar scrollbar-thin
                        scrollbar-thumb-zinc-800 scrollbar-track-transparent
                        dark:scrollbar-thumb-stone-100
                    ">
                        {registrations.map((registration) => {
                            const {
                                event_id,
                                occurrence,
                                image_url,
                                name,
                                venue_name,
                                venue_city,
                                venue_state
                            } = registration;

                            return (
                                <li
                                    onClick={() => {
                                        setSearchParams((prevParams) => {
                                            const params = new URLSearchParams(prevParams);
                                            params.set("event", registration.event_id);

                                            return params;
                                        });
                                    }}
                                    key={`${event_id}-${occurrence}`}
                                    className="
                                        flex h-40 items-center gap-5
                                        rounded-lg
                                        bg-white dark:bg-zinc-700
                                        p-3
                                        pl-6
                                        mr-2
                                        overflow-hidden
                                    "
                                >
                                    {image_url && (
                                        <img
                                            src={image_url}
                                            alt={name}
                                            className="
                                                h-25 w-35
                                                shrink-0
                                                rounded-md
                                                object-cover
                                            "
                                        />
                                    )}

                                    <div className="min-w-0">
                                        <h3 className="line-clamp-1 text-lg w-full">
                                            {name}
                                        </h3>

                                        <p className="
                                            text-sm
                                            text-stone-600
                                            dark:text-zinc-300
                                        ">
                                            {new Date(occurrence).toLocaleString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit"
                                            })}
                                        </p>

                                        {venue_name && (
                                            <p className="
                                                mt-1 truncate
                                                text-sm
                                                text-stone-500
                                                dark:text-zinc-400
                                            ">
                                                {venue_name}
                                                {venue_city && `, ${venue_city}`}
                                                {venue_state && `, ${venue_state}`}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
        </div>
    )
}