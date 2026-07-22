import {useSearchParams} from "react-router-dom";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";
import {useEffect, useState} from "react";
import {getUserProfile} from "../../services/userServices.js";
import LoadingPage from "../../components/LoadingPage.jsx";

export default function MessagingModal({ onRequestClose }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversationID = searchParams.get("conversation");

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const user = await getUserProfile(userUUID);

            setUser(user);
        }

        fetchUser();
    }, [conversationID])

    if (!user) return <LoadingPage />

    return (
        <div
            className={`
                flex flex-col gap-6
                rounded-xl 
                border border-stone-200 
                bg-stone-50 dark:bg-zinc-900 dark:border-zinc-900 
                shadow-lg
                w-[65rem]
                h-[45rem]
                transition-colors duration-300
                `} onClick={(e) => e.stopPropagation()}
        >
            <div className={`flex w-full gap-5 items-center bg-stone-300/50 dark:bg-zinc-800 text-stone-800 dark:text-white m-0 rounded-tl-xl rounded-tr-xl h-1/6`}>
                <img
                    src={getUserProfilePicture(user.profile_picture_url)}
                    className={`h-20 ml-5 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50 shadow-lg`}
                    alt="Profile Image"
                />

                <div>
                    <h3 className="text-xl font-semibold">{user.username}</h3>
                    <p className={`text-sm text-stone-500 dark:text-zinc-200 `}>{user.firstname} {user.lastname}</p>
                </div>
            </div>

            <div
                className={`
                    flex flex-col 
                    h-3/5 p-5
                    scrollbar scrollbar-thin
                    scrollbar-thumb-zinc-500
                    scrollbar-track-transparent`}
                >
                Messages-History
            </div>

            <div className="flex flex-1 bg-stone-300 dark:bg-zinc-800 min-h-0 rounded-br-xl rounded-bl-xl">

            </div>
        </div>
    )
}