/**
 * Security Settings Sub-page
 *
 * Allows users to update more sensitive account information, including password and email, as well as delete their account.
 *
 * This page performs the same password validation as the registration modal and ensures that emails are in the correct format.
 * Eventually if and when I added my email verification system into the project so we can hit the email notifications bonus requirement,
 * this page will also have to control reverifying a user's new email.
 *
 * This page is also where the DeleteAccountModal is used.
 *
 * Because this page handles sensitive user data, it includes multiple validation states (same as registration modal), confirmation
 * UI features, and safeguards.
 *
 * Design Note:
 * This page separates concerns between "update settings" and "account deletion" by putting deletion inside a dedicated modal.
 * This prevents accidental submission overlap and enforces an explicit user confirmation step for permanent deletion.
 *
 * ~ I am also really in love with my modal system, haha.
 */

import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";

import emailIcon from "../../assets/registration_modal_icons/mail.png";
import passwordIcon from "../../assets/registration_modal_icons/padlock.png"
import openEyeIcon from "../../assets/registration_modal_icons/open-eye.png"
import DeleteAccountModal from "../modals/DeleteAccountModal.jsx";
import Modal from "../../components/Modal.jsx";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "../../context/NotificationContext.jsx";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Security() {
    const {addNotification} = useNotifications()
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

        const pass = PWD_REGEX.test(password);

        if (!pass) {
            addNotification({
                kind: "error",
                title: "Invalid Password",
                subtitle: "Your password is not valid.",
                timeout: 5000,
            });
            return;
        }

        const settings = {
            password: password,
            email: email,
        }

        // Remove empty or invalid values before sending update request.
        // Prevents overwriting existing fields with empty strings.
        const cleanSettings = Object.fromEntries(
            Object.entries(settings).filter(([key, value]) => {
                if (typeof value === "string") return value.trim() !== "";
                if (Array.isArray(value)) return value.length > 0;
                return true;
            })
        )

        try {
            await updateUser(cleanSettings);

            addNotification({
                kind: "success",
                title: "Security Settings Updated",
                subtitle: "Your security settings have been successfully updated!",
                timeout: 5000,
            });

            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                addNotification({
                    kind: "error",
                    title: "Server Error",
                    subtitle: "The server failed to respond.",
                    timeout: 5000,
                });
            } else if (err.response?.status === 409) {
                switch (err.response?.data?.error) {
                    case "EMAIL_TAKEN":
                        addNotification({
                            kind: "warning",
                            title: "Updating Settings Failed",
                            subtitle: "An account with that email already exists.",
                            timeout: 5000,
                        });
                        break;

                    default:
                        addNotification({
                            kind: "error",
                            title: "Updating Settings Failed",
                            subtitle: "Your settings were not updated.",
                            timeout: 5000,
                        });
                }
            } else {
                addNotification({
                    kind: "error",
                    title: "Updating Settings Failed",
                    subtitle: "Your settings were not updated.",
                    timeout: 5000,
                });
            }
        }
    }

    /**
     * This one is an interesting feature I imagined and implemented. I realized that, originally, if I just logged the user
     * out immediately after they deleted their account, the only confirmation of their account being deleted they would get
     * is being instantly navigated back to the home page and logged out. I really did not like that, so I changed the delete
     * mutation in AuthContext to not invalidate the cache immediately.
     *
     * The way the system now works is, whenever a user deletes their account through the DeleteAccountModal, the success message
     * pops up on the modal and the modal indicates that the user's account has actually been deleted. Then, whenever the user
     * clicks anywhere else on the screen to close the modal (same system as every other modal), it tells this function that
     * the user has both closed the modal AND has actually deleted their account, not just opened it to see what it is without
     * deleting.
     *
     * After that, this function will then call logout from authContext to clear the cache of the deleted account, navigate to home,
     * and the user will be happy with their clear confirmation of account deletion.
     */
    const handleAccountDeletionClose = (e) => {
        setShowAccountDeletion(false);

        if (accountDeleted) {
            logout();
            navigate('/');
        }
    }

    return (
        <>
            {/* Much of this styling/structure was copied from the SettingsProfile (first settings page we built) and just
                changed to fit the purpose of this page. The same thing happened for the preferences page.

                Same goes for the password/confirm password and email inputs. Copied from the registration modal */}
            <div className={`max-w-full h-full flex flex-col gap-5`}>

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