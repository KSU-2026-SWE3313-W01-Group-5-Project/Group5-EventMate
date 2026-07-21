import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as connectionServices from '../services/connectionServices.js'

import {useAuth} from "./AuthContext.jsx";

const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {
    const {user} = useAuth();

    const queryClient = useQueryClient();

    const {
        data: connections,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["connections"],
        queryFn: () => connectionServices.getConnections(),
        enabled: !!user
    });

    const connectionMutation = useMutation({
        mutationFn: (userUUID) => connectionServices.createConnection(userUUID),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["connections"],
            })
        }
    })

    return (
        <ConnectionContext.Provider
            value={{
                connectionsData: connections,
                isLoading,
                isError,
                error,

                connect: connectionMutation.mutateAsync,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext);
}