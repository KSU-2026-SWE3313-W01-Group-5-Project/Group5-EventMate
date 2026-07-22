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
        queryKey: ["connections", user?.public_id],
        queryFn: connectionServices.getConnections,
        enabled: !!user,
        refetchOnWindowFocus: true,
        refetchInterval: user ? 3000 : false,
    });

    const connectionMutation = useMutation({
        mutationFn: (userUUID) => connectionServices.createConnection(userUUID),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["connections"],
            });
        }
    });

    const removeConnectionMutation = useMutation({
        mutationFn: (userUUID) => connectionServices.removeConnection(userUUID),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["connections"],
            });
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
                removeConnection: removeConnectionMutation.mutateAsync,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
}

export function useConnection() {
    return useContext(ConnectionContext);
}