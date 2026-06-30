import {useState} from "react";
import LocationTypeahead from "../../components/LocationTypeahead.jsx";

export default function SettingsProfile() {
    const [selected, setSelected] = useState([]);

    const toggleInterest = (interest) => {
        setSelected(prev =>
        prev.includes(interest) ? prev.filter(i => i !== interest)
        : [...prev, interest]);
    }

    const styles = {
        formInput: `flex px-4 py-3 gap-x-6 gap-y-2 rounded-md border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
        transition-colors duration-300`,
    }

    const interests = ["Music", "Coding", "Gaming"]

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
                    <form className={`flex flex-col gap-4 min-w-1/2`}>
                        <span
                            className={ styles.formInput }
                        >
                            <h1>Change Username</h1>
                            <input
                                className={"focus:outline-none flex-1"}
                                placeholder={"Username"}
                            />
                        </span>

                        <span
                            className={ styles.formInput }
                        >
                            <h1>Change Bio</h1>
                            <textarea
                                className={"focus:outline-none flex-1"}
                                placeholder={"Bio"}
                            />
                        </span>

                        <span
                            className={ styles.formInput + `flex items-center` }
                        >
                            <h1>Set Interests</h1>
                            <div className={`flex flex-wrap gap-2`}>
                                {interests.map(interest => {
                                    const isSelected = selected.includes(interest);

                                    return (
                                        <button
                                            key={interest}
                                            type={'button'}
                                            onClick={() => toggleInterest(interest)}
                                            className={`
                                                px-4 py-2 rounded-lg
                                                ${isSelected ? `bg-stone-800 dark:bg-zinc-900/80
                                                hover:bg-stone-700 dark:hover:bg-stone/500
                                                text-stone-50 font-medium
                                                transition-color` : `bg-stone-800/50 dark:bg-zinc-600/70
                                                hover:bg-stone-700 dark:hover:bg-stone/500
                                                text-stone-50 font-medium
                                                transition-color`
                                                }
                                            `}
                                        >
                                            {interest}
                                        </button>
                                    )
                                })}
                            </div>
                        </span>

                        <LocationTypeahead />
                    </form>
                    <section className={`w-12 h-12 bg-blue-500 rounded-full flex justify-center`}>

                    </section>
                </div>

            </div>
        </>
    )
}