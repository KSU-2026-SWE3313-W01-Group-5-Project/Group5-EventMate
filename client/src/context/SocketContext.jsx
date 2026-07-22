import {createContext, useContext, useEffect} from 'react';
import {io} from "socket.io-client";
import {useAuth} from "./AuthContext.jsx";
import {useNotifications} from "./NotificationContext.jsx";
import {useSearchParams} from "react-router-dom";

const SocketContext = createContext(null);

const socket = io(
    import.meta.env.VITE_API_URL,
    {
        withCredentials: true,
        autoConnect: false
    }
);

export const SocketProvider = ({ children }) => {
    const {user} = useAuth();

    useEffect(() => {
        function handleConnect() {
            console.log("Socket connected:", socket.id);
        }

        function handleConnectError(error) {
            console.error(
                "Socket connection failed:",
                error.message
            );
        }

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);

        if (user) {
            socket.connect();
        } else {
            socket.disconnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.disconnect();
        };
    }, [user]);

    const {addNotification} = useNotifications();
    const [searchParams, setSearchParams] = useSearchParams();

    const conversationID = searchParams.get("conversation");

    useEffect(() => {
        function handleNewMessage(newMessage) {
            console.log("SocketContext received:", newMessage);

            const isCurrentConversation = conversationID && String(conversationID) === String(newMessage.conversation_id);

            if (isCurrentConversation) {
                return;
            }

            const preview = newMessage.content.length > 100
                ? `${newMessage.content.slice(0, 100)}...` : newMessage.content;

            const handleOpenConversation = (e) => {
                e.stopPropagation();

                setSearchParams((prevParams) => {
                    const params = new URLSearchParams(prevParams);
                    params.set("modal", "messaging");
                    params.set("conversation", conversationID);

                    return params;
                });
            }

            addNotification({
                kind: "info",
                title: newMessage.username,
                subtitle: preview,
                timeout: 5000,
                actionLabel: "Read Message",
                onActionClick: handleOpenConversation
            });
        }

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [conversationID, addNotification]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);