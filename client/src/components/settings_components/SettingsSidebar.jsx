import { NavLink } from "react-router-dom";

const pages = [
    { name: "Profile", path: "profile" },
    { name: "Event Preferences", path: "preferences" },
    { name: "Security", path: "security" },
]

export default function SettingsSidebar() {
    return (
        <section className={`
        flex flex-col
        
        text-stone-700 dark:text-white
        bg-stone-100 dark:bg-zinc-800/50 dark:border-zinc-800
        border-2 border-stone-200 
        shadow-lg
        w-72 rounded-xl 
        m-4 p-6
        gap-6
        transition-colors duration-300
        `}>
            <h2 className={`text-2xl font-bold flex justify-center`}>
                Settings
            </h2>

            <hr className={`border-stone-700/70 dark:border-stone-400`}></hr>

            <nav className={`flex flex-col gap-2`}>
                {pages.map(page => (
                    <NavLink
                    key={page.path}
                    to={page.path}
                    className={({ isActive }) =>
                        isActive
                            ? `bg-stone-700 dark:bg-zinc-900/50 
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
                        {page.name}
                    </NavLink>
                ))}
            </nav>
        </section>
    )
}