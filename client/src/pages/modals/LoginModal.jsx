import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {login, register} from "../../services/authServices.js";
import {useNavigate} from "react-router-dom";

export default function LoginModal() {
    const queryClient = useQueryClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login({ username, password });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className={"w-full max-w-md rounded-xl border border-stone-200 bg-stone-50 shadow-lg p-8 transition-colors duration-300 "} onClick={(e) => e.stopPropagation()}>
                <h1 className={"text-center text-2xl font-bold text-stone-800 mb-6"}>
                    Login
                </h1>

                <form onSubmit={handleLogin} className={"flex flex-col gap-4"}>
                    <input
                        type={"text"}
                        placeholder={"Username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={"px-4 py-3 rounded-md border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors duration-300"}
                    />
                    <input
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={"px-4 py-3 rounded-md border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors duration-300"}
                    />

                    <button type="submit" className={"mt-2 rounded-md bg-stone-700 text-stone-50 px-4 py-3 font-medium hover:bg-stone-800 transition-colors"}>
                        Login
                    </button>
                </form>
            </div>
        </>
    )
}