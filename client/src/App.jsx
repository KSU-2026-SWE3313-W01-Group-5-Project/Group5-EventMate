/**
 * App Component (Root Router Configuration)
 *
 * This file defines the global routes for the entire application.
 *
 * Responsibilities:
 * - Maps URL paths to individual page components
 * - Wraps protected routes that require authentication with the ProtectedRoute component
 *
 * Route Structure:
 * - "/" -> Home page
 * - "/events" -> Events listing page
 * - "/profile/:id" -> Public profile page (protected)
 *
 * Nested Routes:
 * - Profile settings
 * - EventDetails.jsx preferences
 * - Security settings
 *
 * We use nested routes to keep the settings UI modular while all being on the same shared layout page.
 *
 * NOTE: Future refactor considerations:
 * As I have been looking at more and more examples of professional codebases and system designs, if I were to redesign this
 * entire system, I would probably split all of the components files into two dedicated hooks for logic and the components for UI.
 *
 * Honestly, I would really love to do that for this project, but that would just take so much effort and time to refactor. Next time...
 */

import {Navigate, Route, Routes} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsProfile from "./pages/settings/SettingsProfile.jsx";
import Preferences from "./pages/settings/Preferences.jsx";
import Security from "./pages/settings/Security.jsx";
import ProtectedRoute from "./components/settings_components/ProtectedRoute.jsx";

export default function App() {
    return (
        <Routes>
            <Route path={"/"} element={<Home />}/>

            <Route element={<ProtectedRoute />}>
                <Route path={"dashboard"} element={<Dashboard />}/>

                <Route path={"settings"} element={<Settings />}>
                    <Route index element={<Navigate to={"profile"} replace={true} />} />

                    <Route path={"profile"} element={<SettingsProfile />}></Route>
                    <Route path={"preferences"} element={<Preferences />}></Route>
                    <Route path={"security"} element={<Security />}></Route>
                </Route>
                <Route path={"profile/"} element={<Profile />}/>
            </Route>

        </Routes>
    )
}