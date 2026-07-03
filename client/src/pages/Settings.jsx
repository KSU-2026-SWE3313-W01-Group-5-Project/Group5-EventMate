import Navbar from "../components/Navbar.jsx";
import SettingsSidebar from "../components/settings_components/SettingsSidebar.jsx";
import {Outlet} from "react-router-dom";

export default function Settings() {
    return (
        <div className={`flex min-h-screen flex-col bg-stone-50 dark:bg-zinc-900 transition-colors duration-300`}>
            <Navbar />
            <main className={"flex flex-1"}>
                <SettingsSidebar />

                <section className={`
                flex-1
                text-stone-800 dark:text-white
                bg-stone-300/50 dark:bg-zinc-800 dark:border-zinc-800
                border-2 border-stone-200 
                shadow-lg 
                rounded-xl 
                
                m-4 p-6
                transition-colors duration-300
                `}>
                    <Outlet />
                </section>
            </main>
        </div>
    )
}