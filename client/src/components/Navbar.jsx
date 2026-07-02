import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import sunIcon from "../assets/navbar_icons/sun.png"
import moonIcon from "../assets/navbar_icons/crescent-moon.png"
import bellIcon from "../assets/navbar_icons/bell.png"
import userIcon from "../assets/navbar_icons/user.png"
import {AuthModal} from "../pages/modals/AuthModal.jsx";

export default function Navbar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const modal = searchParams.get("modal");
    const isOpen = modal === "login" || modal === "register";

    const { user, logout } = useAuth();

    const [dropDownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

    const navigation = [
        { name: "Home", link: "/", current: true },
        { name: "Events", link: "/events", current: false },
    ]

//  Reusable styling
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
//

    useEffect(() => {
        const rootElement = document.documentElement;

        rootElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleDarkMode = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
        );
    }

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
            bg-stone-100 dark:bg-zinc-800
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

                <button
                    className={ styles.iconButton }
                >
                    <img
                        className={"h-5 w-auto object-contain"}
                        src={bellIcon}
                        alt="bell"
                    />
                </button>

                <div className="relative">
                    <button
                        onClick={() => handleUserDropdown()}
                        className={ `${styles.iconButton} flex gap-2` }
                    >
                        <img
                            className={"h-5 w-auto object-contain"}
                            src={userIcon}
                            alt="user"
                        />
                        {user ? <h2 className={"text-gray-300 dark:hover:text-white"}>{user.username}</h2> : null}
                    </button>

                    {dropDownOpen && user && (
                        <>
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
                                    to={`/profile/${user.username}`}
                                    className={ styles.dropdownLink }
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    My Profile
                                </NavLink>

                                <NavLink
                                    to={"settings"}
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

                    <AuthModal modal={modal} isOpen={isOpen} />
                </div>

            </div>
        </nav>
    )
}