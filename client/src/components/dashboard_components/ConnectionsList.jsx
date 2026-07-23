import {useConnection} from "../../context/ConnectionContext.jsx";
import {useEffect, useState} from "react";
import LoadingPage from "../LoadingPage.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {getUserProfile} from "../../services/userServices.js";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";
import {useNavigate, useSearchParams} from "react-router-dom";

import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { FaRegMessage } from "react-icons/fa6";
import {useNotifications} from "../../context/NotificationContext.jsx";
import Modal from "../Modal.jsx";
import DeleteAccountModal from "../../pages/modals/DeleteAccountModal.jsx";
import MessagingModal from "../../pages/modals/MessagingModal.jsx";


export default function ConnectionsList() {
    const navigate = useNavigate();

    const {connectionsData, isLoading, connect, removeConnection} = useConnection();
    const {user} = useAuth();
    const {addNotification} = useNotifications();

    const [connectedUsersData, setConnectedUsersData] = useState([]);
    const [pendingUsersData, setPendingUsersData] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const modal = searchParams.get("modal");
    const isOpen = modal === "messaging";

    useEffect(() => {
        if (!connectionsData || !user?.public_id) {
            setConnectedUsersData([]);
            setPendingUsersData([]);
            return;
        }

        const connections = connectionsData.data ?? [];

        const connectedConnections = connections.filter((connection) =>
            connection.status === "CONNECTED" &&
            connection.sender_id !== user.public_id
        );

        const pendingConnections = connections.filter((connection) =>
            connection.status === "PENDING" &&
            connection.sender_id !== user.public_id
        );

        async function getUserProfiles() {
            const [connectedProfiles, pendingProfiles] = await Promise.all([
                Promise.all(
                    connectedConnections.map(async (connection) => {
                        const profile = await getUserProfile(connection.sender_id);

                        return {
                            profile,
                            conversationID: connection.conversation_id
                        };
                    })
                ),

                Promise.all(pendingConnections.map((connection) =>
                        getUserProfile(connection.sender_id)
                    )
                )
            ]);

            setConnectedUsersData(connectedProfiles);
            setPendingUsersData(pendingProfiles);
        }

        getUserProfiles();
    }, [connectionsData, user?.public_id]);

    if (isLoading) return <LoadingPage />

    const handleAcceptConnection = async (userUUID, username) => {
        try {
            const response = await connect(userUUID);

            if (response.message === 'CONNECTION_MADE') {
                addNotification({
                    kind: 'success',
                    title: 'Connection Accepted',
                    subtitle: `${username} is now a connection!`,
                    timeout: 5000
                });
            }

            console.log("response:", response);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDenyConnection = async (userUUID, username) => {
        try {
            const response = await removeConnection(userUUID);

            if (response.message === 'CONNECTION_REMOVED') {
                addNotification({
                    kind: 'success',
                    title: 'Connection Removed',
                    subtitle: `Denied connection from ${username}.`,
                    timeout: 5000
                });
            }

            console.log("response:", response);
        } catch (err) {
            console.error(err);
        }
    }

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
            <div className={`flex flex-1 flex-col
                min-h-0
                text-stone-800 dark:text-white
                bg-stone-100 dark:bg-zinc-800/70
                dark:border-zinc-800
                border-2 border-stone-200
                rounded-xl
                ml-2 mt-2 mr-4 mb-4
                p-6 h-3/5
                hover:bg-zinc-300/35
                hover:dark:bg-zinc-800
            `}>
                <h2 className="text-lg tracking-tight font-bold">
                    Connections List
                </h2>

                <div className={`flex flex-1 gap-3 mt-4 min-h-0`}>
                    <div className={`flex flex-1 flex-col gap-5 justify-center
                        rounded-lg
                        bg-white dark:bg-zinc-700
                        p-3
                        min-h-0
                        overflow-auto
                        font-semibold`}
                    >
                        <h3 className={`w-full text-center`}>Connections</h3>

                        <ul className={`flex-1 flex flex-col
                            min-h-0
                            gap-3
                            overflow-y-auto
                            scrollbar scrollbar-thin
                            scrollbar-thumb-zinc-800 scrollbar-track-transparent
                            dark:scrollbar-thumb-stone-100`}>
                            {connectedUsersData.map((conn) => (
                                <li
                                    onClick={() => navigate(`/profile/?user=${conn.profile.public_id}`)}
                                    key={conn.profile.public_id}
                                    className={`
                                    flex h-20 shrink-0 items-center gap-5
                                    rounded-lg
                                    bg-zinc-200 dark:bg-zinc-600
                                    p-3
                                    mr-2
                                    hover:bg-zinc-300/35
                                    hover:dark:bg-zinc-600/70
                                    text-stone-800 dark:text-white
                                    dark:border-zinc-800
                                    `}
                                        >
                                    <img
                                        src={getUserProfilePicture(conn.profile.profile_picture_url)}
                                        className={`h-15 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50 shadow-lg`}
                                        alt="Profile Image"
                                    />
                                    <div className={`flex flex-col gap-1`}>
                                        <h3 className="text-md font-semibold">{conn.profile.username}</h3>
                                        <p className={`text-xs text-stone-500 dark:text-zinc-200 `}>{conn.profile.firstname} {conn.profile.lastname}</p>
                                    </div>
                                    <button
                                        className={`ml-auto mr-5`}
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        setSearchParams((prevParams) => {
                                            const params = new URLSearchParams(prevParams);
                                            params.set("modal", "messaging");
                                            params.set("conversation", conn.conversationID);

                                            return params;
                                        })}}>
                                        <FaRegMessage className={`size-6`} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`flex flex-1 flex-col gap-5 justify-center
                        rounded-lg
                        bg-white dark:bg-zinc-700
                        p-3
                        min-h-0
                        font-semibold`}
                    >
                        <h3 className={`w-full text-center`}>Connection Requests</h3>

                        <ul className={`flex-1 flex flex-col
                            min-h-0
                            gap-3
                            overflow-y-auto
                            scrollbar scrollbar-thin
                            scrollbar-thumb-zinc-800 scrollbar-track-transparent
                            dark:scrollbar-thumb-stone-100`}>
                            {pendingUsersData.map((user) => (
                                <li
                                    onClick={() => navigate(`/profile/?user=${user.public_id}`)}
                                    key={user.public_id}
                                    className={`
                                    flex h-20 shrink-0 items-center gap-5
                                    rounded-lg
                                    bg-zinc-200 dark:bg-zinc-600
                                    p-3
                                    mr-2
                                    hover:bg-zinc-300/35
                                    hover:dark:bg-zinc-600/70
                                    text-stone-800 dark:text-white
                                    dark:border-zinc-800
                                    `}
                                >
                                    <img
                                        src={getUserProfilePicture(user.profile_picture_url)}
                                        className={`h-15 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50 shadow-lg`}
                                        alt="Profile Image"
                                    />
                                    <div className={`flex flex-col gap-1`}>
                                        <h3 className="text-md font-semibold">{user.username}</h3>
                                        <p className={`text-xs text-stone-500 dark:text-zinc-200 `}>{user.firstname} {user.lastname}</p>
                                    </div>
                                    <div className={`flex ml-auto mr-5 gap-3`}>
                                        <button onClick={(e) => {
                                            e.stopPropagation()
                                            handleAcceptConnection(user.public_id, user.username)}}>
                                            <FaCircleCheck className={`size-6 rounded-full border border-green-700 bg-green-700/90 hover:bg-green-600`} />
                                        </button>

                                        <button onClick={(e) => {
                                            e.stopPropagation()
                                            handleDenyConnection(user.public_id, user.username)}}>
                                            <FaCircleXmark className="size-6 rounded-full border border-red-300 bg-red-700/90 hover:bg-red-100/30" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal}>
                <MessagingModal className={isOpen ? "" : "hidden"} />
            </Modal>
        </>
    )
}