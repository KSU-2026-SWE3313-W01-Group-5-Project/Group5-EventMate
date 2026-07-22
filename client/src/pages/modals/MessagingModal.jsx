import {useSearchParams} from "react-router-dom";
import getUserProfilePicture from "../../utils/getUserProfilePicture.js";
import {useEffect, useState} from "react";
import {getUserProfile} from "../../services/userServices.js";
import LoadingPage from "../../components/LoadingPage.jsx";
import {useQuery} from "@tanstack/react-query";
import {getConversationWithDetails} from "../../services/conversationServices.js";
import {useSocket} from "../../context/SocketContext.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

import { FiSend } from "react-icons/fi";

export default function MessagingModal({ onRequestClose }) {
    const {socket} = useSocket();
    const {user} = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();
    const conversationID = searchParams.get("conversation");

    const {
        data: conversationData,
    } = useQuery({
        queryKey: ["conversation", conversationID],
        queryFn: () => getConversationWithDetails(conversationID),
        enabled: !!conversationID,
    });

    const [connectionProfile, setConnectionProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!conversationData) return;

        if (conversationData.message === "CONVERSATION_DATA") {
            async function fetchUser() {
                const user = await getUserProfile(conversationData?.data?.connectionUUID);

                setConnectionProfile(user);

                setMessages(conversationData?.data?.messages ?? []);
            }

            fetchUser();
        }
    }, [conversationData]);

    useEffect(() => {
        if (!conversationID) return;

        socket.emit("join_conversation", conversationID);

        function handleNewMessage(newMessage) {
            setMessages((prevMessages) => [
                ...prevMessages,
                newMessage
            ]);
        }

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.emit(
                "leave_conversation",
                conversationID
            );

            socket.off(
                "new_message",
                handleNewMessage
            );
        };
    }, [socket]);

    useEffect(() => {
    }, [messages]);

    function handleSendMessage(e) {
        e.preventDefault();

        if (!message.trim()) return;

        socket.emit("send_message", {
            conversationID,
            content: message,
        });

        setMessage("");
    }

    if (!connectionProfile) return <LoadingPage />

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
            <div className={`flex w-full gap-5 items-center bg-stone-300/50 dark:bg-zinc-800/50 text-stone-800 dark:text-white m-0 rounded-tl-xl rounded-tr-xl h-1/8`}>
                <img
                    src={getUserProfilePicture(connectionProfile.profile_picture_url)}
                    className={`h-14 ml-5 rounded-full bg-zinc-700/10 dark:bg-zinc-700/50 shadow-lg`}
                    alt="Profile Image"
                />

                <div>
                    <h3 className="text-xl font-semibold">{connectionProfile.username}</h3>
                    <p className={`text-sm text-stone-500 dark:text-zinc-200 `}>{connectionProfile.firstname} {conversationID.lastname}</p>
                </div>
            </div>

            <div
                className={`
                    flex flex-col-reverse
                    flex-1 p-5
                    overflow-y-auto
                    scrollbar scrollbar-thin
                    scrollbar-thumb-zinc-500
                    scrollbar-track-transparent`}
                >
                <ul>
                    {messages.map((message, index, array) => {
                        const previousMessage = array[index - 1];

                        const sentByReceiver = message.sender_id === connectionProfile.public_id

                        if (index === 0) {
                            return (
                                <li
                                    key={message.id}
                                    className={`flex w-full ${sentByReceiver ? "justify-start" : "justify-end"} `}
                                >
                                    <div className={`flex gap-3 max-w-[45%]`}>
                                        <div className={`w-10`}>
                                            <img
                                                className={`rounded-full mt-1`}
                                                src={getUserProfilePicture(connectionProfile.profile_picture_url)}
                                                hidden={!sentByReceiver}
                                                alt={`Users Image`}
                                            />
                                        </div>
                                        <p className={`
                                            mt-1
                                            text-white px-4 py-2 
                                            break-all
                                            max-w-[90%]
                                            ${sentByReceiver ? `mr-auto bg-zinc-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl` 
                                            : `bg-zinc-300 ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-zinc-900`}`}>
                                            {message.content}
                                        </p>
                                    </div>
                                </li>
                            )
                        }

                        return (
                            <li
                                key={message.id}
                                className={`flex w-full ${sentByReceiver ? "justify-start" : "justify-end"} `}
                            >
                                <div className={`flex gap-3 max-w-[45%]`}>
                                    <div className={`w-10`}>
                                        <img
                                            className={`rounded-full mt-1`}
                                            src={getUserProfilePicture(connectionProfile.profile_picture_url)}
                                            hidden={previousMessage.sender_id === message.sender_id || !sentByReceiver}
                                            alt={`Users Image`}
                                        />
                                    </div>
                                    <p className={`
                                        mt-1
                                        text-white px-4 py-2 
                                        break-all
                                        max-w-[85%]
                                        ${sentByReceiver ? `mr-auto bg-zinc-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl`
                                        : `bg-zinc-300 ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl text-zinc-900`}`}>
                                        {message.content}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="flex flex-1 min-h-0 max-h-1/10 rounded-br-xl rounded-bl-xl">
                <form className={`flex mt-auto mb-4 ml-4 mr-4 w-full`} onSubmit={handleSendMessage}>
                    <div
                        className={`
                            flex flex-wrap flex-1
                            px-4 py-3 
                            gap-x-6 gap-y-2 
                            rounded-xl 
                            border border-stone-300 bg-white 
                            text-stone-700 placeholder:text-stone-400 
                            focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-700 
                            transition-colors duration-300
                    `}>
                        <input
                            value={message}
                            placeholder={"Message"}
                            className={"focus:outline-none flex-1"}
                            onChange={(e) => setMessage(e.target.value)} />
                        <button
                            className={`ml-auto`}
                            type={`submit`}
                        >
                            <FiSend className={`size-6 hover:opacity-70 transition-opacity duration-300`}>
                                Send
                            </FiSend>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}