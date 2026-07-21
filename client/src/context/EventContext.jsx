import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {useAuth} from "./AuthContext.jsx";

import * as eventServices from "../services/eventServices.js";
import {useSearchParams} from "react-router-dom";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
    const { user } = useAuth();

    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const userUUID = user?.public_id;
    const feedPage = Number(searchParams.get("page")) || 1;

    const {
        data: eventData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["events", feedPage],
        queryFn: () => eventServices.getEvents(feedPage),
        enabled: !!userUUID
    });

    const totalPages = eventData?.totalPages ?? 0;

    /*
    * Retrieve every event registration belonging to the authenticated user.
    Including the user's public ID in the query key keeps registration
    data separated when a different user signs in.
     */

    const {
        data: registrationData,
        isLoading: registrationsLoading,
        isError: registrationsIsError,
        error: registrationsError
    } = useQuery({
        queryKey: ["eventRegistrations", userUUID],
        queryFn: () => eventServices.getEventRegistrations(),
        enabled: !!userUUID
    });

    const registrations = registrationData?.registrations ?? [];

    /*
    * Send a new registration to the backend.
    After signup succeeds, mark the registration query as stale. React Query
    then requests the updated registration list, which automatically updates
    ManageEvents through this Context.
    */

    const signupMutation = useMutation({
        mutationFn: ({eventId, occurrence}) => eventServices.registerForEvent({eventId, occurrence}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["eventRegistrations", userUUID]
            });

            queryClient.invalidateQueries({
                queryKey: ["userRegistrations"]
            });
        }
    });

    const unregisterMutation = useMutation({
        mutationFn: ({eventId, occurrence}) => eventServices.unregisterForEvent({eventId, occurrence}),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["eventRegistrations", userUUID]
            });

            queryClient.invalidateQueries({
                queryKey: ["userRegistrations"]
            });
        }
    });

    return (
        <EventsContext.Provider
            value={{
                eventData,
                feedPage,
                totalPages,
                isLoading,
                isError,
                error,

                registrations,
                registrationsLoading,
                registrationsIsError,
                registrationsError,

                signup: signupMutation.mutateAsync,
                unregister: unregisterMutation.mutateAsync,
                signupLoading: signupMutation.isPending,
                signupError: signupMutation.error
            }}
        >
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    return useContext(EventsContext);
}