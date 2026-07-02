import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as authService from "../services/authServices.js"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: authService.getCurrentUser,

        retry: false,
    })

    const user = query.data ?? null;
    const isLoading = query.isLoading;
    const isAuthenticated = !!query.data;

    const loginMutation = useMutation({
        mutationFn: authService.login,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,

        onSuccess: (data) => {
            queryClient.clear();
        }
    });

    const updateMutation = useMutation({
        mutationFn: (userSettings) => authService.updateUser(userSettings),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            })
        }
    });

    return <AuthContext.Provider
        value={{
            user,
            isAuthenticated,
            isLoading,

            login: loginMutation.mutateAsync,
            isLoggingIn: loginMutation.isPending,

            updateUser: updateMutation.mutateAsync,

            logout: logoutMutation.mutateAsync,
        }}
    >
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}