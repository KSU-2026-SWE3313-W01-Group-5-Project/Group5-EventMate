import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {AuthModal} from "./modals/AuthModal.jsx";

/*
    Home PAGE

    This is a very basic example of a page. Obviously we will fill this home page out with a lot more in the future.
    See below for an example of how JSX looks.
*/

export default function Home() {
    const { user, isLoading, isError, logout } = useAuth();

    const renderUser = () => {
        if (isLoading) {
            return (
                <span>Loading...</span>
            )
        }

        if (isError || !user) {
            return <span>Not logged in...</span>
        }

        return (
            <>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className={"flex flex-col gap-8"}>
                <h1>Home</h1>
                <p>Welcome to the home page for this website!</p>

                {renderUser()}
                <button onClick={logout}>Logout</button>
            </div>
        </>
    )
}