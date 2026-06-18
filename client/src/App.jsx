import {Route, Routes} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Login from "./pages/Login.jsx";

/*
    APP COMPONENT

    This file defines:
    - Global layout structure (navbar, footer, etc. if used here)
    - Application routes (page-level navigation)

    This is basically telling the website which page the user should see based on the actual url
    so https://ourwebsite.com/events would show a different page than https://ourwebsite.com/login
*/

export default function App() {
    return (
        <Routes>
            <Route path={"/"} element={<Home />}/>
            <Route path={"events"} element={<Events />}/>
            <Route path={"login"} element={<Login />}/>
        </Routes>
    )
}