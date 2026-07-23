/**
 * Preferences Settings Sub-Page
 *
 * Allows users to configure their event filtering preferences that control how EventMate personalizes their event feed.
 *
 * Preferences includ:
 * - EventDetails.jsx type
 * - Sub-category filtering
 * - Location-based filtering
 * - Proximity filtering based on that location
 * - Toggling the automatic filtering on or off
 *
 * I intentionally designed the UI to be state-drive and conditionally render sections based on user selections (eg, music
 * categories only appear if the user has selected "Music" as a type to filter for)
 *
 * Location and category selections are built using local state and will later be sent to the backend via an API call.
 * This is the next thing on the to-do list and I will update my comments once that is done.
 */

import {useEffect, useState} from "react";
import LocationTypeahead from "../../components/settings_components/LocationTypeahead.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import LoadingPage from "../../components/LoadingPage.jsx";
import {useCities} from "../../hooks/useCities.js";
import {useNotifications} from "../../context/NotificationContext.jsx";

/**
 * These event types constant arrays are most of the categories I felt were applicable to take from TicketMaster's API.
 * We put them in arrays for the same reason as other pages, it makes it very easy to update and change categories in the future.
 */

const EVENT_TYPES = [
    "Music",
    "Sports",
    "Arts & Theatre",
    "Miscellaneous"
];

const MUSIC_CATEGORIES = [
    "Alternative",
    "Classical",
    "Country",
    "Dance/Electronic",
    "Hip-Hop/Rap",
    "Jazz",
    "Latin",
    "Metal",
    "Other",
    "Pop",
    "R&B",
    "Rock",
];

const SPORTS_CATEGORIES = [
    "Baseball",
    "Basketball",
    "Boxing",
    "Football",
    "Golf",
    "Hockey",
    "Motorsports/Racing",
    "Soccer",
    "Tennis",
];

const ARTS_CATEGORIES = [
    "Broadway",
    "Comedy",
    "Dance",
    "Fashion",
    "Fine Art",
    "Music",
    "Opera",
    "Performance Art",
    "Theatre",
];

/**
 * Here are a bunch of extra categories that I took out because I felt there were way too many, but Ticketmaster does support
 * these extra ones as well:
 *
 * MUSIC_CATEGORIES:
 * "Ballads/Romantic",
 * "Blues",
 * "Folk",
 * "Holiday",
 * "Medieval/Renaissance",
 * "New Age",
 * "Reggae",
 * "Religious",
 * "World"
 *
 * SPORTS_CATEGORIES:
 * "Equestrian",
 * "eSports",
 * "Gymnastics",
 * "Ice Skating",
 * "Indoor Soccer",
 * "Lacrosse",
 * "Martial Arts",
 * "Rodeo",
 * "Rugby",
 * "Softball",
 * "Swimming",
 * "Track & Field",
 * "Volleyball"
 *
 * ARTS_CATEGORIES:
 * "Classical",
 * "Cultural",
 * "Espectaculo",
 * "Magic & Illusions",
 * "Miscellaneous",
 * "Multimedia",
 * "Puppetry",
 * "Variety"
 */

// Kind of arbitrary numbers, I guess these are standard options, I just googled what to offer as options for proximity filtering
const DISTANCE_OPTIONS = [
    10,
    25,
    50,
    100,
    250
];

