import {useState} from "react";
import LocationTypeahead from "../../components/settings_components/LocationTypeahead.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const EVENT_TYPES = [
    "Music",
    "Sports",
    "Arts & Theatre",
    "Miscellaneous"
];

// these are "some" of the sub categories i was able to find from the ticketmaster api
// do distance with a haversine formula
const MUSIC_CATEGORIES = [
    "Alternative",
    "Ballads/Romantic",
    "Blues",
    "Classical",
    "Country",
    "Dance/Electronic",
    "Folk",
    "Hip-Hop/Rap",
    "Holiday",
    "Jazz",
    "Latin",
    "Medieval/Renaissance",
    "Metal",
    "New Age",
    "Other",
    "Pop",
    "R&B",
    "Reggae",
    "Religious",
    "Rock",
    "World"
];

const SPORTS_CATEGORIES = [
    "Baseball",
    "Basketball",
    "Boxing",
    "Equestrian",
    "eSports",
    "Football",
    "Golf",
    "Gymnastics",
    "Hockey",
    "Ice Skating",
    "Indoor Soccer",
    "Lacrosse",
    "Martial Arts",
    "Motorsports/Racing",
    "Rodeo",
    "Rugby",
    "Soccer",
    "Softball",
    "Swimming",
    "Tennis",
    "Track & Field",
    "Volleyball"
];

const ARTS_CATEGORIES = [
    "Broadway",
    "Classical",
    "Comedy",
    "Cultural",
    "Dance",
    "Espectaculo",
    "Fashion",
    "Fine Art",
    "Magic & Illusion",
    "Miscellaneous",
    "Multimedia",
    "Music",
    "Opera",
    "Performance Art",
    "Puppetry",
    "Theatre",
    "Variety"
];

const DISTANCE_OPTIONS = [
    10,
    25,
    50,
    100,
    250
];

export default function Preferences() {
    const {user} = useAuth();

    const [autoFilterEnabled, setAutoFilterEnabled] = useState(false);

    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedArts, setSelectedArts] = useState([]);

    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
    const [distance, setDistance] = useState(DISTANCE_OPTIONS[0]);

    const [stateFilter, setStateFilter] = useState(null);
    const [cityFilter, setCityFilter] = useState(null);

    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const locationSelected = stateFilter != null && cityFilter != null;

    const toggleSelection = (value, setter) => {
        setter(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const styles = {
        formInput: `flex px-4 py-3 gap-x-6 gap-y-2 rounded-md border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
        transition-colors duration-300`,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const preferences = {
                autoFilter: autoFilterEnabled,
                eventTypes: selectedEventTypes,
                musicCategories: (selectedEventTypes.includes("Music") ? selectedMusic : []),
                sportsCategories: (selectedEventTypes.includes("Sports") ? selectedSports : []),
                artsCategories: (selectedEventTypes.includes("Arts & Theatre") ? selectedArts : []),
                maxDistance: distance,
                cityFilter: cityFilter,
                stateFilter: stateFilter,
            };

            console.log(preferences);
            //await updatePreferences(preferences);
            // this function doesnt exist yet

            setSuccess(true);
            setErrorMessage("");
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else {
                setErrorMessage('Updating Preferences Failed');
            }
        }
    };

    return (
        <div className={"max-w-full h-full flex flex-col gap-5"}>
            {success && (
                <h1 className={"w-full px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm"}>
                    Preferences updated!
                </h1>
            )}

            {errorMessage && (
                <p className={`
                    w-full 
                    px-4 py-3  
                    rounded-md 
                    border border-red-200 bg-red-50
                    text-red-700
                    text-sm
                    `}>
                    {errorMessage}
                </p>
            )}

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

                    <div className={`${styles.formInput} ${!locationSelected && `opacity-50 pointer-events-none select-none`} items-center flex-wrap`}>
                        <h1 className={'min-w-40'}>Maximum Distance</h1>

                        <div className={'relative flex-1'}>
                            <button
                                type={'button'}
                                disabled={!locationSelected}
                                onClick={() => setShowDistanceDropdown(prev => !prev)}
                                className={'w-full text-left outline-none'}
                            >
                                Within {distance} miles
                            </button>
                            <span className={'absolute right-0 top-1/2 -translate-y-1/2 text-stone-500'}>▼</span>
                            {showDistanceDropdown && (
                                <ul className={'absolute left-0 top-full mt-1 w-full bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'}>
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

                            <LocationTypeahead user={user} setState={setStateFilter} setCity={setCityFilter} statePlaceholder={null} cityPlaceholder={null}/>
                        </div>
                    </div>

                    <div>
                        <button
                            type={'submit'}
                            className={styles.formInput}
                        >
                            Save Changes
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}