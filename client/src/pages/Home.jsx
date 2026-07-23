/**
 * Home Page
 *
 * There will be some changes to this page going forward but probably nothing else major. We are playing with the idea
 * of having an element that displays random top events or something for everyone to see, we will see.
 */

import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {useAuth} from "../context/AuthContext.jsx";

import heroImage from "../assets/hero/homepage-hero.jpg"
import LoadingPage from "../components/LoadingPage.jsx";

export default function Home() {
    const {user, isLoading, isError, logout} = useAuth();
    const navigate = useNavigate();

    const renderUser = () => {
        if (isLoading) {
            return (
                <LoadingPage />
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
        </>
    )
}
