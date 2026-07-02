import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useQueryClient} from "@tanstack/react-query";

import emailIcon from "../../assets/registration_modal_icons/mail.png";
import passwordIcon from "../../assets/registration_modal_icons/padlock.png"
import openEyeIcon from "../../assets/registration_modal_icons/open-eye.png"
import DeleteAccountModal from "../modals/DeleteAccountModal.jsx";
import Modal from "../../components/Modal.jsx";
import {useNavigate} from "react-router-dom";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Security() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [showAccountDeletion, setShowAccountDeletion] = useState(false);
    const [accountDeleted, setAccountDeleted] = useState(false);

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

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setErrorMessage('');
    }, [password, matchPassword]);

    const styles = {
        formInput: `flex px-4 py-3 gap-x-6 gap-y-2 rounded-md border border-stone-300 bg-white 
        text-stone-800 placeholder:text-stone-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
        transition-colors duration-300`,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const settings = {
            password: password,
            email: email,
        }

        const cleanSettings = Object.fromEntries(
            Object.entries(settings).filter(([key, value]) => {
                if (typeof value === "string") return value.trim() !== "";
                if (Array.isArray(value)) return value.length > 0;
                return true;
            })
        )

        try {
            await updateUser(cleanSettings);

            setSuccess(true);

            setPassword('');
            setMatchPassword('');

            setErrorMessage('');
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 409) {
                switch (err.response?.data?.error) {
                    case "EMAIL_TAKEN":
                        setErrorMessage('An account with that email already exists');
                        break;

                    default:
                        setErrorMessage("Updating Settings Failed");
                }
            } else {
                setErrorMessage('Updating Settings Failed');
            }
        }
    }

    const handleAccountDeletionClose = (e) => {
        setShowAccountDeletion(false);

        if (accountDeleted) {
            logout();
            navigate('/');
        }
    }

    return (
        <>
            <div className={`max-w-full h-full flex flex-col gap-5`}>
                {success && (
                    <h1 className={"w-full px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm"}>
                        Settings updated!
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

                <h1 className={`
                    text-xl font-semibold
                    text-stone-700 dark:text-white
                    `}>
                    Security
                </h1>

                <div className={`flex`}>
                    <form onSubmit={handleSubmit} className={`flex flex-col m-5 p-5 gap-15 min-w-1/2`}>
                        <div className={`flex flex-col gap-4`}>
                            <div
                                className={`${styles.formInput} flex-wrap`}
                            >
                                <div className={"flex items-center justify-center"}>
                                    <img className={"h-5 w-auto object-contain opacity-30"} src={passwordIcon} alt={"Pass Icon"} />
                                </div>
                                <h1>Change Password</h1>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                    className={"focus:outline-none flex-1"}
                                    placeholder={"Enter a new password"}
                                    onChange={(e) => setPassword(e.target.value)}
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

                                <div className={`w-0 basis-full ${passwordFocus && password && !validPassword ? "" : "hidden"}`}>
                                    <p className={"text-xs text-black/60"}>
                                        8 to 24 characters.<br />
                                        Must include uppercase and lowercase letters, a number and a special character.<br />
                                        Allowed special characters: !@#$%
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`${styles.formInput} flex-wrap`}
                            >
                                <div className={"flex items-center justify-center"}>
                                    <img className={"h-5 w-auto object-contain opacity-30"} src={passwordIcon} alt={"Pass Icon"} />
                                </div>
                                <h1>Confirm Password</h1>
                                <input
                                    type={showMatch ? "text" : "password"}
                                    value={matchPassword}
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    className={"focus:outline-none flex-1"}
                                    placeholder={"Confirm your new password"}
                                    onChange={(e) => setMatchPassword(e.target.value)}
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

                                <div className={`w-0 basis-full ${matchFocus && !validMatch ? "" : "hidden"}`}>
                                    <p className={"text-xs text-black/60"}>
                                        Passwords must match.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${styles.formInput} flex-wrap`}
                        >
                            <div className={"flex items-center justify-center"}>
                                <img className={"h-5 w-auto object-contain opacity-50"} src={emailIcon} alt={"Email Icon"} />
                            </div>
                            <h1>Change Email</h1>
                            <input
                                type={"email"}
                                value={email}
                                className={"focus:outline-none flex-1"}
                                placeholder={user.email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <div className={`w-0 basis-full ${emailFocus && email && !validEmail ? "" : "hidden"}`}>
                                <p className={"text-xs text-black/60"}>
                                    Letters, numbers, underscores, hyphens, periods, allowed.<br />
                                    Must have an '@' sign.
                                </p>
                            </div>
                        </div>

                        <div className={`justify-start`}>
                            <button
                                key={`submit`}
                                type={`submit`}
                                className={styles.formInput}
                            >
                                Save Changes
                            </button>
                        </div>

                        <div className={`justify-start`}>
                            <button
                                key={`submit`}
                                type={`button`}
                                className={`
                                flex 
                                px-4 py-3 gap-x-6 gap-y-2 
                                rounded-md border border-red-200 bg-red-50
                                text-red-700
                                focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-300/75 
                                transition-colors duration-300
                                `}
                                onClick={() => setShowAccountDeletion(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal isOpen={showAccountDeletion} onClose={handleAccountDeletionClose}>
                <DeleteAccountModal onDeleted={() => setAccountDeleted(true)} className={showAccountDeletion ? "" : "hidden"}></DeleteAccountModal>
            </Modal>
        </>
    )
}