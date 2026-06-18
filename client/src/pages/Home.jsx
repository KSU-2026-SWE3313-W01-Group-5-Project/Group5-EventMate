import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

/*
    Home PAGE

    This is a very basic example of a page. Obviously we will fill this home page out with a lot more in the future.
    See below for an example of how JSX looks.
*/

export default function Home() {
    return (
        <>
            <Navbar />
            <div>
                <h1>Home</h1>
                <p>Welcome to the home page for this website!</p>
                <Link to="/events">View Events</Link>
            </div>
        </>
    )
}