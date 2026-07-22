import Navbar from "./Navbar.jsx";
import {FourSquare} from "react-loading-indicators";

export default function LoadingPage() {
    return (
        <div className={`flex flex-col w-screen h-screen bg-stone-50 dark:bg-zinc-900`}>
            <div className={`m-auto`}>
                <FourSquare color="#27272a" size="medium" text="" textColor="" />
            </div>
        </div>
    )
}