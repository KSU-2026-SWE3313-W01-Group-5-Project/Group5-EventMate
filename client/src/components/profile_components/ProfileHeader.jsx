/**
 * ProfileHeader Component
 *
 * Displays the selected user's profile information, including:
 * their profile picture
 * username
 * full name
 * location (city, state)
 * interests (if set)
 * and bio
 *
 * @param {Object} props.displayedUser - the user object obtained from the backend with their public
 * id to display. this object only has the information that we have defined as safe for public viewing
 */

import getUserProfilePicture from "../../utils/getUserProfilePicture.js";

export default function ProfileHeader({ displayedUser }) {

    // Pre-formatted values for the profile display header.
    // We add these checks to make sure that the profile does not render missing information
    // or half formed strings if the user has not setup their profile yet

    // Combines first and last name into one string
    const formattedName = `${displayedUser.firstname} ${displayedUser.lastname}`;

    // Displays city and state if available, falls back to either value or nothing if only 1 or neither value exists
    const formattedLocation =
        displayedUser.city && displayedUser.state
            ? `${displayedUser.city}, ${displayedUser.state}`
            : displayedUser.city || displayedUser.state || "";

    // Converts the interest array into a comma separated list if it exists
    const formattedInterests =
        displayedUser.interests.length > 0
            ? `Interests: ${displayedUser.interests.join(", ")}`
            : "";

    return (
        <div className={`flex
        text-stone-700 dark:text-white
        bg-stone-100 dark:bg-zinc-700/50 dark:border-zinc-800/50
        border-2 border-stone-200 
        shadow-lg
        min-h-1/3 max-h-1/3 rounded-xl 
        m-4 p-6
        gap-6
        transition-colors duration-300`}>

            {/* User profile picture */}
            <img
                src={getUserProfilePicture(displayedUser.profile_picture_url)}
                alt="Profile Image"
                className={`rounded-full border-2 bg-zinc-700/10 dark:bg-zinc-700/50 border-stone-200 dark:border-zinc-800/50 shadow-lg`}
            />

            {/* Profile information card */}
            <div className={`
            flex-1
            text-stone-700 dark:text-white
            bg-stone-100 dark:bg-zinc-700/50 dark:border-zinc-800/50
            border-2 border-stone-200 
            shadow-lg
            rounded-xl
            p-5
            flex
            flex-col
            gap-5
            `}>

                {/* User basic information/identity */}
                <div className={`flex flex-col gap-0.5`}>
                    <h1 className={`text-lg font-bold`}>{displayedUser.username}</h1>
                    <h1 className={`text-sm`}>{formattedName}</h1>
                    <h1 className={`text-sm`}>{formattedLocation}</h1>
                    <h1 className={`text-sm`}>{formattedInterests}</h1>
                </div>

                {/* User bio */}
                <p>{displayedUser.bio}</p>
            </div>
        </div>
    )
}