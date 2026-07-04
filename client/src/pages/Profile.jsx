import Navbar from "../components/Navbar.jsx";
import {useSearchParams} from "react-router-dom";
import {getUserProfile} from "../services/userServices.js";
import {useQuery} from "@tanstack/react-query";
import getUserProfilePicture from "../utils/getUserProfilePicture.js";
import ProfileHeader from "../components/profile_components/ProfileHeader.jsx";

export default function Profile() {
    const [searchParams] = useSearchParams();
    const displayedUserUUID = searchParams.get("user");

    const {
        data: displayedUser,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["userProfile", displayedUserUUID],
        queryFn: () => getUserProfile(displayedUserUUID),
        enabled: !!displayedUserUUID,
    });

    return (
        <>
            {isLoading && <p>Loading...</p>}

            {isError && <p>Failed to load profile.</p>}

            {displayedUser && (
                <div className={`flex min-h-screen flex-col bg-stone-50 dark:bg-zinc-900 transition-colors duration-300`}>
                    <Navbar />

                    <main className={"flex max-w-4xl w-full mx-auto flex-1"}>
                        <section className={`
                        flex
                        flex-col
                        flex-1
                        text-stone-800 dark:text-white
                        bg-stone-300/50 dark:bg-zinc-800 dark:border-zinc-800
                        border-2 border-stone-200 
                        shadow-lg 
                        rounded-xl 
                        
                        m-4 p-6
                        transition-colors duration-300
                        `}>
                            <ProfileHeader displayedUser={displayedUser} />
                        </section>
                    </main>
                </div>
            )}
        </>
    )
}