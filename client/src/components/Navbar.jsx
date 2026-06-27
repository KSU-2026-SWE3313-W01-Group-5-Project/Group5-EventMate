import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

import sunIcon from "../assets/navbar_icons/sun.png"
import moonIcon from "../assets/navbar_icons/crescent-moon.png"
import bellIcon from "../assets/navbar_icons/bell.png"
import userIcon from "../assets/navbar_icons/user.png"

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

/*
    I have added way more styling to this navbar component through the use of an extension called tailwind css, I definitely recommend looking into the docs as tailwind will make css styling
    way smoother and significantly less of a pain for the entire project

    A lot of this styling is tentative and just for me to get some early practice in with styling, but if everyone likes it im happy to continue a similar style
    I also plan on replacing some of the text buttons with icons whenever we actually start decorating stuff
 */

export default function Navbar() {
    const [dropDownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

    const navigation = [
        { name: "Home", link: "/", current: true },
        { name: "Events", link: "/events", current: false },
    ]

    useEffect(() => {
        const rootElement = document.documentElement;

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            rootElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            rootElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, []);

    const handleDarkMode = () => {
        const newTheme = theme === "dark" ? "light" : "dark";

        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.documentElement.classList.toggle("dark", newTheme === "dark");
    }

    return (
        <nav
            className={`
            flex items-center justify-between 
            bg-stone-100 dark:bg-gray-800
            text-stone-800 dark:text-white
            px-6 py-4 
            transition-colors duration-300
            `}
        >
            <div className="flex gap-6">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.link}
                        className={({ isActive }) =>
                            isActive
                                ? `bg-stone-700 dark:bg-gray-950/50 
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

            <div className="text-stone-700 dark:text-white font-bold text-lg absolute left-1/2 -translate-x-1/2">
                Placeholder logo
            </div>

            <div className="relative flex gap-4">
                <button
                    onClick={() => handleDarkMode()}
                    className={`
                    bg-stone-700 dark:bg-gray-950/50
                    rounded-full 
                    px-3 py-2 
                    transition-colors
                    `}
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

                <button
                    className={`
                    bg-stone-700 dark:bg-gray-950/50
                    rounded-full 
                    px-3 py-2 
                    transition-colors
                    `}
                >
                    <img
                        className={"h-5 w-auto object-contain"}
                        src={bellIcon}
                        alt="bell"
                    />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropDownOpen)}
                        className={`
                        flex items-center gap-2
                        bg-stone-700 dark:bg-gray-950/50 
                        rounded-full 
                        px-3 py-2
                        transition-colors
                        `}
                    >
                        <img
                            className={"h-5 w-auto object-contain"}
                            src={userIcon}
                            alt="user"
                        />
                    </button>

                    {dropDownOpen && (
                        <>
                            <div className="fixed inset-0" onClick={() => setDropdownOpen(false)}/>
                            <div
                                className={`
                                absolute right-0 mt-2 w-48 
                                bg-stone-50 border border-stone-200 dark:bg-gray-700 dark:border-gray-800 
                                rounded-md 
                                shadow-lg 
                                overflow-hidden
                                `}
                            >
                                <NavLink
                                    to={"/"}
                                    className={`
                                    block px-4 py-2 
                                    text-stone-700 hover:text-stone-900 dark:text-stone-50 dark:hover:text-stone-200
                                    hover:bg-stone-100 dark:hover:bg-gray-600 transition-colors
                                    `}
                                >
                                    Your Profile
                                </NavLink>

                                <NavLink
                                    to={"/"}
                                    className={`
                                    block px-4 py-2 
                                    text-stone-700 hover:text-stone-900 dark:text-stone-50 dark:hover:text-stone-200
                                    hover:bg-stone-100 dark:hover:bg-gray-600 transition-colors
                                    `}
                                >
                                    Settings
                                </NavLink>

                                <NavLink
                                    to={"/"}
                                    className={`
                                    block px-4 py-2 
                                    text-stone-700 hover:text-stone-900 dark:text-stone-50 dark:hover:text-stone-200
                                    hover:bg-stone-100 dark:hover:bg-gray-600 transition-colors
                                    `}
                                    >
                                    Sign out
                                </NavLink>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </nav>
    )
}