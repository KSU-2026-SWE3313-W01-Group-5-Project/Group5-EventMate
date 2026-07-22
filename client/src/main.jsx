import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./context/AuthContext.jsx";
import {EventsProvider} from "./context/EventContext.jsx";
import {NotificationProvider} from "./context/NotificationContext.jsx";
import {ConnectionProvider} from "./context/ConnectionContext.jsx";
import {SocketProvider} from "./context/SocketContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ConnectionProvider>
                        <NotificationProvider>
                            <SocketProvider>
                                <EventsProvider>
                                    <App/>
                                </EventsProvider>
                            </SocketProvider>
                        </NotificationProvider>
                    </ConnectionProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);