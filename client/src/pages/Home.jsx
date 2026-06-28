import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {AuthModal} from "./modals/AuthModal.jsx";

import heroImage from "../assets/hero/pexels-michael-brennan-173741263-14591832.jpg"

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

            <main>

                <section className="relative h-[80vh] min-h-200">

                    <img
                        src={heroImage}
                        alt="People attending an event"
                        className="h-full w-full object-cover object-center"
                    />

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/50">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl mb-3 font-bold">Find Your Next Adventure</h1>


                    </div>



                </section>
            </main>
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