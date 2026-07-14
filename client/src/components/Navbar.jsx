/**
 * Navbar Component
 *
 * This is the most reused component on our website so far, it appears at the top of every single page.
 * Along with navigation between pages on our site, this component manages the dark mode selector, authentication modals (register, sign-in),
 * the user's dropdown menu for settings/profile/logout, and eventually notifications (if we have time to add that bonus feature).
 */

import {createSearchParams, NavLink, useNavigate, useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import sunIcon from "../assets/navbar_icons/sun.png"
import moonIcon from "../assets/navbar_icons/crescent-moon.png"
import bellIcon from "../assets/navbar_icons/bell.png"
import userIcon from "../assets/navbar_icons/user.png"
import {AuthModal} from "../pages/modals/AuthModal.jsx";
import getUserProfilePicture from "../utils/getUserProfilePicture.js";

export default function Navbar() {

    // Should be familiar by now, gets the currently authenticated user and logout function from Auth Context
    const { user, logout } = useAuth();

    // Used to determine whether an authentication modal should be open.
    // The current modal is specified through the URL's query parameters (https://ourwebsite.com/?modal=login for example)
    const [searchParams, setSearchParams] = useSearchParams();
    const modal = searchParams.get("modal");
    const isOpen = modal === "login" || modal === "register";

    // Controls whether the account dropdown menu is visible
    const [dropDownOpen, setDropdownOpen] = useState(false);

    // Stores the user's preferred color theme.
    // Defaults to the previously saved preferrence from the localStorage in the browser, or the operating system's preference if none is saved
    const [theme, setTheme] = useState(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

    // Handles navigating with react-router and defines every page displayed in the main navigation. Rendering from an array makes adding and removing
    // pages in the future very simple. Same logic as the settings sidebar page's array.
    const navigate = useNavigate();
    const navigation = [
        { name: "Home", link: "/", current: true },
        { name: "Events", link: "/events", current: false },
    ]

    //  Shared tailwind class strings to cut down on file length by shortening duplicate styling
    const styles = {
        iconButton: `bg-stone-700 dark:bg-zinc-900/50
        hover:bg-stone-600 dark:hover:bg-white/5
        text-stone-600 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white
        rounded-full px-3 py-2 transition-colors `,

        dropdownLink: `block px-4 py-2 
        text-left w-full
        text-stone-700 hover:text-stone-900 dark:text-stone-50 dark:hover:text-stone-200
        hover:bg-stone-100 dark:hover:bg-zinc-600 transition-colors`,
    }

    // Applies the selected dark/light theme to the root HTML element and stores the user's preference in localStorage so it persists
    useEffect(() => {
        const rootElement = document.documentElement;

        rootElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggles between light and dark mode
    const handleDarkMode = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
        );
    }

    /**
     * Opens the account dropdown if the user is logged in.
     * Otherwise, opens the login modal by updating the URL search parameters.
     */
    const handleUserDropdown = () => {
        if (user) {
            setDropdownOpen(!dropDownOpen)
        } else {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set("modal", "login");
                return params;
            });
        }
    }

    // Signs the current user out, returns them to the homepage, and closes the account dropdown.
    const handleLogout = () => {
        logout();
        navigate("/");
        setDropdownOpen(false);
    }

    return (
        <nav
            className={`
            relative z-50
            flex items-center justify-between 
            bg-stone-300/50 dark:bg-zinc-800
            text-stone-800 dark:text-white
            px-6 py-4 
            transition-colors duration-300
            `}
        >

            {/* Main site navigation (the main pages on the left of the navbar) */}
            <div className="flex gap-6">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.link}
                        className={({ isActive }) =>
                            isActive
                                ? `bg-stone-700 dark:bg-zinc-950/50 
                                text-stone-50 dark:text-white 
                                rounded-md px-3 py-2 
                                text-sm font-medium 
                                transition-colors`
                                : `hover:bg-stone-200 dark:hover:bg-white/5 
                                text-stone-600 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white 
                                rounded-md px-3 py-2 
                                text-sm font-medium 
                                transition-colors`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Temporary placeholder text until we design an EventMate logo */}
            <div className="text-stone-700 dark:text-white font-bold text-lg absolute left-1/2 -translate-x-1/2">
                Placeholder logo
            </div>

            {/* Navbar utility buttons */}
            <div className="relative flex gap-4">

                {/* Dark mode toggle */}
                <button
                    onClick={() => handleDarkMode()}
                    className={ styles.iconButton }
                >
                    <img
                        className={"h-5 w-auto object-contain dark:hidden"}
                        src={sunIcon}
                        alt="sun"
                    />

                    <img
                        className={"h-5 w-auto object-contain hidden dark:block"}
                        src={moonIcon}
                        alt="moon"
                    />
                </button>

                {/* Placeholder for future notifications functionality */}
                <button
                    className={ styles.iconButton }
                >
                    <img
                        className={"h-5 w-auto object-contain"}
                        src={bellIcon}
                        alt="bell"
                    />
                </button>

                {/* Opens either the account dropdown or the login modal */}
                <div className="relative">
                    <button
                        onClick={() => handleUserDropdown()}
                        className={ `${styles.iconButton} flex gap-2` }
                    >
                        <img
                            className={"h-5 w-auto object-contain rounded-full"}
                            src={user ? getUserProfilePicture(user.profile_picture_url) : userIcon}
                            alt="user"
                        />
                        {user ? <h2 className={"text-gray-300 dark:hover:text-white"}>{user.username}</h2> : null}
                    </button>

                    {/* User account dropdown menu */}
                    {dropDownOpen && user && (
                        <>

                            {/* Another one of those invisible full-screen overlays that closes the dropdown when clicked on */}
                            <div className={"fixed inset-0 z-40"} onClick={() => setDropdownOpen(false)}/>
                            <div
                                className={`
                                absolute right-0 mt-2 w-48 
                                bg-stone-50 border border-stone-200 dark:bg-zinc-700 dark:border-zinc-800 
                                rounded-md 
                                shadow-lg 
                                z-50
                                overflow-hidden
                                `}
                            >
                                <NavLink
                                    to={`/profile/?${createSearchParams({user: user.public_id})}`}
                                    className={ styles.dropdownLink }
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    My Profile
                                </NavLink>

                                <NavLink
                                    to={"/settings"}
                                    className={ styles.dropdownLink }
                                >
                                    Settings
                                </NavLink>

                                <button
                                    onClick={handleLogout}
                                    className={ styles.dropdownLink }
                                >
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}

                    {/* Authentication modal rendered once and controller through the URL query parameter, see pages/modals/AuthModal.jsx */}
                    <AuthModal modal={modal} isOpen={isOpen} />
                </div>
            </div>
        </nav>
    )
}