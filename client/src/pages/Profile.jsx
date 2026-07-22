/**
 * Profile Page
 *
 * This page is not fully completed yet, but it does render the ProfileHeader information correctly so far.
 * We are planning on adding a bottom section to user's profiles that has a list of all events they have attended.
 *
 * I guess we will also add a connect button once we work on the connections system, maybe a message button if you are
 * connected with them, and maybe some more information in the header to display how many connections/events/whatever else
 * they have.
 *
 * The one different thing about how user information is obtained on this page, we use the getUserProfile function instead of just
 * getUser because we only want this page to have access to the public profile data. If we used getUser, the profile page would also
 * have access to each user's more sensitive data, which could be exploited by anyone that visits this page.
 */

import Navbar from "../components/Navbar.jsx";
import {useSearchParams} from "react-router-dom";
import {getUserProfile} from "../services/userServices.js";
import {useQuery} from "@tanstack/react-query";
import ProfileHeader from "../components/profile_components/ProfileHeader.jsx";
import LoadingPage from "../components/LoadingPage.jsx";
import Modal from "../components/Modal.jsx";
import MessagingModal from "./modals/MessagingModal.jsx";

export default function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();
    const displayedUserUUID = searchParams.get("user");

    const modal = searchParams.get("modal");
    const isOpen = modal === "messaging";

    const {
        data: displayedUser,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["userProfile", displayedUserUUID],
        queryFn: () => getUserProfile(displayedUserUUID),
        enabled: !!displayedUserUUID,
    });

    const closeModal = () => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete("modal");
            params.delete("conversation");
            return params;
        });
    };

    return (
        <>
            {isLoading && <LoadingPage />}

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

            <Modal isOpen={isOpen} onClose={closeModal}>
                <MessagingModal className={isOpen ? "" : "hidden"} />
            </Modal>
        </>
    )
}