import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as authService from "../services/authServices.js"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: authService.getCurrentUser,

        retry: false,

        enabled: !!localStorage.getItem("token")
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,

        onSuccess: (data) => {
            localStorage.setItem("token", data.token);

            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
        }
    });

    const logout = () => {
        localStorage.removeItem("token");

        queryClient.setQueryData(["currentUser"], null);

        queryClient.removeQueries({
            queryKey: ["currentUser"]
        });
    }

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
            isAuthenticated: !!user,
            isLoading: isLoading,

            login: loginMutation.mutateAsync,
            isLoggingIn: loginMutation.isPending,

            updateUser: updateMutation.mutateAsync,

            logout
        }}
    >
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}