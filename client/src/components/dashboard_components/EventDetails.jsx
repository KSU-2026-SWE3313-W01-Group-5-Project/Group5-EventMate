import {useEffect, useState} from 'react';
import {useEvents} from "../../context/EventContext.jsx";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "../../services/userServices.js";
import {getEventById, getEventRegistrationsById} from "../../services/eventServices.js";
import LoadingPage from "../LoadingPage.jsx";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

export default function EventDetails({ eventId, onClose }) {
    const {registrations} = useAuth();

    const {signup, unregister} = useEvents();

    const [selectedDate, setSelectedDate] = useState("");

    const navigate = useNavigate();

    const [usersData, setUsersData] = useState({});

    const [currentRegistrations, setCurrentRegistrations] = useState([]);

    useEffect(() => {
        if (!registrations) return;

        const matchingRegistrations = registrations.filter(
            (registration) =>
                String(registration.event_id) === String(eventId)
        );

        setCurrentRegistrations(matchingRegistrations);
    }, [registrations, eventId]);

    const {
        data: event,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventById(eventId),
        enabled: !!eventId,
        select: (data) => data.event?.[0] ?? null,
    })

    const {
        data: registeredUsers,
    } = useQuery({
        queryKey: ["eventRegistrations", eventId],
        queryFn: () => getEventRegistrationsById(eventId),
        enabled: !!eventId,
    });

    useEffect(() => {
        async function getUserProfiles() {
            if (!registeredUsers) return;

            if (registeredUsers.message === "REGISTERED_USERS") {
                const profiles = await Promise.all(
                    registeredUsers.data.map((user) => {
                        return getUserProfile(user.public_id)
                    })
                );

                setUsersData(profiles);
            }

            if (registeredUsers.message === "NO_USERS_REGISTERED") {
                setUsersData([]);
            }
        }

        getUserProfiles();
    }, [registeredUsers]);

    const occurrences = event?.occurrences ?? [] ;

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            return null;
        }

        try {
            const response = await signup({
                eventId: event.id,
                occurrence: selectedDate,
            });

            console.log("Signup response:", response);
        } catch (err) {
            console.error(err);
        }
    }

    const handleUnregister = async (registration) => {
        if (!registration) return;

        try {
            const response = await unregister(registration.id);

            console.log(response);
        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading || !event) return <LoadingPage />;

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
            <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto p-6 gap-3 scrollbar scrollbar-thin
                scrollbar-thumb-zinc-800 scrollbar-track-transparent
                dark:scrollbar-thumb-stone-100`}>

                <div className="relative h-[38%] shrink-0 overflow-hidden rounded-md">
                    <img
                        className="h-full w-full object-contain object-center"
                        src={event.image_url}
                        alt={`${event.name}`}
                    />

                    <div className={`absolute inset-0
                        pointer-events-none
                        z-10
                        bg-linear-to-t
                        from-black/60
                        to-black/20`}
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close event detail"
                        className={`
                        absolute right-5 top-5 z-50
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        border-2 border-white/40
                        bg-zinc-700
                        text-2xl font-bold leading-none
                        text-white
                        shadow-lg
                        transition-colors
                        hover:bg-zinc-800`}>
                        ×
                    </button>
                </div>

                <div className={`flex-1`}>
                    <div className="flex flex-col" hidden={currentRegistrations.length === 0}>
                        <h1 className={`text-xl font-bold`}>Your Registrations</h1>

                        <ul className={`mt-4 flex-1 flex-col
                                rounded-lg
                                bg-zinc-100 dark:bg-zinc-700
                                space-y-3
                                overflow-y-auto
                                scrollbar scrollbar-thin
                                scrollbar-thumb-zinc-800 scrollbar-track-transparent
                                dark:scrollbar-thumb-stone-100
                                mr-5 mb-5 p-3`}>
                            {currentRegistrations.map((registration) => {

                                return (
                                    <li className={`flex rounded-lg
                                    bg-zinc-200 dark:bg-zinc-600
                                    p-3
                                    `}
                                    key={registration.occurrence}>
                                        <p className={`content-center`}> Date: {new Date(registration.occurrence).toLocaleString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit"
                                            })}
                                        </p>

                                        <button
                                            type={`button`}
                                            onClick={() => handleUnregister(registration)}
                                            className={`ml-auto mr-3 border border-red-200 bg-red-50 text-red-700 rounded-md px-2 py-1`}
                                        >
                                            Unregister
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className={`flex mt-1`}>
                        <div className="grid grid-cols-1 gap-4 w-7/10">
                            <h3 className="text-2xl font-bold">
                                {event.name}
                            </h3>

                            <p className="
                                leading-6
                                text-stone-600
                                dark:text-zinc-300
                                text-justify"
                            >
                                {event.description}
                            </p>

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
                        <div className={`
                            flex flex-col flex-1 
                            justify-center 
                            min-h-0
                            max-h-[40vh]
                        `}>
                            <h3 className={`m-auto text-md font-bold`}>Attendees</h3>

                            <ul
                                className={`
                                mt-4 flex flex-col flex-1 min-h-0
                                rounded-lg
                                bg-zinc-100 dark:bg-zinc-700
                                space-y-3
                                overflow-y-auto
                                scrollbar scrollbar-thin
                                scrollbar-thumb-zinc-800 scrollbar-track-transparent
                                dark:scrollbar-thumb-stone-100
                                m-5 p-3
                            `}>
                                {usersData.length > 0 ? (
                                    usersData.map((user) => (
                                        <li
                                            onClick={() => navigate(`/profile/?user=${user.public_id}`)}
                                            key={user.public_id}
                                            className="
                                            flex h-20 shrink-0 items-center gap-5
                                            rounded-lg
                                            bg-zinc-200 dark:bg-zinc-600
                                            p-3
                                            mr-2
                                            hover:bg-zinc-300/35
                                            hover:dark:bg-zinc-600/70
                                            text-stone-800 dark:text-white
                                            dark:border-zinc-800
                                            "
                                        >
                                            <img
                                                src={getUserProfilePicture(user.profile_picture_url)}
                                                className={`h-15 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50 shadow-lg`}
                                                alt="Profile Image"
                                            />
                                            <div className={`flex flex-col gap-1`}>
                                                <h3 className="text-md font-semibold">{user.username}</h3>
                                                <p className={`text-xs text-stone-500 dark:text-zinc-200 `}>{user.firstname} {user.lastname}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className={`flex h-full items-center justify-center text-sm text-stone-600 dark:text-zinc-400`}>No one signed up yet, be the first!</li>
                                )}
                            </ul>
                        </div>
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
                        Register for Event
                    </button>
                </div>
            </div>
        </section>
    )
}