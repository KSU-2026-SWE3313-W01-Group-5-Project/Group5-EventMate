import getUserProfilePicture from "../../utils/getUserProfilePicture.js";

export default function ProfileHeader({ displayedUser }) {
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
            <img
                src={getUserProfilePicture(displayedUser.profile_picture_url)}
                alt="Profile Image"
                className={`rounded-full border-2 bg-zinc-700/10 dark:bg-zinc-700/50 border-stone-200 dark:border-zinc-800/50 shadow-lg`}
            />
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
                <div className={`flex flex-col gap-0.5`}>
                    <h1 className={`text-lg font-bold`}>{displayedUser.username}</h1>
                    <h1 className={`text-sm`}>{displayedUser.username}</h1>
                    <h1 className={`text-sm`}>{displayedUser.city}, {displayedUser.state}</h1>
                    <h1 className={`text-sm`}>Interests: {displayedUser.interests.join(", ")}</h1>
                </div>
                <text>{displayedUser.bio}</text>
            </div>
        </div>
    )
}