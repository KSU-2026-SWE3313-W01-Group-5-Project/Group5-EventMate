import Navbar from "../components/Navbar.jsx";
import {useSearchParams} from "react-router-dom";
import {getUserProfile} from "../services/userServices.js";
import {useQuery} from "@tanstack/react-query";
import getUserProfilePicture from "../utils/getUserProfilePicture.js";

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
            <Navbar />

            {isLoading && <p>Loading...</p>}

            {isError && <p>Failed to load profile.</p>}

            {displayedUser && (
                <div className="text-black font-bold text-5xl">
                    <p>{displayedUser.username}</p>
                    <img className={"bg-black"} src={getUserProfilePicture(displayedUser.profile_picture_url)} />
                    <p>{displayedUser.bio}</p>
                </div>
            )}
        </>
    )
}