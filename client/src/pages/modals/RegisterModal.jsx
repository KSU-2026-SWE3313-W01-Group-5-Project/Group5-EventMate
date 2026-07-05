import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { register } from "../../services/authServices.js";
import { useNavigate } from "react-router-dom";

import emailIcon from "../../assets/registration_modal_icons/mail.png";
import idIcon from "../../assets/registration_modal_icons/id-card.png"
import passwordIcon from "../../assets/registration_modal_icons/padlock.png"
import openEyeIcon from "../../assets/registration_modal_icons/open-eye.png"
import LocationTypeahead from "../../components/settings_components/LocationTypeahead.jsx";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterModal({ onSwitch, onRequestClose }) {
    const queryClient = useQueryClient();

    // auth states
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
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatch, setShowMatch] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setErrorMessage('');
    }, [username, password, matchPassword]);

    const handleRegister = async (e) => {
        e.preventDefault();

        const user = USER_REGEX.test(username);
        const pass = PWD_REGEX.test(password);

        if (!user || !pass) {
            setErrorMessage('Invalid Entry');
            return;
        }

        try {
            await register({
                firstName,
                lastName,
                username,
                email,
                password
            });

            setSuccess(true);

            setUsername('');
            setPassword('');
            setMatchPassword('');
            setEmail('');
            setFirstName('');
            setLastName('');

            setErrorMessage('');
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 409) {
                switch (err.response?.data?.error) {
                    case "USERNAME_TAKEN":
                        setErrorMessage('Username Taken');
                        break;

                    case "EMAIL_TAKEN":
                        setErrorMessage('An account with that email already exists');
                        break;

                    default:
                        setErrorMessage("Registration Failed");
                }
            } else {
                setErrorMessage('Registration Failed');
            }
        }
    }

    const styles = {
        formField: `flex flex-wrap
        px-4 py-3 
        gap-x-6 gap-y-2 
        rounded-md 
        border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 
        focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-500 
        transition-colors duration-300
        `
    }

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
                <>
                    {success && (
                        <h1 className={"w-full px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm"}>
                            Account Registered!
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

                    <h1 className={"text-center text-2xl font-bold mb-0 text-stone-700 dark:text-white"}>
                        Register
                    </h1>

                    <form onSubmit={handleRegister}>
                        <fieldset disabled={success} className={"flex flex-col gap-4"}>
                            <div className="flex gap-3">
                                <div
                                    className={`${styles.formField} flex-1 min-w-0`}
                                >
                                    <div className={"flex items-center justify-center"}>
                                        <img className={"h-5 w-auto object-contain opacity-50"} src={idIcon} alt={"Id Icon"} />
                                    </div>
                                    <input
                                        type={"text"}
                                        placeholder={"First Name"}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        autoComplete={"off"}
                                        required={true}
                                        className={"focus:outline-none flex-1 w-0"}
                                    />
                                </div>

                                <div
                                    className={`${styles.formField} flex-1 min-w-0`}
                                >
                                    <div className={"flex items-center justify-center"}>
                                        <img className={"h-5 w-auto object-contain opacity-50"} src={idIcon} alt={"Id Icon"} />
                                    </div>
                                    <input
                                        type={"text"}
                                        placeholder={"Last Name"}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        autoComplete={"off"}
                                        required={true}
                                        className={"focus:outline-none flex-1 w-0"}
                                    />
                                </div>
                            </div>

                            <div
                                className={styles.formField}
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
                            </div>

                            <div
                                className={styles.formField}
                            >
                                <div className={"flex items-center justify-center"}>
                                    <img className={"h-5 w-auto object-contain opacity-50"} src={emailIcon} alt={"Email Icon"} />
                                </div>
                                <input
                                    type={"email"}
                                    placeholder={"Email"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={true}
                                    className={"focus:outline-none"}
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                />
                                <div className={`w-full ${emailFocus && email && !validEmail ? "" : "hidden"}`}>
                                    <p className={"text-xs text-black/60"}>
                                        Letters, numbers, underscores, hyphens, periods, allowed.<br />
                                        Must have an '@' sign.
                                    </p>
                                </div>
                            </div>

                            <div
                                className={styles.formField}
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
                            </div>

                            <div
                                className={styles.formField}
                            >
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
                            </div>

                            <button
                                type="submit"
                                disabled={!validUsername || !validPassword || !validMatch || !firstName || !lastName || !validEmail}
                                className={`    
                                px-4 py-3
                                mt-2 rounded-md 
                                bg-stone-800 dark:bg-zinc-950/50 
                                hover:bg-stone-700 dark:hover:bg-white/5 disabled:bg-stone-700/50 dark:disabled:bg-zinc-950/25 
                                text-stone-50 font-medium
                                transition-colors`}
                            >
                                Register
                            </button>
                        </fieldset>
                    </form>
                </>
                <div className={`flex items-center justify-center`}>
                    <button
                        type={"button"}
                        className={`
                                text-stone-600 hover:text-stone-900 dark:text-gray-300 dark:hover:text-white
                                font-medium
                                transition-colors`}
                        onClick={onSwitch}
                    >
                        Already have an account? Sign in!
                    </button>
                </div>
            </div>
        </>
    )
}