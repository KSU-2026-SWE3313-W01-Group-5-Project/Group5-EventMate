import {Navigate, Route, Routes} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsProfile from "./pages/settings/SettingsProfile.jsx";
import Preferences from "./pages/settings/Preferences.jsx";
import Security from "./pages/settings/Security.jsx";
import {useAuth} from "./context/AuthContext.jsx";

/*
    APP COMPONENT

    This file defines:
    - Global layout structure (navbar, footer, etc. if used here)
    - Application routes (page-level navigation)

    This is basically telling the website which page the user should see based on the actual url
    so https://ourwebsite.com/events would show a different page than https://ourwebsite.com/login
*/

export default function App() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path={"/"} element={<Home />}/>
            <Route path={"events"} element={<Events />}/>

            { user ?
                <>
                    <Route path={"settings"} element={<Settings />}>
                        <Route index element={<Navigate to={"profile"} replace={true} />} />

                        <Route path={"profile"} element={<SettingsProfile />}></Route>
                        <Route path={"preferences"} element={<Preferences />}></Route>
                        <Route path={"security"} element={<Security />}></Route>
                    </Route>
                    <Route path={"profile/:uuid"} element={<Profile />}/>
                </>
                : null
            }
        </Routes>
    )
}