import {createContext, useContext, useState} from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {useAuth} from "./AuthContext.jsx";

import * as eventServices from "../services/eventServices.js";
import {useSearchParams} from "react-router-dom";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
    const { user } = useAuth();

    const [searchParams] = useSearchParams();

    const feedPage = Number(searchParams.get("page")) || 1;

    const userUUID = user?.public_id;

    const {
        data: eventData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["events", feedPage, userUUID],
        queryFn: () => eventServices.getEvents(feedPage, userUUID),
        enabled: !!userUUID
    });

    const totalPages = eventData?.totalPages ?? 0;

    return <EventsContext.Provider
            value={{
                eventData,
                feedPage,
                totalPages,
                isLoading,
                isError,
                error
            }}
        >
            {children}
        </EventsContext.Provider>
}

export function useEvents() {
    return useContext(EventsContext);
}