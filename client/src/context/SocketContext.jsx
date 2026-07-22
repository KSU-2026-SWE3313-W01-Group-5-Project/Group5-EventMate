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

    const {addNotification} = useNotifications();
    const [searchParams] = useSearchParams();

    const conversationID = searchParams.get("conversation");

    useEffect(() => {
        if (user) {
            socket.connect();
        } else {
            socket.disconnect();
        }

        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        function handleNewMessage(newMessage) {
            const isCurrentConversation = conversationID && String(conversationID) === String(newMessage.conversation_id);

            if (isCurrentConversation) {
                return;
            }

            const preview = newMessage.content.length > 100
                ? `${newMessage.content.slice(0, 100)}...` : newMessage.content;

            addNotification({
                kind: "info",
                title: "New Message",
                subtitle: preview,
                timeout: 5000,
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