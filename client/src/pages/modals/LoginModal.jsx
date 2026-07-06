/**
 * LoginModal Modal
 *
 * Handles user authentication by allowing users to log into their account using an authContext function.
 *
 * Manages form state for username and password, handles login submission, and provides basic UI feedback for success
 * and error states (the success and error feedback was copy-pasted for all 3 modals (and other parts of the site)).
 *
 * @param {Function} params.onSwitch - passed from the AuthModal wrapper, allows the register and login modals to seamlessly
 * swap between each other
 *
 * @param {Function} params.onRequestClose - passed from the Modal wrapper (which receives it from AuthModal), but this allows
 * the LoginModal modal to tell the Modal.jsx wrapper when to animate closing automatically because the LoginModal closes itself
 * after a user logs in successfully.
 */

import { useState } from "react";
import {useAuth} from "../../context/AuthContext.jsx";

import idIcon from "../../assets/registration_modal_icons/id-card.png"
import passwordIcon from "../../assets/registration_modal_icons/padlock.png"
import openEyeIcon from "../../assets/registration_modal_icons/open-eye.png"

export default function LoginModal({ onSwitch, onRequestClose }) {
    const { login } = useAuth();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login({ username, password });

            setSuccess(true);

            setUsername("");
            setPassword("");

            setErrorMessage("");

            setTimeout(() => {
                onRequestClose()
            }, 1000);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("No Server Response");
            } else if (err.response?.status === 401) {
                setErrorMessage("Incorrect Username or Password");
            } else {
                setErrorMessage("Login Failed");
            }
        }
    };

    return (
        <>
            <div
                className={`
                flex flex-col gap-6
                w-full max-w-md 
                rounded-xl 
                border border-stone-200 
                bg-stone-50 dark:bg-zinc-800 dark:border-zinc-900 
                shadow-lg p-8 
                transition-colors duration-300
                `} onClick={(e) => e.stopPropagation()}
            >
                {success && (
                    <h1 className={"w-full px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm"}>
                        Login Successful!
                    </h1>
                )}

                {errorMessage && (
                    <p className={`
                    w-full 
                    px-4 py-3  
                    rounded-md 
                    border border-red-200 bg-red-50
                    text-red-700
                    text-sm
                    `}>
                        {errorMessage}
                    </p>
                )}

                <h1 className={"text-center text-2xl font-bold text-stone-700 dark:text-white"}>
                    Login
                </h1>

                <form onSubmit={handleLogin}>
                    <fieldset disabled={success} className={"flex flex-col gap-4"}>
                        <span
                            className={`
                            flex flex-wrap 
                            px-4 py-3 
                            gap-x-6 gap-y-2 
                            rounded-md 
                            border border-stone-300 bg-white 
                            text-stone-700 placeholder:text-stone-400 
                            focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 
                            transition-colors duration-300
                            `}
                            >
                            <div className={"flex items-center justify-center"}>
                                <img className={"h-5 w-auto object-contain opacity-50"} src={idIcon} alt={"Id Icon"} />
                            </div>
                            <input
                                type={"text"}
                                placeholder={"Username"}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete={"off"}
                                required={true}
                                className={"focus:outline-none"}
                            />
                        </span>

                        <span
                            className={`
                            flex flex-wrap 
                            px-4 py-3 
                            gap-x-6 gap-y-2 
                            rounded-md 
                            border border-stone-300 bg-white 
                            text-stone-800 placeholder:text-stone-400 
                            focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 
                            transition-colors duration-300
                            `}
                            >
                            <div className={"flex items-center justify-center"}>
                                <img className={"h-5 w-auto object-contain opacity-30"} src={passwordIcon} alt={"Pass Icon"} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={"Password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                                className={"focus:outline-none"}
                            />
                            <div className={"flex items-end ml-auto"}>
                                <button
                                    type={"button"}
                                    className={"focus:outline-none focus:ring-0"}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <img className={"h-5 w-auto object-contain opacity-50"} src={openEyeIcon} alt={"Pass Icon"} />
                                </button>
                            </div>
                        </span>

                        <button
                            type={"submit"}
                            disabled={!username || !password}
                            className={`
                            px-4 py-3
                            mt-2 rounded-md 
                            bg-stone-800 dark:bg-zinc-950/50 
                            hover:bg-stone-700 dark:hover:bg-white/5 disabled:bg-stone-700/50 dark:disabled:bg-zinc-950/25 
                            text-stone-50 font-medium
                            transition-color
                            `}
                        >
                            Login
                        </button>
                    </fieldset>
                </form>

                <div className={`flex items-center justify-center`}>
                    <button
                        type={"button"}
                        className={`
                            text-stone-600 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white
                            font-medium
                            transition-colors`}
                        onClick={onSwitch}
                    >
                        Not signed up? Create an account!
                    </button>
                </div>
            </div>
        </>
    )
}