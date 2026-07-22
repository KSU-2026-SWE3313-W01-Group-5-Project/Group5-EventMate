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
import {useEffect, useState} from "react";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";
import {useConnection} from "../../context/ConnectionContext.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useNotifications} from "../../context/NotificationContext.jsx";
import {useSearchParams} from "react-router-dom";

export default function ProfileHeader({ displayedUser }) {
    const {user} = useAuth();
    const {connectionsData, isLoading, connect, removeConnection} = useConnection();
    const {addNotification} = useNotifications();

    const [searchParams, setSearchParams] = useSearchParams();

    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (!connectionsData || connectionsData.message === "NO_CONNECTIONS_FOUND") {
            setConnection(null);
        }

        const connections = connectionsData?.data ?? [];

        const matchingConnection = connections.find(
            (conn) =>
                (conn.sender_id === user?.public_id && conn.receiver_id === displayedUser.public_id) ||
                (conn.sender_id === displayedUser.public_id && conn.receiver_id === user?.public_id)
        );

        setConnection(matchingConnection ?? null);
    }, [connectionsData, displayedUser.public_id]);

    const isConnected =
        connection?.status === "CONNECTED";

    const hasSentRequest =
        connection?.sender_id === user?.public_id &&
        connection?.receiver_id === displayedUser.public_id &&
        connection?.status === "PENDING";

    const hasReceivedRequest =
        connection?.sender_id === displayedUser.public_id &&
        connection?.receiver_id === user?.public_id &&
        connection?.status === "PENDING";

    if (isLoading) return <LoadingPage />

    // Pre-formatted values for the profile display header.
    // We add these checks to make sure that the profile does not render missing information
    // or half formed strings if the user has not setup their profile yet

    const formattedName = `${displayedUser.firstname} ${displayedUser.lastname}`;

    const formattedLocation =
        displayedUser.city && displayedUser.state
            ? `${displayedUser.city}, ${displayedUser.state}`
            : displayedUser.city || displayedUser.state || "";

    const formattedInterests =
        displayedUser.interests.length > 0
            ? `Interests: ${displayedUser.interests.join(", ")}`
            : "";

    const handleConnect = async () => {
        try {
            const response = await connect(displayedUser.public_id);

            if (response.message === 'CONNECTION_REQUEST_SENT') {
                addNotification({
                    kind: 'success',
                    title: 'Connection Request Sent',
                    subtitle: `Your connection request to ${displayedUser.username} has been sent!`,
                    timeout: 5000
                });
            }

            if (response.message === 'CONNECTION_MADE') {
                addNotification({
                    kind: 'success',
                    title: 'Connection Accepted',
                    subtitle: `${displayedUser.username} is now a connection!`,
                    timeout: 5000
                });
            }

            console.log("response:", response);
        } catch (err) {
            console.error(err);
        }
    }

    const handleRemoveConnection = async () => {
        try {
            const response = await removeConnection(displayedUser.public_id);

            if (response.message === 'CONNECTION_REMOVED') {
                addNotification({
                    kind: 'success',
                    title: 'Connection Removed',
                    subtitle: `${displayedUser.username} is no longer a connection.`,
                    timeout: 5000
                });
            }

            console.log("response:", response);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={`flex flex-col
        md:flex-row
        text-stone-700 dark:text-white
        bg-stone-100 dark:bg-zinc-700/50 dark:border-zinc-800/50
        border-2 border-stone-200 
        shadow-lg
        h-[33vh] max-h-[33vh] min-h-0 rounded-xl 
        m-4 p-6
        gap-6
        transition-colors duration-300`}>

            {/* User profile picture */}
            <div className="flex items-center shrink-0">
                <img
                    src={getUserProfilePicture(displayedUser.profile_picture_url)}
                    alt="Profile Image"
                    className={`w-52 h-52 shrink-0 object-cover rounded-full border-2 bg-zinc-700/10 dark:bg-zinc-700/50 border-stone-200 dark:border-zinc-800/50 shadow-lg`}
                />
            </div>

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

                <div className={`flex flex-col gap-0.5`}>
                    <h1 className={`text-lg font-bold`}>{displayedUser.username}</h1>
                    <h1 className={`text-sm`}>{formattedName}</h1>
                    <h1 className={`text-sm`}>{formattedLocation}</h1>
                    <h1 className={`text-sm`}>{formattedInterests}</h1>
                </div>

                <p>{displayedUser.bio}</p>

                <div hidden={displayedUser.public_id === user.public_id} className={`flex flex-wrap shrink-0 gap-3 mt-auto`}>
                    {isConnected ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSearchParams((prevParams) => {
                                        const params = new URLSearchParams(prevParams);
                                        params.set("modal", "messaging");
                                        params.set("conversation", connection.conversation_id);

                                        return params;
                                    })}}
                                className={`px-4 py-3 rounded-md bg-zinc-500 hover:bg-zinc-600 text-white/75 text-sm border border-zinc-400`}
                            >
                                Message
                            </button>

                            <button
                                className={`ml-auto px-4 py-3 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 whitespace-nowrap text-red-700 text-sm`}
                                onClick={handleRemoveConnection}
                                type="button"
                            >
                                Remove Connection
                            </button>
                        </>
                    ) : hasSentRequest ? (
                        <button
                            disabled={true}
                            className={`ml-auto whitespace-nowrap opacity-50 cursor-not-allowed px-4 py-3 rounded-md border bg-green-50 text-green-700 text-sm`}
                        >
                            Connection Pending
                        </button>
                    ) : hasReceivedRequest ? (
                        <button
                            className={`ml-auto px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm`}
                            onClick={handleConnect}
                        >
                            Accept Connection
                        </button>
                    ) : (
                        <button
                            className={`ml-auto px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm`}
                            onClick={handleConnect}
                        >
                            Send Connection
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}