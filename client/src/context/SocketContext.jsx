import {createContext, useContext, useEffect} from 'react';
import {io} from "socket.io-client";
import {useAuth} from "./AuthContext.jsx";

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
        if (user) {
            socket.connect();
        } else {
            socket.disconnect();
        }

        return () => {
            socket.disconnect();
        };
    }, [user]);


    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);