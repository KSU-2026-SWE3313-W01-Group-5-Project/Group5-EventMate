import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {AuthModal} from "./modals/AuthModal.jsx";

import heroImage from "../assets/hero/homepage-hero.jpg"

/*
    Home PAGE

    This is a very basic example of a page. Obviously we will fill this home page out with a lot more in the future.
    See below for an example of how JSX looks.
*/

export default function Home() {
    const {user, isLoading, isError, logout} = useAuth();
    const navigate = useNavigate();

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
            <Navbar/>

            <main>
                <section className="relative h-[80vh] min-h-200">

                    <img
                        src={heroImage}
                        alt="People attending an event"
                        className="h-full w-full object-cover object-center"
                    />

                    <div
                        className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/50">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl mb-3 font-bold">Find Your Next Adventure</h1>

                        <p className="max-w-3xl px-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-stone-200">
                            From live music and sports to art shows and local festivals, your next great moment is
                            waiting.
                            Join a community of explorers and experience the world together.
                        </p>
                    </div>

                </section>
            </main>
            <div className={"flex flex-col gap-8"}>

                {renderUser()}

                <button onClick={() => navigate('/profile/?user=9874c882-9943-4eeb-b0e3-14dd2c061169')}>view profile 803a330c-dbae-4bf7-9e78-5a7da9543a13</button>
            </div>
        </>
    )
}
