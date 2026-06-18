import {NavLink} from "react-router-dom";
import {useState} from "react";

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

    const navigation = [
        { name: "Home", link: "/", current: true },
        { name: "Events", link: "/events", current: false },
        { name: "Login", link: "/login", current: false },
    ]

    const rootElement = document.documentElement;

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage)) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        rootElement.classList.add('dark');
    } else {
        rootElement.classList.remove('dark');
    }

    const handleDarkMode = () => {
        if (rootElement.classList.contains('dark')) {
            rootElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            rootElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    return (
        <nav className="flex items-center justify-between bg-stone-100 text-stone-800 dark:bg-gray-800 px-6 py-4 dark:text-white transition-colors duration-300">
            <div className="flex gap-6">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.link}
                        className={({ isActive }) =>
                            isActive
                                ? "bg-stone-700 text-stone-50 dark:bg-gray-950/50 dark:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors"
                                : "text-stone-600 hover:bg-stone-200 hover:text-stone-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className="text-stone-800 dark:text-white font-bold text-lg absolute left-1/2 -translate-x-1/2">
                Placeholder logo
            </div>

            <div className="relative flex gap-6">
                <button onClick={() => handleDarkMode()}
                        className="text-stone-700 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                    Temp Dark Mode
                </button>
                <button
                    onClick={() => setDropdownOpen(!dropDownOpen)}
                    className="flex items-center gap-2 text-stone-700 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    <span>Account</span>
                </button>

                {dropDownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-stone-50 border border-stone-200 dark:bg-gray-700 dark:border-gray-800 rounded-md shadow-lg overflow-hidden">
                        <NavLink
                            to={"/"}
                            className="block px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-gray-600 dark:text-stone-50 dark:hover:text-stone-200 transition-colors"
                        >
                            Your Profile
                        </NavLink>

                        <NavLink
                            to={"/"}
                            className="block px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-gray-600 dark:text-stone-50 dark:hover:text-stone-200 transition-colors"
                        >
                            Settings
                        </NavLink>

                        <NavLink
                            to={"/"}
                            className="block px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-gray-600 dark:text-stone-50 dark:hover:text-stone-200 transition-colors"
                        >
                            Sign out
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    )
}