import {useEffect, useState} from "react";
import LocationTypeahead from "../../components/LocationTypeahead.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const availableInterests = ["Music", "Coding", "Gaming"]

export default function SettingsProfile() {
    const { user, updateUser } = useAuth();

    const [selected, setSelected] = useState([]);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const toggleInterest = (availableInterest) => {
        setSelected(prev =>
        prev.includes(availableInterest) ? prev.filter(i => i !== availableInterest)
        : [...prev, availableInterest]);
    }

    useEffect(() => {
        setSelected(user.interests);
    }, [])

    useEffect(() => {
        setInterests(selected);
    }, [selected]);

    const styles = {
        formInput: `flex px-4 py-3 gap-x-6 gap-y-2 rounded-md border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
        transition-colors duration-300`,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const settings = {
            username: username,
            bio: bio,
            interests: interests,
            state: state,
            city: city,
        }

        const cleanSettings = Object.fromEntries(
            Object.entries(settings).filter(([key, value]) => {
                if (typeof value === "string") return value.trim() !== "";
                if (Array.isArray(value)) return value.length > 0;
                return true;
            })
        )

        try {
            await updateUser(cleanSettings);
        } catch (err) {
            console.error("Error updating user settings:", err);
        }
    }

    return (
        <>
            <div className={`max-w-full h-full flex flex-col gap-5`}>
                <h1 className={`
                    text-xl font-semibold
                    text-stone-700 dark:text-white
                    `}>
                    Profile
                </h1>

                <div className={`flex`}>
                    <form onSubmit={handleSubmit} className={`flex flex-col m-5 p-5 gap-15 min-w-1/2`}>
                        <span
                            className={ styles.formInput }
                        >
                            <h1>Change Username</h1>
                            <input
                                className={"focus:outline-none flex-1"}
                                placeholder={user.username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </span>

                        <span
                            className={ styles.formInput }
                        >
                            <h1>Change Bio</h1>
                            <textarea
                                className={"focus:outline-none flex-1"}
                                placeholder={user.bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </span>

                        <span
                            className={ styles.formInput + `flex items-center` }
                        >
                            <h1>Set Interests</h1>
                            <div className={`flex flex-wrap gap-2`}>
                                {availableInterests.map(availableInterest => {
                                    const isSelected = selected.includes(availableInterest);

                                    return (
                                        <button
                                            key={availableInterest}
                                            type={'button'}
                                            onClick={() => toggleInterest(availableInterest)}
                                            className={`
                                                px-4 py-2 rounded-lg
                                                ${isSelected ? `bg-zinc-900/80 dark:bg-zinc-900/80
                                                hover:bg-stone-700 dark:hover:bg-stone/500
                                                text-stone-50 font-medium
                                                transition-color` : `bg-stone-800/50 dark:bg-zinc-600/70
                                                hover:bg-stone-700 dark:hover:bg-stone/500
                                                text-stone-50 font-medium
                                                transition-color`
                                                }
                                            `}
                                        >
                                            {availableInterest}
                                        </button>
                                    )
                                })}
                            </div>
                        </span>

                        <LocationTypeahead user={user} setState={setState} setCity={setCity} />

                        <span className={`justify-start`}>
                            <button
                                key={`submit`}
                                type={`submit`}
                                className={styles.formInput}
                            >
                                Save Changes
                            </button>
                        </span>
                    </form>
                    <section className={`w-12 h-12 bg-blue-500 rounded-full flex justify-center`}>

                    </section>
                </div>

            </div>
        </>
    )
}