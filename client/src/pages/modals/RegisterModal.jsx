import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {login, register} from "../../services/authServices.js";

import emailIcon from "../../assets/mail.png";
import idIcon from "../../assets/id-card.png"
import passwordIcon from "../../assets/padlock.png"
import openEyeIcon from "../../assets/open-eye.png"

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterModal() {
    const queryClient = useQueryClient();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatch, setShowMatch] = useState(false);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword]);

    useEffect(() => {
        setErrorMessage('');
    }, [username, password, matchPassword]);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register({
                username,
                email,
                password
            });

            setSuccess(true);

            setUsername('');
            setPassword('');
            setMatchPassword('');
            setEmail('');
        } catch (err) {
            console.log(err);
        }
    }

    const handleShowPassword = (e) => {
        setShowPassword(!showPassword);
        e.stopPropagation();
    }

    return (
        <>
            <div
                className={`
            w-full max-w-md 
            rounded-xl 
            border border-stone-200 
            bg-stone-50 dark:bg-gray-800 dark:border-gray-900 
            shadow-lg p-8 
            transition-colors duration-300
            `} onClick={(e) => e.stopPropagation()}>
                <p className={errorMessage ? "bg-amber-200" : "hidden"}>{errorMessage}</p>

                <h1 className={"text-center text-2xl font-bold text-stone-800 dark:text-white mb-6"}>
                    Register
                </h1>

                <form onSubmit={handleRegister} className={"flex flex-col gap-4"}>
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
                    `}>
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
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <div className={`w-full ${userFocus && username && !validUsername ? "" : "hidden"}`}>
                            <p className={"text-xs text-black/60"}>
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </p>
                        </div>
                    </span>

                    <span
                        className={`
                    flex 
                    px-4 py-3 
                    gap-6 
                    rounded-md 
                    border border-stone-300 bg-white 
                    text-stone-800 placeholder:text-stone-400 
                    focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 
                    transition-colors duration-300
                    `}>
                        <div className={"flex items-center justify-center"}>
                            <img className={"h-5 w-auto object-contain opacity-50"} src={emailIcon} alt={"Email Icon"} />
                        </div>
                        <input
                            type={"email"}
                            placeholder={"Email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                            className={"w-full focus:outline-none"}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
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
                    transition-colors duration-300`}>
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
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <div className={"flex items-end ml-auto"}>
                            <button
                                type={"button"}
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                                className={"focus:outline-none focus:ring-0"}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img className={"h-5 w-auto object-contain opacity-50"} src={openEyeIcon} alt={"Pass Icon"} />
                            </button>
                        </div>
                        <div className={`w-full ${passwordFocus && password && !validPassword ? "" : "hidden"}`}>
                            <p className={"text-xs text-black/60"}>
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: !@#$%
                            </p>
                        </div>
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
                    `}>
                        <div className={"flex items-center justify-center"}>
                            <img className={"h-5 w-auto object-contain opacity-30"} src={passwordIcon} alt={"Pass Icon"} />
                        </div>
                        <input
                            type={showMatch ? "text" : "password"}
                            placeholder={"Confirm Password"}
                            value={matchPassword}
                            onChange={(e) => setMatchPassword(e.target.value)}
                            required={true}
                            className={"focus:outline-none"}
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <div className={"flex items-end ml-auto"}>
                            <button
                                type={"button"}
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                className={"focus:outline-none focus:ring-0"}
                                onClick={() => setShowMatch(!showMatch)}
                            >
                                <img className={"h-5 w-auto object-contain opacity-50"} src={openEyeIcon} alt={"Pass Icon"} />
                            </button>
                        </div>
                        <div className={`w-full ${matchFocus && !validMatch ? "" : "hidden"}`}>
                            <p className={"text-xs text-black/60"}>
                            Passwords must match.
                            </p>
                        </div>
                    </span>

                    <button
                        type="submit"
                        disabled={!validUsername || !validPassword || !validMatch}
                        className={`
                        px-4 py-3
                        mt-2 rounded-md 
                        bg-stone-800 dark:bg-gray-950/50 
                        hover:bg-stone-700 dark:hover:bg-white/5 disabled:bg-stone-700/50 dark:disabled:bg-gray-950/25 
                        text-stone-50 font-medium
                        transition-colors`}>
                        Register
                    </button>
                </form>
            </div>
        </>
    )
}