export default function Preferences() {
    const {user, updatePreferences, isLoading} = useAuth();
    const userPreferences = user.preferences;

    const [autoFilterEnabled, setAutoFilterEnabled] = useState(false);

    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedArts, setSelectedArts] = useState([]);

    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
    const [distance, setDistance] = useState(null);

    const [stateFilter, setStateFilter] = useState(null);
    const [cityFilter, setCityFilter] = useState(null);

    const {addNotification} = useNotifications();

    // Location must be fully defined (both city and state) before enabling distance filtering.
    const locationSelected = stateFilter != null && cityFilter != null;

    // Toggles an item with a multi-select array (same functionality as in SettingsProfile.jsx, I just made this one reusable
    // for any toggle element).
    const toggleSelection = (value, setter) => {
        setter(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    useEffect(() => {
        if (isLoading) return;

        setAutoFilterEnabled(userPreferences.auto_filter_enabled);

        setSelectedEventTypes(userPreferences.event_types);
        setSelectedMusic(userPreferences.music_categories);
        setSelectedSports(userPreferences.sports_categories);
        setSelectedArts(userPreferences.arts_categories);

        setDistance(userPreferences.max_distance);

        setStateFilter(userPreferences.state_filter);
        setCityFilter(userPreferences.city_filter);
    }, [])

    const styles = {
        formInput: `flex px-4 py-3 gap-x-6 gap-y-2 rounded-md border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
        transition-colors duration-300`,
    }

    const resetLocationFilters = () => {
        setStateFilter(null);
        setCityFilter(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Builds a normalized preferences object for the backend. Only includes subcategories if their parent event type
            // is selected. This is to prevent a bug where a user can select an event type, choose subcategories, then deselect
            // the event type and the subcategories are still sent.
            // You may notice that all variables in this object are named in snake_case instead of camelCase. This is so the fields
            // can automatically match the columns in our table so we do not have to do any tedious parsing in the backend.

            const preferences = {
                auto_filter_enabled: autoFilterEnabled,
                event_types: selectedEventTypes,

                // Only include music categories if Music is selected.
                music_categories: (selectedEventTypes.includes("Music") ? selectedMusic : []),

                // Only include sports categories if Sports is selected.
                sports_categories: (selectedEventTypes.includes("Sports") ? selectedSports : []),

                // Only include arts categories if Arts & Theatre is selected.
                arts_categories: (selectedEventTypes.includes("Arts & Theatre") ? selectedArts : []),

                max_distance: distance,
                city_filter: cityFilter,
                state_filter: stateFilter,
            };

            await updatePreferences(preferences);

            addNotification({
                kind: "success",
                title: "Event Preferences Set",
                subtitle: "Your filter preferences have been updated successfully!",
                timeout: 5000,
            });
        } catch (err) {
            if (!err?.response) {
                addNotification({
                    kind: "error",
                    title: "Server Error",
                    subtitle: "The server failed to respond.",
                    timeout: 5000,
                });
            } else {
                addNotification({
                    kind: "error",
                    title: "Updating Preferences Failed",
                    subtitle: "Your filter preferences were not updated.",
                    timeout: 5000,
                });
            }
        }
    };

    if (isLoading) return <LoadingPage />

    return (
        <div className={"max-w-full h-full flex flex-col gap-5"}>
            <h1 className={"text-xl font-semibold text-stone-700 dark:text-white"}>
                Event Preferences
            </h1>

            <form
                onSubmit={handleSubmit}
                className={"flex flex-col m-5 p-5 gap-10 max-w-3xl"}
            >
                <div className={`${styles.formInput} items-center justify-between`}>
                    <div>
                        <h2 className="font-medium">Automatically personalize my event feed</h2>
                        <p className="text-sm text-stone-500">
                            When enabled, EventMate will filter your events by the preferences below
                        </p>
                    </div>

                    <button
                        type={"button"}
                        onClick={() => setAutoFilterEnabled(prev => !prev)}
                        className={`
                        relative w-14 h-8 rounded-full transition-colors duration-300
                        ${autoFilterEnabled ? "bg-zinc-700" : "bg-stone-300"}
                        `}
                    >
                    <span
                        className={`
                            absolute top-1 left-1
                            h-6 w-6 rounded-full bg-white shadow
                            transition-transform duration-300
                            ${autoFilterEnabled ? "translate-x-6" : ""}
                        `}
                    />
                    </button>
                </div>

                {/* Another fieldset disabling rule. This disables all preference controls when auto-filtering is turned off.
                    Also, visually fades the UI and prevents all interaction events. */}
                <fieldset disabled={!autoFilterEnabled} className={`flex flex-col gap-10 max-w-3xl ${!autoFilterEnabled && `opacity-50 pointer-events-none select-none`} transition-opacity duration-300`}>
                    <div className={`${styles.formInput} items-center flex-wrap`}>
                        <h1 className={'min-w-40'}>Event Types</h1>

                        <div className={'flex flex-wrap gap-2'}>
                            {EVENT_TYPES.map(type => {
                                const selected = selectedEventTypes.includes(type);

                                return (
                                    <button
                                        key={type}
                                        type={'button'}
                                        onClick={() => toggleSelection(type, setSelectedEventTypes)}
                                        className={`
                                        px-4 py-2 rounded-lg text-stone-50 font-medium
                                        transition-colors
                                        ${selected
                                            ? "bg-zinc-900/80 hover:bg-stone-700"
                                            : "bg-stone-800/50 hover:bg-stone-700"
                                        }
                                        `}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                        <div className={'basis-full'}>
                            <p className={'text-sm text-stone-500'}>
                                Leave blank to allow all event types
                            </p>
                        </div>
                    </div>

                    {selectedEventTypes.includes("Music") && (
                        <div className={`${styles.formInput} flex-wrap`}>
                            <div className={'flex items-center'}>
                                <h1 className={'min-w-40'}>Music Genres</h1>
                                <div className={'flex flex-wrap gap-2'}>
                                    {MUSIC_CATEGORIES.map(category => {
                                        const selected = selectedMusic.includes(category);

                                        return (
                                            <button
                                                key={category}
                                                type={'button'}
                                                onClick={() => toggleSelection(category, setSelectedMusic)}
                                                className={`
                                                px-4 py-2 rounded-lg text-stone-50 font-medium
                                                transition-colors
                                                ${selected
                                                    ? "bg-zinc-900/80 hover:bg-stone-700"
                                                    : "bg-stone-800/50 hover:bg-stone-700"
                                                }
                                                `}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={'basis-full'}>
                                <p className={'text-sm text-stone-500'}>
                                    Leave blank to allow all categories
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedEventTypes.includes("Sports") && (
                        <div className={`${styles.formInput} flex-wrap items-center`}>
                            <div className={'flex items-center'}>
                                <h1 className={'min-w-40'}>Sports</h1>

                                <div className={'flex flex-wrap gap-2'}>
                                    {SPORTS_CATEGORIES.map(category => {
                                        const selected = selectedSports.includes(category);

                                        return (
                                            <button
                                                key={category}
                                                type={'button'}
                                                onClick={() => toggleSelection(category, setSelectedSports)}
                                                className={`
                                                px-4 py-2 rounded-lg text-stone-50 font-medium
                                                transition-colors
                                                ${selected
                                                    ? "bg-zinc-900/80 hover:bg-stone-700"
                                                    : "bg-stone-800/50 hover:bg-stone-700"
                                                }
                                                `}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={'basis-full'}>
                                <p className={'text-sm text-stone-500'}>
                                    Leave blank to allow all categories
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedEventTypes.includes("Arts & Theatre") && (
                        <div className={`${styles.formInput} flex-wrap items-center`}>
                            <div className={'flex items-center'}>
                                <h1 className={'min-w-40'}>Arts & Theatre</h1>

                                <div className={'flex flex-wrap gap-2'}>
                                    {ARTS_CATEGORIES.map(category => {
                                        const selected = selectedArts.includes(category);

                                        return (
                                            <button
                                                key={category}
                                                type={'button'}
                                                onClick={() => toggleSelection(category, setSelectedArts)}
                                                className={`
                                                px-4 py-2 rounded-lg text-stone-50 font-medium
                                                transition-colors
                                                ${selected
                                                    ? "bg-zinc-900/80 hover:bg-stone-700"
                                                    : "bg-stone-800/50 hover:bg-stone-700"
                                                }
                                                `}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={'basis-full'}>
                                <p className={'text-sm text-stone-500'}>
                                    Leave blank to allow all categories
                                </p>
                            </div>
                        </div>
                    )}

                    {/* The classname here allows the proximity filtering section to stay disabled as long as locations are not selected */}
                    <div className={`${styles.formInput} ${!locationSelected && `opacity-50 pointer-events-none select-none`} items-center flex-wrap`}>
                        <h1 className={'min-w-40'}>Maximum Distance</h1>

                        <div className={'relative flex-1'}>
                            <button
                                type={'button'}
                                disabled={!locationSelected}
                                onClick={() => setShowDistanceDropdown(prev => !prev)}
                                className={'w-full text-left outline-none'}
                            >
                                {distance ? `Within ${distance} miles` : "No Filtering"}
                            </button>
                            <span className={'absolute right-0 top-1/2 -translate-y-1/2 text-stone-500'}>▼</span>
                            {showDistanceDropdown && (
                                <ul className={'absolute left-0 top-full mt-1 w-full bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'}>
                                    <li
                                        key={"reset"}
                                        onClick={() => {
                                            setDistance(null);
                                            setShowDistanceDropdown(false);
                                        }}
                                        className={'px-3 py-2 hover:bg-stone-100 cursor-pointer'}
                                    >
                                        No Filtering
                                    </li>
                                    {DISTANCE_OPTIONS.map(option => (
                                        <li
                                            key={option}
                                            onClick={() => {
                                                setDistance(option);
                                                setShowDistanceDropdown(false);
                                            }}
                                            className={'px-3 py-2 hover:bg-stone-100 cursor-pointer'}
                                        >
                                            Within {option} miles
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {!locationSelected && (
                            <div className={'basis-full'}>
                                <p className={'text-sm text-stone-500'}>
                                    Set a preferred location before enabling distance filtering.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className={styles.formInput}>
                            <h1>Preferred Location</h1>

                            <LocationTypeahead user={user} setState={setStateFilter} setCity={setCityFilter} state={stateFilter} city={cityFilter?.city}/>
                            <button
                                type={`button`}
                                className={`text-red-700`}
                                onClick={resetLocationFilters}>
                                Reset
                            </button>
                        </div>
                    </div>
                </fieldset>
                <div>
                    <button
                        type={'submit'}
                        className={styles.formInput}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}