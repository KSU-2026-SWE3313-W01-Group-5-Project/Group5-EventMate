/**
 * AuthContext
 *
 * Provides authentication state and authentication-related functions to every single component in this application by
 * using something called React Context.
 *
 * React Query is used to manage all authentication requests, cache the current user, and automatically refresh user
 * data after login or profile updates.
 *
 * For an analogy of AuthContext: this behaves like an employee badge system in a company,
 * when a user logs in, they are issued a "badge" (user session data) that
 * can be read by any part of the application. Individual components (pages)
 * do not need to repeatedly request authentication data from the server,
 * because they can rely on the shared context to know who the user is and
 * what permissions they have.
 *
 * This file is also really important for eliminating a practice called 'prop-drilling'
 * I will not explain what that is in this comment, feel free to search it up. Every project I have worked on that involved
 * prop-drilling was not fun to code on...
 *
 * Another side note, much of this authContext uses @tanstack/react-query which is an expansion on React's native useEffect
 * for handling remote API requests, whether that be fetching, caching, or synchronizing data states. If we were using useEffect
 * we would have to do a lot more work to handle local loading/error states and different configurations.
 */

import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as authService from "../services/authServices.js"
import * as userService from "../services/userServices.js"

// Creates the global authentication context that can be accessed anywhere in the application using useAuth()
const AuthContext = createContext(null);

/**
 * Wraps the application with the auth state.
 *
 * Exposes the current user, authentication status, loading state, and helper functions such as login, logout
 * updateUser, and deleteUser.
 */
export function AuthProvider({ children }) {

    // Used to invalidate and update the cached authentication data after mutations such as login, logout, and profile updates
    const queryClient = useQueryClient();

    /**
     * This is probably the most important command, this is responsible for retrieving the currently authenticated user.
     *
     * The result is cached under the "currentUser" query key (a unique identifier in the cache), allowing every component
     * in the application to access the same user data without having to make individual duplicate API requests.
     *
     * @tanstack/react-query allows us to specify if the function should retry on fail. For this specific one, we have that on false
     * because authentication failures are expected when a user is not logged in, and 9 times out of 10, any auth failure is due
     * to that reason.
     */
    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: userService.getCurrentUser,

        retry: false,
    })

    // Convenience values derived from the query^
    const user = query.data ?? null;
    const isLoading = query.isLoading;
    const isAuthenticated = !!query.data;

    /**
     * Handles user login using @tanstack/react-query's useMutation function.
     *
     * After a successful login, invalidates the cached user query so React Query will immediately fetch
     * the authenticated user's information.
     */
    const loginMutation = useMutation({
        mutationFn: authService.login,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            });
        }
    });

    /**
     * Handles user logout.
     *
     * Clears the entire React Query cache so no user/user-specific information remains after logging out.
     */
    const logoutMutation = useMutation({
        mutationFn: authService.logout,

        onSuccess: (data) => {
            queryClient.clear();
        }
    });

    /**
     * Updates the authenticated user's main profile settings.
     *
     * After the update completes successfully, invalidates the current user query so the application fetches and displays
     * the latest profile information.
     */
    const updateMutation = useMutation({
        mutationFn: (userSettings) => userService.updateUser(userSettings),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            })
        }
    });

    // Same as above, just for the user preferences table instead.
    const updatePreferencesMutation = useMutation({
        mutationFn: (userPreferences) => userService.updateUserPreferences(userPreferences),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["currentUser"],
            })

            queryClient.invalidateQueries({
                queryKey: ["events"],
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: userService.deleteUser,
    });

    // Makes the authentication state and helper functions available to every component wrapped by AuthProvider (see main.jsx)
    return <AuthContext.Provider
        value={{
            user,
            isAuthenticated,
            isLoading,

            login: loginMutation.mutateAsync,
            isLoggingIn: loginMutation.isPending,

            updateUser: updateMutation.mutateAsync,
            updatePreferences: updatePreferencesMutation.mutateAsync,

            logout: logoutMutation.mutateAsync,
            deleteUser: deleteMutation.mutateAsync,
        }}
    >
        {children}
    </AuthContext.Provider>
}

/**
 * This is the custom hook for accessing the auth context.
 *
 * Using this hook is preferred over calling useContext() directly because it provides a single, reusable interface function
 * for getting the auth context through the application. This way we can just run useAuth anywhere instead of having to rebuild
 * the AuthContext in that file then run useContext individually.
 */
export function useAuth() {
    return useContext(AuthContext);
}
