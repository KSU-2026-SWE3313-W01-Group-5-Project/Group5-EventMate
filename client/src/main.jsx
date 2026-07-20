import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./context/AuthContext.jsx";
import {EventsProvider} from "./context/EventContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <EventsProvider>
                        <App/>
                    </EventsProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);