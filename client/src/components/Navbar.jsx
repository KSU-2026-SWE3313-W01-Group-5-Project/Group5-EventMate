import {Link} from "react-router-dom";

/*
    REUSABLE COMPONENTS

    Components in this folder are:
    - reusable UI pieces
    - not full pages
    - can (and probably should) appear on multiple routes

    Example: Navbar, Buttons, Cards, Modals
    This one, the navbar, is the main navigation bar you see on most websites, and because we will be putting it on almost every page, we can just turn it into a component
    to save ourselves from having to recode it every time
*/

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            {" | "}
            <Link to="/events">Events</Link>
            {" | "}
            <Link to="/login">Login</Link>
        </nav>
    )
}