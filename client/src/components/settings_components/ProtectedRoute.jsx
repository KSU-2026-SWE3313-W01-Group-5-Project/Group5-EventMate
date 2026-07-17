/**
 * ProtectedRoute Component
 *
 * Responsible for verifying that an account is logged in on the user's browser before allowing them to access certain pages on the website
 * Examples:
 * User settings
 * Other user's profiles
 * Eventually the user dashboard and event feed
 * Connections pages
 * Messaging
 *
 * You can see the implementation of this route element in App.jsx
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingPage from "../LoadingPage.jsx";

export default function ProtectedRoute() {

    // Grabs the logged-in user's information from Auth Context
    const { user, isLoading } = useAuth();

    // isLoading is a safety function auth context returns when it is in the process of grabbing user information
    // the reason we need to check for this is because sometimes a page can render before the system has a chance to verify if a user is logged in or not
    // and without this check, the website would think a user is not logged in for a couple of seconds before the server has a chance to catch up

    // The main conflict I was having with that aforementioned issue is that the website would automatically redirect everyone to the home page even if you were logged in
    // whenever you refreshed the page. This is because the server was slower than the render and the page thought a user was not logged in for a couple of seconds
    if (isLoading) {
        return <LoadingPage />
    }

    // If no one is logged in (ie, if authContext returns nothing), automatically direct the user to the home page, the replace tag allows it to replace any page on the website
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If the user is authenticated and everything goes well, show the page that they were trying to access
    // the outlet tag is a react router component that holds a nested child route (the protected route, ie: settings page)
    // inside of the parent (this protected route file/wrapper in this case)
    return <Outlet />;
}