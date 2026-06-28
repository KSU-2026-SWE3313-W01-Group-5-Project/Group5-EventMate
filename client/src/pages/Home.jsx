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

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const modal = searchParams.get("modal");
    const isOpen = modal === "login" || modal === "register";

    const handleLogout = () => {
        logout();
        navigate("/events");
    }

    return (
        <>
            <Navbar />
            <div className={"flex flex-col gap-8"}>
                <h1>Home</h1>
                <p>Welcome to the home page for this website!</p>

                <AuthModal modal={modal} isOpen={isOpen} navigate={navigate} />

                <button className={"bg-gray-500"} onClick={() => navigate("/?modal=login")}>Open Login Modal</button>
                <button className={"bg-gray-500"} onClick={() => navigate("/?modal=register")}>Open Register Modal</button>

                {renderUser()}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )
}