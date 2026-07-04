import {useEffect, useState, useRef} from "react";
import LocationTypeahead from "../../components/settings_components/LocationTypeahead.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

import ProfileImageUpload from "../../components/settings_components/ProfileImageUpload.jsx";
import {getUserProfile} from "../../services/userServices.js";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";

const availableInterests = ["Music", "Coding", "Gaming"]

export default function SettingsProfile() {
    const {user, updateUser} = useAuth();

    const [selected, setSelected] = useState([]);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [interests, setInterests] = useState([]);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);

    const toggleInterest = (availableInterest) => {
        setSelected(prev =>
            prev.includes(availableInterest) ? prev.filter(i => i !== availableInterest)
                : [...prev, availableInterest]);
    }

    useEffect(() => {
        setSelected(user.interests);
        setProfileImagePreview(getUserProfilePicture(user.profile_picture_url));
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

        const formData = new FormData();

        if (username.trim()) formData.append("username", username)
        if (bio.trim()) formData.append("bio", bio)
        if (city.trim()) formData.append("city", city)
        if (state.trim()) formData.append("state", state.trim())
        if (profileImageFile) {
            formData.append("profileImage", profileImageFile)
        }

        formData.append("interests", JSON.stringify(interests));

        try {
            await updateUser(formData);
        } catch (error) {
            console.error("Error updating user profile:", error);
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
                        <div
                            className={styles.formInput}
                        >
                            <h1>Change Username</h1>
                            <input
                                className={"focus:outline-none flex-1"}
                                placeholder={user.username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div
                            className={styles.formInput}
                        >
                            <h1>Change Bio</h1>
                            <textarea
                                className={"focus:outline-none flex-1"}
                                placeholder={user.bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>

                        <div
                            className={styles.formInput + `flex items-center`}
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
                        </div>

                        <LocationTypeahead user={user} setState={setState} setCity={setCity}/>

                        <div className={`justify-start`}>
                            <button
                                key={`submit`}
                                type={`submit`}
                                className={styles.formInput}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <ProfileImageUpload
                        profileImagePreview={profileImagePreview}
                        setProfileImagePreview={setProfileImagePreview}
                        setProfileImageFile={setProfileImageFile}
                    />

                </div>

            </div>
        </>
    )
}