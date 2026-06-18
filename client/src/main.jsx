import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

/*
    MAIN ENTRY POINT OF THE REACT APP

    This file:
    - Mounts the React app into the DOM (#root in index.html)
    - Wraps the app with global providers:
        - BrowserRouter → enables routing (pages/navigation)
        - React Query → handles server state (API caching, fetching)
*/

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
